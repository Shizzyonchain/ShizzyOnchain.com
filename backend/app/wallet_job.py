import asyncio
import json
import logging
from decimal import Decimal

from app.chain import ChainClient


log = logging.getLogger("shizzy.wallet-worker")


def json_value(value):
    if isinstance(value, Decimal):
        return str(value)
    raise TypeError(f"cannot encode {type(value).__name__}")


async def claim_job(db):
    return await db.fetchrow(
        """UPDATE wallet_lookup_jobs SET status='processing',updated_at=now()
           WHERE id=(
             SELECT id FROM wallet_lookup_jobs WHERE status='queued'
             ORDER BY created_at FOR UPDATE SKIP LOCKED LIMIT 1
           )
           RETURNING id,addresses,total"""
    )


async def process_job(db, chain, job, concurrency: int):
    job_id = job["id"]
    raw_addresses = job["addresses"]
    addresses = json.loads(raw_addresses) if isinstance(raw_addresses, str) else list(raw_addresses)
    latest = await db.fetchrow(
        "SELECT block_number FROM chain_blocks ORDER BY block_number DESC LIMIT 1"
    )
    if not latest:
        raise RuntimeError("indexer has not stored a block yet")
    price_rows = await db.fetch(
        """SELECT DISTINCT ON (netuid) netuid,price_tao
           FROM subnet_price_samples ORDER BY netuid,time DESC,block_number DESC"""
    )
    subnet_prices = {row["netuid"]: row["price_tao"] for row in price_rows}
    identities = {
        row["netuid"]: dict(row)
        for row in await db.fetch("SELECT netuid,name,symbol FROM subnets")
    }
    await db.execute(
        "UPDATE wallet_lookup_jobs SET block_number=$2,updated_at=now() WHERE id=$1",
        job_id, latest["block_number"],
    )

    async def one(address):
        try:
            result = await chain.wallet(address, latest["block_number"], subnet_prices)
            for stake in result["stakes"]:
                identity = identities.get(stake["netuid"], {})
                stake["name"] = identity.get("name")
                stake["symbol"] = identity.get("symbol")
            return result
        except Exception as exc:
            return {
                "address": address, "block_number": latest["block_number"], "free_tao": 0,
                "staked_tao_value": None, "total_tao_value": None, "stakes": [],
                "error": f"{type(exc).__name__}: wallet query failed",
            }

    results = []
    batch_size = max(1, min(concurrency, 8))
    for start in range(0, len(addresses), batch_size):
        results.extend(await asyncio.gather(*(one(address) for address in addresses[start:start + batch_size])))
        await db.execute(
            """UPDATE wallet_lookup_jobs SET results=$2::jsonb,completed=$3,updated_at=now()
               WHERE id=$1""",
            job_id, json.dumps(results, default=json_value), len(results),
        )
    await db.execute(
        "UPDATE wallet_lookup_jobs SET status='complete',updated_at=now() WHERE id=$1", job_id
    )


async def wallet_job_loop(db, settings):
    await db.execute(
        """UPDATE wallet_lookup_jobs SET status='queued',updated_at=now()
           WHERE status='processing' AND updated_at < now() - interval '10 minutes'"""
    )
    retry_delay = 2
    while True:
        try:
            async with ChainClient(settings) as chain:
                retry_delay = 2
                while True:
                    job = await claim_job(db)
                    if not job:
                        await asyncio.sleep(1)
                        continue
                    try:
                        await process_job(db, chain, job, settings.wallet_query_concurrency)
                    except Exception as exc:
                        log.exception("wallet job %s failed", job["id"])
                        await db.execute(
                            """UPDATE wallet_lookup_jobs SET status='failed',error=$2,updated_at=now()
                               WHERE id=$1""",
                            job["id"], f"{type(exc).__name__}: wallet lookup failed",
                        )
        except asyncio.CancelledError:
            raise
        except Exception:
            log.exception("wallet worker connection failed; retrying in %s seconds", retry_delay)
            await asyncio.sleep(retry_delay)
            retry_delay = min(retry_delay * 2, 30)
