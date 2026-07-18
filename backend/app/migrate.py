import asyncio
from pathlib import Path

import asyncpg

from app.config import get_settings


async def main():
    connection = await asyncpg.connect(get_settings().database_url)
    try:
        await connection.execute(Path("db/init.sql").read_text(encoding="utf-8"))
    finally:
        await connection.close()


if __name__ == "__main__":
    asyncio.run(main())
