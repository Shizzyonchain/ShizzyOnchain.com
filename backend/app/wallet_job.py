import asyncio
import json
import logging
import time
from decimal import Decimal
from urllib.parse import urlsplit

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
        """SELECT known.netuid,latest.price_tao
           FROM subnets known
           JOIN LATERAL (
             SELECT price_tao FROM subnet_price_samples
             WHERE netuid=known.netuid
             ORDER BY time DESC,block_number DESC LIMIT 1
           ) latest ON true"""
    )
    subnet_prices = {row["netuid"]: row["price_tao"] for row in price_rows}
    identities = {
        row["netuid"]: dict(row) for row in await db.fetch("SELECT netuid,name,symbol FROM subnets")
    }
    await db.execute(
        "UPDATE wallet_lookup_jobs SET block_number=$2,updated_at=now() WHERE id=$1",
        job_id,
        latest["block_number"],
    )

    results = await chain.wallets(addresses, latest["block_number"], subnet_prices)
    for result in results:
        for stake in result["stakes"]:
            identity = identities.get(stake["netuid"], {})
            stake["name"] = identity.get("name")
            stake["symbol"] = identity.get("symbol")
    await db.execute(
        """UPDATE wallet_lookup_jobs SET results=$2::jsonb,completed=$3,updated_at=now()
           WHERE id=$1""",
        job_id,
        json.dumps(results, default=json_value),
        len(results),
    )
    await db.execute(
        "UPDATE wallet_lookup_jobs SET status='complete',updated_at=now() WHERE id=$1", job_id
    )


async def process_job_with_failover(db, settings, job):
    """Run a wallet lookup against each configured Finney endpoint in order."""
    errors = []
    for endpoint in settings.subtensor_ws_urls:
        endpoint_name = urlsplit(endpoint).hostname or "configured-rpc"
        started = time.monotonic()
        try:
            async with asyncio.timeout(settings.wallet_rpc_timeout_seconds):
                async with ChainClient(settings, endpoint_url=endpoint) as chain:
                    await process_job(
                        db,
                        chain,
                        job,
                        settings.wallet_query_concurrency,
                    )
            log.info(
                "wallet job completed job=%s endpoint=%s rpc_ms=%s wallets=%s",
                job["id"],
                endpoint_name,
                round((time.monotonic() - started) * 1000),
                job["total"],
            )
            return
        except asyncio.CancelledError:
            raise
        except Exception as exc:
            errors.append(type(exc).__name__)
            log.warning(
                "wallet RPC attempt failed job=%s endpoint=%s rpc_ms=%s error=%s",
                job["id"],
                endpoint_name,
                round((time.monotonic() - started) * 1000),
                type(exc).__name__,
                exc_info=True,
            )
    raise RuntimeError(
        f"all {len(settings.subtensor_ws_urls)} Finney endpoints failed ({', '.join(errors)})"
    )


async def wallet_job_loop(db, settings):
    await db.execute(
        """UPDATE wallet_lookup_jobs SET status='queued',updated_at=now()
           WHERE status='processing'"""
    )
    retry_delay = 2
    while True:
        try:
            job = await claim_job(db)
            retry_delay = 2
            if not job:
                await asyncio.sleep(1)
                continue
            try:
                await process_job_with_failover(db, settings, job)
            except Exception as exc:
                log.exception("wallet job %s failed after endpoint failover", job["id"])
                await db.execute(
                    """UPDATE wallet_lookup_jobs SET status='failed',error=$2,updated_at=now()
                       WHERE id=$1""",
                    job["id"],
                    f"{type(exc).__name__}: wallet lookup failed",
                )
        except asyncio.CancelledError:
            raise
        except Exception:
            log.exception("wallet worker connection failed; retrying in %s seconds", retry_delay)
            await asyncio.sleep(retry_delay)
            retry_delay = min(retry_delay * 2, 30)
