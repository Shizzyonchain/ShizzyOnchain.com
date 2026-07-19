import asyncio
import hmac
from contextlib import asynccontextmanager
from datetime import datetime, timedelta, timezone

import uvicorn
from fastapi import Depends, FastAPI, Header, HTTPException, Query, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from fastapi.encoders import jsonable_encoder

from app.chain import ChainClient
from app.config import get_settings
from app.db import close, connect
from app.models import MassWalletRequest

settings = get_settings()


@asynccontextmanager
async def lifespan(app: FastAPI):
    app.state.db = await connect()
    yield
    await close()


app = FastAPI(title="ShizzyUnchained Subtensor API", version="0.1.0", lifespan=lifespan)
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins,
    allow_credentials=False,
    allow_methods=["GET", "POST"],
    allow_headers=["Content-Type", "X-API-Key"],
)


async def authorize(x_api_key: str | None = Header(None)):
    if settings.public_reads:
        return
    if not x_api_key or not any(hmac.compare_digest(x_api_key, key) for key in settings.api_keys):
        raise HTTPException(401, "Missing or invalid API key")


@app.get("/healthz")
async def health():
    try:
        await app.state.db.fetchval("SELECT 1")
        latest = await app.state.db.fetchrow(
            "SELECT block_number, block_time, indexed_at FROM chain_blocks ORDER BY block_number DESC LIMIT 1"
        )
        return {"status": "ok", "latest_indexed_block": dict(latest) if latest else None}
    except Exception as exc:
        raise HTTPException(503, f"database unavailable: {type(exc).__name__}") from exc


@app.get("/v1/subnets/prices", dependencies=[Depends(authorize)])
async def current_prices():
    rows = await app.state.db.fetch(
        """SELECT DISTINCT ON (p.netuid) p.netuid,s.name,s.symbol,p.time,p.block_number,
                  p.price_tao,p.tao_reserve,p.alpha_reserve,p.alpha_out,p.volume_tao
           FROM subnet_price_samples p LEFT JOIN subnets s USING(netuid)
           ORDER BY p.netuid,p.time DESC,p.block_number DESC"""
    )
    return {"data": [dict(row) for row in rows]}


@app.get("/v1/screener", dependencies=[Depends(authorize)])
async def screener():
    rows = await app.state.db.fetch(
        """WITH latest AS (
             SELECT DISTINCT ON (netuid) netuid,time,block_number,price_tao,tao_reserve,
                    alpha_reserve,alpha_out,volume_tao,tao_in_emission,alpha_out_emission,
                    emission_share,root_prop,conviction_locked_alpha
             FROM subnet_price_samples ORDER BY netuid,time DESC,block_number DESC
           )
           SELECT l.netuid,s.name,s.symbol,l.time,l.block_number,l.price_tao,
                  l.tao_reserve,l.alpha_reserve,l.alpha_out,
                  100 * l.emission_share AS emission_pct,
                  CASE WHEN l.root_prop IS NULL OR l.alpha_out <= 0 THEN NULL ELSE
                    100 * (POWER(
                      1 + (
                        l.alpha_out_emission * 0.41
                        * (1 - LEAST(GREATEST(l.root_prop, 0), 1))
                        * 7200 / l.alpha_out
                      )::double precision,
                      365
                    ) - 1)
                  END AS apy,
                  l.conviction_locked_alpha,
                  l.conviction_locked_alpha * l.price_tao AS conviction_locked_tao,
                  (l.price_tao *
                    (COALESCE(l.alpha_reserve, 0) + COALESCE(l.alpha_out, 0))) AS market_cap_tao,
                  l.volume_tao - COALESCE(v24.volume_tao,l.volume_tao) AS volume_24h_tao,
                  100 * (l.price_tao / NULLIF(p10.price_tao,0) - 1) AS change_10m,
                  100 * (l.price_tao / NULLIF(p1.price_tao,0) - 1) AS change_1h,
                  100 * (l.price_tao / NULLIF(p24.price_tao,0) - 1) AS change_24h,
                  100 * (l.price_tao / NULLIF(p7.price_tao,0) - 1) AS change_7d
           FROM latest l LEFT JOIN subnets s USING(netuid)
           LEFT JOIN LATERAL (
             SELECT price_tao FROM subnet_price_samples
             WHERE netuid=l.netuid AND time <= l.time - interval '10 minutes'
             ORDER BY time DESC LIMIT 1
           ) p10 ON true
           LEFT JOIN LATERAL (
             SELECT price_tao FROM subnet_price_samples
             WHERE netuid=l.netuid AND time <= l.time - interval '1 hour'
             ORDER BY time DESC LIMIT 1
           ) p1 ON true
           LEFT JOIN LATERAL (
             SELECT price_tao FROM subnet_price_samples
             WHERE netuid=l.netuid AND time <= l.time - interval '24 hours'
             ORDER BY time DESC LIMIT 1
           ) p24 ON true
           LEFT JOIN LATERAL (
             SELECT price_tao FROM subnet_price_samples
             WHERE netuid=l.netuid AND time <= l.time - interval '7 days'
             ORDER BY time DESC LIMIT 1
           ) p7 ON true
           LEFT JOIN LATERAL (
             SELECT volume_tao FROM subnet_price_samples
             WHERE netuid=l.netuid AND time <= l.time - interval '24 hours'
             ORDER BY time DESC LIMIT 1
           ) v24 ON true
           ORDER BY market_cap_tao DESC NULLS LAST"""
    )
    return {"data": [dict(row) for row in rows]}


@app.get("/v1/subnets/{netuid}/prices", dependencies=[Depends(authorize)])
async def historical_prices(
    netuid: int,
    start: datetime = Query(default_factory=lambda: datetime.now(timezone.utc) - timedelta(days=1)),
    end: datetime = Query(default_factory=lambda: datetime.now(timezone.utc)),
    interval: str = Query("1m", pattern="^(raw|1m|5m|10m|15m|1h|4h|1d)$"),
    limit: int = Query(5000, ge=1, le=10000),
):
    if start >= end or end - start > timedelta(days=366):
        raise HTTPException(422, "start must precede end; maximum range is 366 days")
    if interval != "raw":
        buckets = {"1m": "1 minute", "5m": "5 minutes", "10m": "10 minutes", "15m": "15 minutes",
                   "1h": "1 hour", "4h": "4 hours", "1d": "1 day"}
        rows = await app.state.db.fetch(
            f"""SELECT date_bin('{buckets[interval]}',time,TIMESTAMPTZ '2000-01-01') AS time,netuid,
                       (array_agg(price_tao ORDER BY time))[1] AS open,max(price_tao) AS high,
                       min(price_tao) AS low,(array_agg(price_tao ORDER BY time DESC))[1] AS close,
                       (array_agg(tao_reserve ORDER BY time DESC))[1] AS tao_reserve,
                       (array_agg(alpha_reserve ORDER BY time DESC))[1] AS alpha_reserve,
                       max(volume_tao)-min(volume_tao) AS volume_tao
                FROM subnet_price_samples WHERE netuid=$1 AND time >= $2 AND time < $3
                GROUP BY 1,2 ORDER BY 1 LIMIT $4""", netuid, start, end, limit,
        )
    else:
        rows = await app.state.db.fetch(
            """SELECT time,block_number,netuid,price_tao,tao_reserve,alpha_reserve,alpha_out
               FROM subnet_price_samples WHERE netuid=$1 AND time >= $2 AND time < $3
               ORDER BY time LIMIT $4""", netuid, start, end, limit,
        )
    return {"data": [dict(row) for row in rows]}


async def _persist_wallet(conn, result: dict, timestamp: datetime):
    await conn.execute(
        """INSERT INTO wallet_balance_snapshots
           (time,block_number,address,free_tao,staked_tao_value,total_tao_value)
           VALUES($1,$2,$3,$4,$5,$6) ON CONFLICT DO NOTHING""",
        timestamp, result["block_number"], result["address"], result["free_tao"],
        result["staked_tao_value"], result["total_tao_value"],
    )
    await conn.executemany(
        """INSERT INTO wallet_stake_snapshots(time,block_number,address,hotkey,netuid,alpha,tao_value)
           VALUES($1,$2,$3,$4,$5,$6,$7) ON CONFLICT DO NOTHING""",
        [(timestamp, result["block_number"], result["address"], stake["hotkey"], stake["netuid"],
          stake["alpha"], stake["tao_value"]) for stake in result["stakes"]],
    )


@app.post("/v1/wallets/mass-check", dependencies=[Depends(authorize)])
async def mass_wallet_check(body: MassWalletRequest):
    if len(body.addresses) > settings.max_mass_wallets:
        raise HTTPException(413, f"maximum {settings.max_mass_wallets} addresses per request")
    latest = await app.state.db.fetchrow(
        "SELECT block_number,block_hash,block_time FROM chain_blocks ORDER BY block_number DESC LIMIT 1"
    )
    if not latest:
        raise HTTPException(503, "indexer has not stored a block yet")
    semaphore = asyncio.Semaphore(settings.wallet_query_concurrency)
    async with ChainClient(settings) as chain:
        async def one(address):
            async with semaphore:
                try:
                    return await chain.wallet(address, latest["block_number"])
                except Exception as exc:
                    return {"address": address, "block_number": latest["block_number"], "free_tao": 0,
                            "staked_tao_value": None, "total_tao_value": None, "stakes": [],
                            "error": f"{type(exc).__name__}: wallet query failed"}
        results = await asyncio.gather(*(one(address) for address in body.addresses))
    subnet_rows = await app.state.db.fetch("SELECT netuid,name,symbol FROM subnets")
    subnet_identities = {row["netuid"]: dict(row) for row in subnet_rows}
    for result in results:
        for stake in result["stakes"]:
            identity = subnet_identities.get(stake["netuid"], {})
            stake["name"] = identity.get("name")
            stake["symbol"] = identity.get("symbol")
    if body.persist:
        async with app.state.db.acquire() as conn, conn.transaction():
            for result in results:
                if not result.get("error"):
                    await _persist_wallet(conn, result, latest["block_time"])
    return {"block_number": latest["block_number"], "data": results}


@app.get("/v1/wallets/{address}/history", dependencies=[Depends(authorize)])
async def wallet_history(address: str, limit: int = Query(1000, ge=1, le=10000)):
    rows = await app.state.db.fetch(
        """SELECT time,block_number,address,free_tao,staked_tao_value,total_tao_value
           FROM wallet_balance_snapshots WHERE address=$1 ORDER BY time DESC LIMIT $2""", address, limit,
    )
    return {"data": [dict(row) for row in rows]}


@app.websocket("/v1/ws/prices")
async def price_socket(websocket: WebSocket):
    key = websocket.query_params.get("api_key")
    if not settings.public_reads and not key:
        await websocket.close(code=4401)
        return
    if not settings.public_reads and not any(hmac.compare_digest(key, item) for item in settings.api_keys):
        await websocket.close(code=4403)
        return
    await websocket.accept()
    await websocket.send_json(jsonable_encoder(await current_prices()))
    try:
        while True:
            await asyncio.sleep(12)
            await websocket.send_json(jsonable_encoder(await current_prices()))
    except WebSocketDisconnect:
        pass
    finally:
        pass


def run():
    uvicorn.run("app.api:app", host="0.0.0.0", port=8000)
