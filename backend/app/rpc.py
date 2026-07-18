import asyncio
import json

import websockets


async def finalized_heads(url: str):
    """Yield Substrate finalized headers, reconnecting with exponential backoff."""
    delay = 1
    while True:
        try:
            async with websockets.connect(url, ping_interval=20, ping_timeout=20, max_size=2**22) as ws:
                await ws.send(json.dumps({
                    "jsonrpc": "2.0", "id": 1, "method": "chain_subscribeFinalizedHeads", "params": []
                }))
                response = json.loads(await ws.recv())
                if "error" in response:
                    raise RuntimeError(response["error"])
                delay = 1
                async for message in ws:
                    payload = json.loads(message)
                    result = payload.get("params", {}).get("result")
                    if result:
                        yield {
                            "number": int(result["number"], 16),
                            "hash": result.get("hash"),
                            "parent_hash": result.get("parentHash"),
                        }
        except asyncio.CancelledError:
            raise
        except Exception:
            await asyncio.sleep(delay)
            delay = min(delay * 2, 30)

