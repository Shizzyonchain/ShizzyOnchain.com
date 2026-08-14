import asyncio
import json

import pytest

from app import rpc


class FakeWebSocket:
    def __init__(self):
        self.messages = [
            json.dumps({"jsonrpc": "2.0", "id": 1, "result": "subscription-id"}),
            self.head(100),
            self.head(101),
            self.head(102),
        ]

    @staticmethod
    def head(number):
        return json.dumps({
            "params": {
                "result": {
                    "number": hex(number),
                    "hash": f"0x{number}",
                    "parentHash": f"0x{number - 1}",
                }
            }
        })

    async def send(self, _message):
        return None

    async def recv(self):
        if self.messages:
            return self.messages.pop(0)
        await asyncio.sleep(1)


class FakeConnection:
    def __init__(self, websocket):
        self.websocket = websocket

    async def __aenter__(self):
        return self.websocket

    async def __aexit__(self, *_args):
        return None


@pytest.mark.asyncio
async def test_finalized_heads_coalesces_buffered_notifications(monkeypatch):
    websocket = FakeWebSocket()
    monkeypatch.setattr(
        rpc.websockets,
        "connect",
        lambda *_args, **_kwargs: FakeConnection(websocket),
    )

    heads = rpc.finalized_heads("wss://finney.example")
    latest = await anext(heads)
    await heads.aclose()

    assert latest["number"] == 102
    assert latest["hash"] == "0x102"
