import asyncio
import logging
from datetime import datetime, timezone


from app.backfill import sample_blocks
from app.chain import ChainClient
from app.config import get_settings
from app.db import close, connect
from app.rpc import finalized_heads

log = logging.getLogger("shizzy.indexer")
MAX_CATCHUP_BLOCKS = 250


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


async def persist_block(
    db,
    chain,
    number: int,
    announced_hash: str | None = None,
    include_events: bool = True,
    include_auxiliary: bool = True,
):
    info = await chain.block_info(number)
    block_hash = _block_hash(info) or announced_hash
    if not block_hash:
        raise RuntimeError(f"No hash returned for finalized block {number}")
    timestamp = _block_time(info)
    rows = await chain.subnets_at(
        number, include_auxiliary=include_auxiliary
    )
    events = []
    if include_events:
        try:
            events = await chain.events_at(number)
        except Exception as exc:
            log.warning("event read failed at finalized block %s: %s", number, exc)
    async with db.acquire() as conn, conn.transaction():
        claimed = await conn.fetchval(
            """INSERT INTO chain_blocks(block_number,block_hash,parent_hash,block_time)
               VALUES($1,$2,$3,$4) ON CONFLICT DO NOTHING RETURNING block_number""",
            number, block_hash, _parent_hash(info), timestamp,
        )
        if claimed is None:
            return
        await conn.executemany(
            """INSERT INTO subnets(netuid,name,symbol,first_seen_block,last_seen_block)
               VALUES($1,$2,$3,$4,$4) ON CONFLICT(netuid) DO UPDATE SET
               name=COALESCE(EXCLUDED.name,subnets.name), symbol=COALESCE(EXCLUDED.symbol,subnets.symbol),
               last_seen_block=EXCLUDED.last_seen_block""",
            [(r["netuid"], r["name"], r["symbol"], number) for r in rows],
        )
        await conn.executemany(
            """INSERT INTO subnet_price_samples
               (time,block_number,block_hash,netuid,price_tao,tao_reserve,alpha_reserve,alpha_out,volume_tao,
                tao_in_emission,alpha_out_emission,emission_share,root_prop,conviction_locked_alpha,
                tempo,staker_epoch_dividends_alpha)
               VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16) ON CONFLICT DO NOTHING""",
            [(timestamp, number, block_hash, r["netuid"], r["price_tao"], r["tao_reserve"],
              r["alpha_reserve"], r["alpha_out"], r["volume_tao"], r["tao_in_emission"],
              r["alpha_out_emission"], r["emission_share"], r["root_prop"],
              r["conviction_locked_alpha"], r["tempo"],
              r["staker_epoch_dividends_alpha"]) for r in rows],
        )
        if events:
            await conn.executemany(
                """INSERT INTO chain_events
                   (block_number,event_index,block_hash,time,event_type,netuid,
                    destination_netuid,coldkey,destination_coldkey,hotkey,
                    destination_hotkey,amount_alpha,amount_tao,perpetual,raw)
                   VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15::jsonb)
                   ON CONFLICT DO NOTHING""",
                [
                    (
                        number, event["event_index"], block_hash, timestamp,
                        event["event_type"], event["netuid"],
                        event["destination_netuid"], event["coldkey"],
                        event["destination_coldkey"], event["hotkey"],
                        event["destination_hotkey"], event["amount_alpha"],
                        event["amount_tao"], event["perpetual"], event["raw"],
                    )
                    for event in events
                ],
            )
    log.info(
        "indexed finalized block %s (%s subnets, %s tracked events)",
        number, len(rows), len(events),
    )


async def _missing_price_ranges(db, minimum_gap_blocks: int):
    return await db.fetch(
        """WITH ordered AS (
             SELECT block_number,block_time,
                    lead(block_number) OVER (ORDER BY block_number) AS next_block,
                    lead(block_time) OVER (ORDER BY block_number) AS next_time
             FROM chain_blocks
           )
           SELECT block_number AS start_block,next_block AS end_block,
                  block_time AS start_time,next_time AS end_time
           FROM ordered
           WHERE next_block-block_number > $1
             AND next_time-block_time > interval '90 seconds'
           ORDER BY block_number""",
        minimum_gap_blocks,
    )


async def backfill_missing_prices(db, settings):
    """Repair historical chart gaps with real archive-node state at one-minute resolution."""
    if not settings.backfill_price_gaps or not settings.backfill_ws_url:
        return
    step = max(1, settings.backfill_sample_blocks)
    ranges = await _missing_price_ranges(db, step)
    if not ranges:
        log.info("historical price backfill found no missing ranges")
        return
    total = sum(len(sample_blocks(row["start_block"], row["end_block"], step)) for row in ranges)
    log.warning(
        "historical price backfill found %s ranges (%s archive samples)",
        len(ranges),
        total,
    )
    completed = 0
    backfill_settings = settings.model_copy(update={"subtensor_ws_url": settings.backfill_ws_url})
    async with ChainClient(backfill_settings) as archive:
        semaphore = asyncio.Semaphore(max(1, settings.backfill_concurrency))

        async def repair(number):
            nonlocal completed
            async with semaphore:
                try:
                    await persist_block(
                        db,
                        archive,
                        number,
                        include_events=False,
                        include_auxiliary=False,
                    )
                except Exception:
                    log.exception(
                        "archive backfill failed at block %s; continuing", number
                    )
                    return
                completed += 1
                if completed % 25 == 0 or completed == total:
                    log.info(
                        "historical price backfill progress %s/%s",
                        completed,
                        total,
                    )

        for gap in ranges:
            log.warning(
                "repairing chart gap %s..%s (%s to %s)",
                gap["start_block"],
                gap["end_block"],
                gap["start_time"],
                gap["end_time"],
            )
            blocks = sample_blocks(
                gap["start_block"], gap["end_block"], step
            )
            await asyncio.gather(*(repair(number) for number in blocks))
    log.warning("historical price backfill completed %s/%s archive samples", completed, total)


async def backfill_loop(db, settings):
    while True:
        try:
            await backfill_missing_prices(db, settings)
        except asyncio.CancelledError:
            raise
        except Exception:
            log.exception("historical price backfill cycle failed")
        await asyncio.sleep(300)


async def indexer():
    settings = get_settings()
    logging.basicConfig(level=settings.log_level)
    db = await connect()
    last = await db.fetchval("SELECT max(block_number) FROM chain_blocks")
    if last is None and settings.indexer_start_block.isdigit():
        last = int(settings.indexer_start_block) - 1
    asyncio.create_task(backfill_loop(db, settings))
    retry_delay = 5
    while True:
        try:
            async with ChainClient(settings) as chain:
                async for head in finalized_heads(settings.subtensor_ws_url):
                    retry_delay = 5
                    gap = head["number"] - last if last is not None else 0
                    if last is not None and gap > MAX_CATCHUP_BLOCKS:
                        log.warning(
                            "indexer is %s blocks behind; jumping to finalized block %s",
                            gap,
                            head["number"],
                        )
                        start = head["number"]
                    else:
                        start = head["number"] if last is None else last + 1
                    for number in range(start, head["number"] + 1):
                        await persist_block(
                            db, chain, number,
                            head.get("hash") if number == head["number"] else None,
                        )
                        last = number
                raise ConnectionError("finalized-head stream ended")
        except asyncio.CancelledError:
            raise
        except Exception:
            log.exception("indexer connection failed; reconnecting in %s seconds", retry_delay)
            await asyncio.sleep(retry_delay)
            retry_delay = min(retry_delay * 2, 60)


async def main():
    try:
        await indexer()
    finally:
        await close()


def run():
    asyncio.run(main())


if __name__ == "__main__":
    run()
