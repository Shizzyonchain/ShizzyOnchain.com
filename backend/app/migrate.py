import asyncio
from pathlib import Path

import asyncpg

from app.config import get_settings


async def main():
    connection = await asyncpg.connect(get_settings().database_url)
    try:
        # The web service and indexer can deploy the same commit together.
        # Serialize their schema runs so PostgreSQL never sees competing DDL.
        await connection.execute("SELECT pg_advisory_lock(726494779)")
        await connection.execute(Path("db/init.sql").read_text(encoding="utf-8"))
    finally:
        await connection.execute("SELECT pg_advisory_unlock(726494779)")
        await connection.close()


if __name__ == "__main__":
    asyncio.run(main())
