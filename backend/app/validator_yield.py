"""Independent alpha-share reward checks. No chain calls occur in HTTP reads.

Share-pool accounting: opentensor/subtensor primitives/share-pool/src/lib.rs.
Deposits buy shares; pool-wide rewards increase alpha per share. Operator fees
mint operator shares, so an ordinary nominator's share price is already net.
This is a consistency check, not certification of the provider's averaging.
"""
import asyncio
import hashlib
import json
import logging
import math
from datetime import datetime, timezone
from decimal import Decimal, localcontext

import websockets
from app.yield_math import annualized_return

log = logging.getLogger("shizzy.validator_yield")
MODULE = "658faa385070e074c85bf6b568cf0555"
PREFIXES = {
    "alpha": MODULE + "ee25c3b5b1886863480497907f1829e6",
    "shares": MODULE + "e47c637aa82c21537eb9caa511e543c5",
    "legacy": MODULE + "3dbb78074d07a16f4942c7df159ed5e5",
    "epoch": MODULE + "d851552cd35f25e6f62c168db3aa2838",
    "registration": MODULE + "271d29b9b717ce3d8c571f1cbc180fa2",
    "owner": MODULE + "eca6b7a1fdc9f689184ecb4f359c0518",
    "owner_shares": MODULE + "421d8174603a6a6036511a7619b402f0",
    "owner_legacy": MODULE + "7261f9a8fde18018cccf70368697902f",
    "owner_epoch": MODULE + "7d5f646b6504d6b113791974df342604",
}
TIME_KEY = "0xf0c365c3cf59d671eb72da0e7a4113c49f1f0515f462cdcf84e0f1d6045dfcbb"
SCHEMA = """
CREATE TABLE IF NOT EXISTS validator_yield_checks (
 netuid INTEGER PRIMARY KEY, payload JSONB NOT NULL, result JSONB,
 state TEXT NOT NULL DEFAULT 'queued', requested_at TIMESTAMPTZ NOT NULL DEFAULT now(),
 started_at TIMESTAMPTZ, checked_at TIMESTAMPTZ, error TEXT,
 last_viewed_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE validator_yield_checks ADD COLUMN IF NOT EXISTS last_viewed_at TIMESTAMPTZ NOT NULL DEFAULT now();
"""


def account_bytes(address):
    alphabet = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz"
    number = 0
    for char in address:
        number = number * 58 + alphabet.index(char)
    raw = number.to_bytes((number.bit_length() + 7) // 8, "big")
    raw = b"\x00" * (len(address) - len(address.lstrip("1"))) + raw
    if len(raw) != 35 or raw[0] != 42:
        raise ValueError("Unsupported hotkey address")
    if hashlib.blake2b(b"SS58PRE" + raw[:-2], digest_size=64).digest()[:2] != raw[-2:]:
        raise ValueError("Invalid hotkey checksum")
    return raw[1:33]


def pool_suffix(hotkey, netuid):
    account = account_bytes(hotkey)
    return hashlib.blake2b(account, digest_size=16).hexdigest() + account.hex() + netuid.to_bytes(2, "little").hex()


def uint(value, size, *, default=None):
    if value is None and default is not None:
        return default
    raw = bytes.fromhex((value or "").removeprefix("0x"))
    if len(raw) != size:
        raise ValueError("Unsupported or missing chain storage")
    return int.from_bytes(raw, "little")


def share_value(shares, legacy):
    with localcontext() as context:
        context.prec = 70
        if shares is not None:
            raw = bytes.fromhex(shares.removeprefix("0x"))
            if len(raw) != 24:
                raise ValueError("Unknown share format")
            mantissa = int.from_bytes(raw[:16], "little")
            exponent = int.from_bytes(raw[16:], "little", signed=True)
            if not 0 <= mantissa <= 10**21 or not -512 <= exponent <= 512:
                raise ValueError("Invalid share denominator")
            denominator = Decimal(mantissa) * Decimal(10) ** exponent
            encoding = "safe-float-v2"
        else:
            denominator = Decimal(uint(legacy, 16)) / Decimal(2**64)
            encoding = "fixed-v1"
        return denominator, encoding


def pool_rate(alpha, shares, legacy, epoch, registration):
    total = uint(alpha, 8)
    denominator, encoding = share_value(shares, legacy)
    with localcontext() as context:
        context.prec = 70
        if total <= 0 or denominator <= 0:
            raise ValueError("Empty stake pool")
        return {"rate": Decimal(total) / denominator, "epoch": uint(epoch, 8, default=0),
                "registration": uint(registration, 8), "encoding": encoding, "shares": denominator}


def sole_operator(point, shares, legacy, owner_epoch):
    if uint(owner_epoch, 8, default=0) != point["epoch"] or (shares is None and legacy is None):
        return False
    owner_share, encoding = share_value(shares, legacy)
    if encoding != point["encoding"]:
        raise ValueError("Owner and pool share formats differ")
    # SafeFloat rounding may put an owner's stored share marginally above D.
    # Null owner credits can use a direct sole-member credit, including take.
    # Such growth is not evidence of an ordinary nominator's after-fee return.
    return owner_share >= point["shares"] * Decimal("0.999999999999999999")


def compare_window(points, days, provider):
    selected = points[:days + 1]  # newest first, exactly 7,200 blocks per step
    if len(selected) != days + 1 or any(point is None for point in selected):
        return {"status": "unavailable", "reason": "Complete historical chain state is unavailable."}
    if any(point.get("soleOperator", False) for point in selected):
        return {"status": "unavailable", "reason": "Operator-only stake pool inside this window; owner income cannot be presented as ordinary nominator yield."}
    if len({(p["epoch"], p["registration"], p["encoding"]) for p in selected}) != 1:
        return {"status": "unavailable", "reason": "Pool reset, subnet registration or share format changed inside this window."}
    try:
        with localcontext() as context:
            context.prec = 70
            ratio = selected[0]["rate"] / selected[-1]["rate"]
            log_return = float(ratio.ln())
        observed = math.expm1(log_return)
        apr, apy = annualized_return(observed, 365 / days)
    except (OverflowError, ValueError):
        return {"status": "unavailable", "reason": "Chain return cannot be safely annualized."}
    if any(v is None or not math.isfinite(v) for v in [apy, apr, observed]):
        return {"status": "unavailable", "reason": "Non-finite return."}
    base = {"chainApy": apy, "chainApr": apr, "observedReturn": observed, "days": days,
            "startBlock": selected[-1]["block"], "endBlock": selected[0]["block"],
            "start": selected[-1]["timestamp"], "end": selected[0]["timestamp"]}
    if provider is None or not math.isfinite(provider):
        return {**base, "status": "unavailable", "reason": "Provider yield is unavailable."}
    # 2 percentage points or 10% of provider APY. This is a disclosed review
    # threshold, not a claim that the two averaging methods are identical.
    tolerance = max(.02, abs(provider) * .1)
    difference = apy - provider
    status = "consistent" if abs(difference) <= tolerance else "review"
    if status == "review" and abs(apr - provider) <= tolerance:
        status = "basis-review"
    return {**base, "providerApy": provider, "difference": difference, "tolerance": tolerance,
            "status": status}


async def check_payload(payload, endpoint):
    """Bounded targeted archive reads, pinned to the provider's finalized block."""
    rows = payload["rows"]
    if not rows or len(rows) > 512:
        raise ValueError("Invalid bounded yield universe")
    netuid = payload["netuid"]
    blocks = {row["block"] for row in rows}
    if len(blocks) != 1:
        raise ValueError("Yield snapshot contains different end blocks")
    end = next(iter(blocks))
    if end < 30 * 7200:
        raise ValueError("Invalid yield end block")
    async with websockets.connect(endpoint, open_timeout=8, max_size=16 * 1024 * 1024) as ws:
        request_id = 0

        async def rpc(method, params):
            nonlocal request_id
            request_id += 1
            await ws.send(json.dumps({"jsonrpc": "2.0", "id": request_id, "method": method, "params": params}))
            response = json.loads(await asyncio.wait_for(ws.recv(), 12))
            if response.get("id") != request_id or "error" in response or "result" not in response:
                raise ValueError("Historical node read unavailable")
            return response["result"]

        head = await rpc("chain_getFinalizedHead", [])
        header = await rpc("chain_getHeader", [head])
        if end > int(header["number"], 16):
            raise ValueError("Provider snapshot is not finalized on this node")
        histories = {row["hotkey"]: [] for row in rows}
        suffixes = {row["hotkey"]: pool_suffix(row["hotkey"], netuid) for row in rows}
        registration_key = "0x" + PREFIXES["registration"] + netuid.to_bytes(2, "little").hex()
        for day in range(31):
            block = end - day * 7200
            block_hash = await rpc("chain_getBlockHash", [block])
            try:
                if not block_hash:
                    raise ValueError("Missing historical block")
                keys = [TIME_KEY, registration_key]
                for suffix in suffixes.values():
                    keys.extend("0x" + PREFIXES[name] + suffix for name in ["alpha", "shares", "legacy", "epoch"])
                    keys.append("0x" + PREFIXES["owner"] + suffix[:-4])
                values = {}
                for start in range(0, len(keys), 400):
                    chunk = keys[start:start + 400]
                    groups = await rpc("state_queryStorageAt", [chunk, block_hash])
                    if len(groups) != 1 or groups[0].get("block") != block_hash:
                        raise ValueError("Unpinned historical response")
                    changes = groups[0]["changes"]
                    if len(changes) != len(chunk) or {k for k, _ in changes} != set(chunk):
                        raise ValueError("Incomplete historical response")
                    values.update(changes)
                owner_keys = {}
                for hotkey, suffix in suffixes.items():
                    owner_raw = values["0x" + PREFIXES["owner"] + suffix[:-4]]
                    if owner_raw is None or len(owner_raw) != 66:
                        owner_keys[hotkey] = []
                        continue
                    owner = bytes.fromhex(owner_raw[2:])
                    owner_suffix = suffix[:-4] + hashlib.blake2b(owner, digest_size=16).hexdigest() + owner.hex() + suffix[-4:]
                    owner_keys[hotkey] = ["0x" + PREFIXES[name] + owner_suffix for name in ["owner_shares", "owner_legacy", "owner_epoch"]]
                keys = [key for group in owner_keys.values() for key in group]
                for start in range(0, len(keys), 400):
                    chunk = keys[start:start + 400]
                    groups = await rpc("state_queryStorageAt", [chunk, block_hash])
                    if len(groups) != 1 or groups[0].get("block") != block_hash:
                        raise ValueError("Unpinned owner response")
                    changes = groups[0]["changes"]
                    if len(changes) != len(chunk) or {k for k, _ in changes} != set(chunk):
                        raise ValueError("Incomplete owner response")
                    values.update(changes)
                timestamp = datetime.fromtimestamp(uint(values[TIME_KEY], 8) / 1000, timezone.utc).isoformat()
                if day == 0 and any(abs((datetime.fromisoformat(row["timestamp"].replace("Z", "+00:00")) - datetime.fromisoformat(timestamp)).total_seconds()) > 60 for row in rows):
                    raise ValueError("Provider timestamp does not match its chain block")
                for hotkey, suffix in suffixes.items():
                    try:
                        point = pool_rate(*(values["0x" + PREFIXES[name] + suffix] for name in ["alpha", "shares", "legacy", "epoch"]), values[registration_key])
                        if not owner_keys[hotkey]:
                            raise ValueError("Missing controlling owner")
                        point["soleOperator"] = sole_operator(point, *(values[key] for key in owner_keys[hotkey]))
                        histories[hotkey].append({**point, "block": block, "timestamp": timestamp})
                    except ValueError:
                        histories[hotkey].append(None)
            except ValueError:
                # A missing archive day invalidates that window. Other windows
                # may still have complete coverage; never fill a gap with zero.
                if day == 0:
                    raise
                for history in histories.values():
                    history.append(None)
        checked = datetime.now(timezone.utc).isoformat()
        return {"netuid": netuid, "methodVersion": 4, "checkedAt": checked, "source": "configured-node-archive",
                "rows": [{"hotkey": row["hotkey"], "providerBlock": end, "providerTimestamp": row["timestamp"],
                          "seven": compare_window(histories[row["hotkey"]], 7, row.get("seven")),
                          "thirty": compare_window(histories[row["hotkey"]], 30, row.get("thirty"))} for row in rows]}


async def yield_check_loop(db, settings):
    """One dedicated connection/job at a time; independent of market indexing."""
    while True:
        try:
            row = await db.fetchrow("""UPDATE validator_yield_checks SET state='running',started_at=now()
                WHERE netuid=(SELECT netuid FROM validator_yield_checks
                  WHERE state='queued' OR (state='running' AND started_at<now()-interval '10 minutes')
                  ORDER BY requested_at LIMIT 1 FOR UPDATE SKIP LOCKED)
                RETURNING netuid,payload""")
            if row:
                payload = json.loads(row["payload"]) if isinstance(row["payload"], str) else row["payload"]
                # The configured archive is part of the existing node pipeline;
                # no arbitrary third-party URL or user-provided RPC is accepted.
                endpoint = settings.validator_yield_ws_url or settings.backfill_ws_url
                result = await asyncio.wait_for(check_payload(payload, endpoint), timeout=180)
                await db.execute("""UPDATE validator_yield_checks SET result=$2::jsonb,state='ready',
                    checked_at=now(),error=NULL WHERE netuid=$1""", row["netuid"], json.dumps(result, allow_nan=False))
                log.info("Background validator yield check ready SN%s rows=%s", row["netuid"], len(result["rows"]))
            else:
                await asyncio.sleep(30)
        except asyncio.CancelledError:
            raise
        except Exception as exc:
            log.warning("Background validator yield check unavailable: %s", type(exc).__name__)
            if 'row' in locals() and row:
                try:
                    await db.execute("""UPDATE validator_yield_checks SET state='unavailable',checked_at=now(),
                        error='Historical node check unavailable; provider yield remains unverified.' WHERE netuid=$1""", row["netuid"])
                except Exception:
                    log.warning("Could not save yield-check failure; lease recovery will retry")
            await asyncio.sleep(30)
