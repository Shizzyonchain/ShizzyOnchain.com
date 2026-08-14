from datetime import datetime, timedelta, timezone

import pytest

from app.api import _refresh_screener, app, chain_activity, health


class RecordingDatabase:
    def __init__(self):
        self.queries = []

    async def fetch(self, query, *args):
        self.queries.append(query)
        return []

    async def fetchrow(self, query, *args):
        self.queries.append(query)
        return {
            "locked_alpha_24h": 0,
            "unlocked_alpha_24h": 0,
            "locked_tao_24h": 0,
            "unlocked_tao_24h": 0,
            "stake_moves_24h": 0,
            "event_count_24h": 0,
            "tao_moved_24h": 0,
            "largest_move_tao_24h": 0,
            "active_subnets_24h": 0,
        }

    async def fetchval(self, query, *args):
        self.queries.append(query)


@pytest.mark.asyncio
async def test_activity_summary_filters_history_before_price_join():
    database = RecordingDatabase()
    app.state.db = database

    await chain_activity(netuid=None, limit=50)

    summary_query = database.queries[1]
    window_position = summary_query.index("WHERE time >= now()-interval '24 hours'")
    join_position = summary_query.index("LEFT JOIN LATERAL")
    assert window_position < join_position
    assert "FROM recent_events e" in summary_query


@pytest.mark.asyncio
async def test_screener_uses_yield_metrics_from_latest_sample():
    database = RecordingDatabase()
    app.state.db = database

    await _refresh_screener(app)

    query = database.queries[0]
    assert "conviction_locked_alpha,tempo" in query
    assert "staker_epoch_dividends_alpha,circulating_alpha" in query
    assert "last_yield" not in query
    assert "100 * l.conviction_locked_alpha / l.alpha_out" in query
    assert "l.alpha_reserve, 0) + COALESCE(l.alpha_out" not in query


class HealthDatabase:
    async def fetchval(self, _query):
        return 1

    def __init__(self, market_age_seconds):
        now = datetime.now(timezone.utc)
        self.rows = [
            {"block_number": 100, "block_time": now, "indexed_at": now},
            {"block_number": 99, "time": now - timedelta(seconds=market_age_seconds)},
        ]

    async def fetchrow(self, _query):
        return self.rows.pop(0)


@pytest.mark.asyncio
async def test_health_reports_actual_market_staleness():
    app.state.db = HealthDatabase(market_age_seconds=120)

    result = await health()

    assert result["status"] == "degraded"
    assert result["reason"].startswith("market prices stale by")
    assert result["market_lag_seconds"] >= 120
