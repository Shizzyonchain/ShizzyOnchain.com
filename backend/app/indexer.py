import asyncio
import logging
from datetime import datetime, timezone


from app.chain import ChainClient
from app.config import get_settings
from app.db import close, connect
from app.rpc import finalized_heads

log = logging.getLogger("shizzy.indexer")


def _block_hash(info) -> str:
    value = getattr(info, "hash", None) or getattr(info, "block_hash", None)
    if value is None and isinstance(info, dict):
        value = info.get("hash") or info.get("block_hash")
    return str(value) if value is not None else ""


def _parent_hash(info) -> str | None:
    header = getattr(info, "header", None)
    if header is None and isinstance(info, dict):
        header = info.get("header")
    if isinstance(header, dict):
        return header.get("parentHash") or header.get("parent_hash")
    return None


def _block_time(info) -> datetime:
    value = getattr(info, "timestamp", None)
    if value is None and isinstance(info, dict):
        value = info.get("timestamp")
    if isinstance(value, datetime):
        return value if value.tzinfo else value.replace(tzinfo=timezone.utc)
    return datetime.now(timezone.utc)


async def persist_block(db, chain, number: int, announced_hash: str | None = None):
    info = await chain.block_info(number)
    block_hash = _block_hash(info) or announced_hash
    if not block_hash:
        raise RuntimeError(f"No hash returned for finalized block {number}")
    timestamp = _block_time(info)
    rows = await chain.subnets_at(number)
    async with db.acquire() as conn, conn.transaction():
        exists = await conn.fetchval("SELECT 1 FROM chain_blocks WHERE block_number=$1", number)
        if exists:
            return
        await conn.execute(
            "INSERT INTO chain_blocks(block_number,block_hash,parent_hash,block_time) VALUES($1,$2,$3,$4)",
            number, block_hash, _parent_hash(info), timestamp,
        )
        await conn.executemany(
            """INSERT INTO subnets(netuid,name,symbol,first_seen_block,last_seen_block)
               VALUES($1,$2,$3,$4,$4) ON CONFLICT(netuid) DO UPDATE SET
               name=COALESCE(EXCLUDED.name,subnets.name), symbol=COALESCE(EXCLUDED.symbol,subnets.symbol),
               last_seen_block=EXCLUDED.last_seen_block""",
            [(r["netuid"], r["name"], r["symbol"], number) for r in rows],
        )
        await conn.executemany(
            """INSERT INTO subnet_price_samples
               (time,block_number,block_hash,netuid,price_tao,tao_reserve,alpha_reserve,alpha_out,volume_tao)
               VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9) ON CONFLICT DO NOTHING""",
            [(timestamp, number, block_hash, r["netuid"], r["price_tao"], r["tao_reserve"],
              r["alpha_reserve"], r["alpha_out"], r["volume_tao"]) for r in rows],
        )
    log.info("indexed finalized block %s (%s subnets)", number, len(rows))


async def indexer():
    settings = get_settings()
    logging.basicConfig(level=settings.log_level)
    db = await connect()
    async with ChainClient(settings) as chain:
        last = await db.fetchval("SELECT max(block_number) FROM chain_blocks")
        if last is None and settings.indexer_start_block.isdigit():
            last = int(settings.indexer_start_block) - 1
        async for head in finalized_heads(settings.subtensor_ws_url):
            start = head["number"] if last is None else last + 1
            for number in range(start, head["number"] + 1):
                await persist_block(db, chain, number, head.get("hash") if number == head["number"] else None)
                last = number


async def main():
    try:
        await indexer()
    finally:
        await close()


def run():
    asyncio.run(main())


if __name__ == "__main__":
    run()
