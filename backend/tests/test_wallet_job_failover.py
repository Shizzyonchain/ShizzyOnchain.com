import asyncio
from typing import ClassVar

import pytest

from app import wallet_job
from app.config import Settings


class FakeChainClient:
    entered: ClassVar[list[str]] = []

    def __init__(self, settings, endpoint_url=None):
        self.endpoint_url = endpoint_url

    async def __aenter__(self):
        self.entered.append(self.endpoint_url)
        return self

    async def __aexit__(self, *args):
        return None


async def test_wallet_job_falls_back_after_primary_failure(monkeypatch):
    FakeChainClient.entered = []
    settings = Settings(
        subtensor_ws_url="wss://primary.example",
        subtensor_ws_fallback_urls="wss://backup.example",
        wallet_rpc_timeout_seconds=1,
    )

    async def fake_process(db, chain, job, concurrency):
        if chain.endpoint_url == "wss://primary.example":
            raise ConnectionError("primary unavailable")

    monkeypatch.setattr(wallet_job, "ChainClient", FakeChainClient)
    monkeypatch.setattr(wallet_job, "process_job", fake_process)

    await wallet_job.process_job_with_failover(None, settings, {"id": "job-1", "total": 1})

    assert FakeChainClient.entered == [
        "wss://primary.example",
        "wss://backup.example",
    ]


async def test_wallet_job_falls_back_after_endpoint_timeout(monkeypatch):
    FakeChainClient.entered = []
    settings = Settings(
        subtensor_ws_url="wss://primary.example",
        subtensor_ws_fallback_urls="wss://backup.example",
        wallet_rpc_timeout_seconds=0.01,
    )

    async def fake_process(db, chain, job, concurrency):
        if chain.endpoint_url == "wss://primary.example":
            await asyncio.sleep(0.1)

    monkeypatch.setattr(wallet_job, "ChainClient", FakeChainClient)
    monkeypatch.setattr(wallet_job, "process_job", fake_process)

    await wallet_job.process_job_with_failover(None, settings, {"id": "job-2", "total": 1})

    assert FakeChainClient.entered[-1] == "wss://backup.example"


async def test_wallet_job_reports_failure_only_after_all_endpoints(monkeypatch):
    FakeChainClient.entered = []
    settings = Settings(
        subtensor_ws_url="wss://primary.example",
        subtensor_ws_fallback_urls="wss://backup.example",
        wallet_rpc_timeout_seconds=1,
    )

    async def fake_process(db, chain, job, concurrency):
        raise ConnectionError("unavailable")

    monkeypatch.setattr(wallet_job, "ChainClient", FakeChainClient)
    monkeypatch.setattr(wallet_job, "process_job", fake_process)

    with pytest.raises(RuntimeError, match="all 2 Finney endpoints failed"):
        await wallet_job.process_job_with_failover(None, settings, {"id": "job-3", "total": 1})
