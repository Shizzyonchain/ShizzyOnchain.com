from datetime import datetime, timezone
from decimal import Decimal

from app.indexer import persist_price_tick


class RecordingDatabase:
    def __init__(self):
        self.inserts = []

    async def fetch(self, _query):
        return [{
            "netuid": 64,
            "tao_reserve": Decimal("100"),
            "alpha_reserve": Decimal("200"),
            "alpha_out": Decimal("300"),
            "volume_tao": Decimal("400"),
            "tao_in_emission": Decimal("1"),
            "alpha_out_emission": Decimal("2"),
            "emission_share": Decimal("0.3"),
            "root_prop": Decimal("0.4"),
            "conviction_locked_alpha": Decimal("50"),
            "tempo": 99,
            "staker_epoch_dividends_alpha": Decimal("6"),
            "circulating_alpha": Decimal("450"),
        }]

    async def executemany(self, query, rows):
        self.inserts.append((query, rows))


class FastPriceChain:
    async def block_info(self, number):
        return {
            "hash": f"0x{number}",
            "timestamp": datetime(2026, 8, 14, tzinfo=timezone.utc),
        }

    async def prices_at(self, number):
        assert number == 123
        return {64: Decimal("1.25")}


async def test_price_tick_carries_enrichment_without_full_subnet_scan():
    database = RecordingDatabase()

    await persist_price_tick(database, FastPriceChain(), 123)

    query, rows = database.inserts[0]
    assert "ON CONFLICT(time,netuid,block_number)" in query
    assert len(rows) == 1
    assert rows[0][3:7] == (
        64,
        Decimal("1.25"),
        Decimal("100"),
        Decimal("200"),
    )
    assert rows[0][13] == Decimal("50")
    assert rows[0][15] == Decimal("6")
    latest_query, latest_rows = database.inserts[1]
    assert "INSERT INTO subnet_latest_samples" in latest_query
    assert latest_rows == rows
