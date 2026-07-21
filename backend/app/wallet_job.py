import asyncio
import json
import logging
import sys
from decimal import Decimal

import asyncpg

from app.chain import ChainClient
from app.config import get_settings


def json_value(value):
    if isinstance(value, Decimal):
        return str(value)
    raise TypeError(f"cannot encode {type(value).__name__}")


async def run(job_id: str):
    settings = get_settings()
    db = await asyncpg.connect(settings.database_url)
    try:
        job = await db.fetchrow("SELECT addresses FROM wallet_lookup_jobs WHERE id=$1", job_id)
        if not job:
            return
        addresses = list(job["addresses"])
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
        results = []
        await db.execute(
            "UPDATE wallet_lookup_jobs SET status='processing',block_number=$2,updated_at=now() WHERE id=$1",
            job_id, latest["block_number"],
        )
        async with ChainClient(settings) as chain:
            for address in addresses:
                try:
                    result = await chain.wallet(address, latest["block_number"], subnet_prices)
                    for stake in result["stakes"]:
                        identity = identities.get(stake["netuid"], {})
                        stake["name"] = identity.get("name")
                        stake["symbol"] = identity.get("symbol")
                except Exception as exc:
                    result = {
                        "address": address, "block_number": latest["block_number"], "free_tao": 0,
                        "staked_tao_value": None, "total_tao_value": None, "stakes": [],
                        "error": f"{type(exc).__name__}: wallet query failed",
                    }
                results.append(result)
                await db.execute(
                    """UPDATE wallet_lookup_jobs SET results=$2::jsonb,completed=$3,updated_at=now()
                       WHERE id=$1""",
                    job_id, json.dumps(results, default=json_value), len(results),
                )
        await db.execute(
            "UPDATE wallet_lookup_jobs SET status='complete',updated_at=now() WHERE id=$1", job_id
        )
    except Exception as exc:
        logging.exception("wallet job %s failed", job_id)
        await db.execute(
            "UPDATE wallet_lookup_jobs SET status='failed',error=$2,updated_at=now() WHERE id=$1",
            job_id, f"{type(exc).__name__}: wallet lookup failed",
        )
    finally:
        await db.close()


if __name__ == "__main__":
    asyncio.run(run(sys.argv[1]))
