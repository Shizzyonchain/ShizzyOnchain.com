from decimal import Decimal
import pytest
from app.stake_supply import STAKE_PREFIX, decode_stake, complete_stake_totals


def key(n, hotkey='00'):
    return STAKE_PREFIX + hotkey * 48 + n.to_bytes(2, 'little').hex()


def test_decode_exact_stake_units_and_subnet():
    assert decode_stake(key(64), '0x' + (2_750_000_001).to_bytes(8, 'little').hex()) == (64, Decimal('2.750000001'))


@pytest.mark.parametrize('k,v', [(key(64), None), (key(64), '0x01'), (key(64)+'00', '0x0000000000000000')])
def test_unknown_storage_shapes_fail_closed(k, v):
    with pytest.raises(ValueError):
        decode_stake(k, v)


async def test_scan_pins_block_and_includes_all_hotkeys(monkeypatch):
    keys = [key(64), key(64, '11')]
    class Connection:
        async def __aenter__(self): return self
        async def __aexit__(self, *args): pass
        async def send(self, text):
            import json
            self.req = json.loads(text)
        async def recv(self):
            import json
            method, params = self.req['method'], self.req['params']
            if method == 'chain_getBlockHash':
                assert params == [100]
                result = 'pinned-hash'
            elif method == 'state_getKeysPaged':
                assert params[-1] == 'pinned-hash'
                result = keys if params[2] == STAKE_PREFIX else []
            else:
                assert params == [keys, 'pinned-hash']
                result = [{'changes': [[k, '0x' + (10**9).to_bytes(8, 'little').hex()] for k in keys]}]
            return json.dumps({'id':self.req['id'],'result':result})
    monkeypatch.setattr('app.stake_supply.websockets.connect', lambda *a, **kw: Connection())
    assert await complete_stake_totals('test', 100) == {64: Decimal(2)}
