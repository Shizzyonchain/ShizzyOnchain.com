"""Bounded, block-pinned reads of the complete hotkey alpha map."""
import json
from decimal import Decimal

import websockets

# Twox128(SubtensorModule) + Twox128(TotalHotkeyAlpha).
# Finney schema: (Blake2_128Concat(AccountId32), Identity(u16)) -> u64.
STAKE_PREFIX = '0x658faa385070e074c85bf6b568cf0555ee25c3b5b1886863480497907f1829e6'


def decode_stake(key, value):
    if not key.startswith(STAKE_PREFIX) or len(key) != 166 or value is None:
        raise ValueError('Unexpected stake storage key')
    raw = bytes.fromhex(value.removeprefix('0x'))
    if len(raw) != 8:
        raise ValueError('Unexpected stake storage value')
    return int.from_bytes(bytes.fromhex(key[-4:]), 'little'), Decimal(int.from_bytes(raw, 'little')) / Decimal(10**9)


async def complete_stake_totals(endpoint, block_number):
    async with websockets.connect(endpoint, open_timeout=10, max_size=16*1024*1024) as ws:
        request_id = 0

        async def rpc(method, params):
            nonlocal request_id
            request_id += 1
            await ws.send(json.dumps({'jsonrpc': '2.0', 'id': request_id, 'method': method, 'params': params}))
            response = json.loads(await ws.recv())
            if response.get('id') != request_id or 'error' in response:
                raise ValueError('Stake RPC failed: ' + str(response.get('error')))
            return response['result']

        block_hash = await rpc('chain_getBlockHash', [block_number])
        if not block_hash:
            raise ValueError('Missing pinned block')
        totals, start, count = {}, STAKE_PREFIX, 0
        while True:
            keys = await rpc('state_getKeysPaged', [STAKE_PREFIX, 1000, start, block_hash])
            if not keys:
                break
            if keys[-1] <= start or len(set(keys)) != len(keys):
                raise ValueError('Stake pagination did not advance')
            groups = await rpc('state_queryStorageAt', [keys, block_hash])
            changes = [pair for group in groups for pair in group['changes']]
            if len(changes) != len(keys) or {k for k, _ in changes} != set(keys):
                raise ValueError('Incomplete stake page')
            for key, value in changes:
                netuid, amount = decode_stake(key, value)
                totals[netuid] = totals.get(netuid, Decimal(0)) + amount
            count += len(keys)
            if count > 1_000_000:
                raise ValueError('Stake scan exceeded bounded size')
            start = keys[-1]
        if not count:
            raise ValueError('Empty stake map')
        return totals
