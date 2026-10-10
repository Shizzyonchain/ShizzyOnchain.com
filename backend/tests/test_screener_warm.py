import asyncio
from types import SimpleNamespace

import pytest

from app.api import _keep_screener_warm, app, screener


@pytest.mark.asyncio
async def test_read_uses_warm_snapshot_without_waiting_for_database():
    class UnavailableDatabase:
        async def fetch(self, *args):
            raise AssertionError("visitor should not trigger database work")

    app.state.db = UnavailableDatabase()
    app.state.screener_cache = {"data": [{"netuid": 64, "price_1h_tao": 1}]}
    assert await screener() == app.state.screener_cache


@pytest.mark.asyncio
async def test_background_retries_failed_history_without_any_visitors(monkeypatch):
    import app.api as api

    calls = []

    async def live(current_app):
        calls.append("live")

    async def history(current_app):
        calls.append("history")
        if calls.count("history") == 1:
            raise TimeoutError()

    async def sleep(seconds):
        assert seconds == 6
        if calls.count("history") == 2:
            raise asyncio.CancelledError()

    monkeypatch.setattr(api, "_refresh_live_screener", live)
    monkeypatch.setattr(api, "_refresh_screener", history)
    monkeypatch.setattr(api.asyncio, "sleep", sleep)
    with pytest.raises(asyncio.CancelledError):
        await _keep_screener_warm(SimpleNamespace())
    assert calls == ["live", "history", "live", "history"]
