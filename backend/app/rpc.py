import asyncio
import json

import websockets


async def finalized_heads(
    url: str,
    *,
    connect_timeout: float = 8,
    subscribe_timeout: float = 8,
):
    """Yield finalized headers from one endpoint; the caller owns failover."""
    async with websockets.connect(
        url,
        open_timeout=connect_timeout,
        close_timeout=5,
        ping_interval=20,
        ping_timeout=20,
        max_size=2**22,
    ) as ws:
        await ws.send(json.dumps({
            "jsonrpc": "2.0", "id": 1, "method": "chain_subscribeFinalizedHeads", "params": []
        }))
        async with asyncio.timeout(subscribe_timeout):
            response = json.loads(await ws.recv())
        if "error" in response:
            raise RuntimeError(response["error"])
        if "result" not in response:
            raise RuntimeError("Finney endpoint did not acknowledge finalized-head subscription")
        while True:
            # A full subnet snapshot can take longer than Finney's block interval.
            # Drain already-buffered notifications so the indexer sees the newest
            # finalized height instead of walking an ever-growing websocket queue.
            message = await ws.recv()
            while True:
                try:
                    message = await asyncio.wait_for(ws.recv(), timeout=0.001)
                except TimeoutError:
                    break
            payload = json.loads(message)
            result = payload.get("params", {}).get("result")
            if result:
                yield {
                    "number": int(result["number"], 16),
                    "hash": result.get("hash"),
                    "parent_hash": result.get("parentHash"),
                }

