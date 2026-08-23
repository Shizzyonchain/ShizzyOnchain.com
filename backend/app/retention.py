import asyncio
import logging


log = logging.getLogger("shizzy.retention")


async def prune_raw_price_samples(db, retention_days: int):
    """Bound high-frequency raw history; minute candles and latest prices are separate."""
    days = max(1, retention_days)
    result = await db.execute(
        """DELETE FROM subnet_price_samples
           WHERE time < now() - ($1 * interval '1 day')""",
        days,
    )
    deleted = int(result.rsplit(" ", 1)[-1])
    log.info(
        "raw price retention cleanup deleted=%s retention_days=%s",
        deleted,
        days,
    )
    return deleted


async def retention_loop(db, settings):
    while True:
        try:
            await prune_raw_price_samples(db, settings.raw_price_retention_days)
        except asyncio.CancelledError:
            raise
        except Exception:
            log.exception("raw price retention cleanup failed")
        await asyncio.sleep(max(300, settings.raw_price_cleanup_interval_seconds))
