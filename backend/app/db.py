import asyncpg

from app.config import get_settings

pool: asyncpg.Pool | None = None


async def connect() -> asyncpg.Pool:
    global pool
    if pool is None:
        pool = await asyncpg.create_pool(get_settings().database_url, min_size=1, max_size=10)
    return pool


async def close() -> None:
    global pool
    if pool:
        await pool.close()
        pool = None

