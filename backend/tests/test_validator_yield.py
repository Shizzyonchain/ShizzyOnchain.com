from decimal import Decimal
import pytest
from app.validator_yield import account_bytes, pool_rate, compare_window


def raw(n, size=8):
    return '0x' + n.to_bytes(size, 'little').hex()


def sf(mantissa, exponent):
    return '0x' + mantissa.to_bytes(16, 'little').hex() + exponent.to_bytes(8, 'little', signed=True).hex()


def test_deposits_do_not_become_rewards_and_fee_shares_reduce_net_return():
    original = pool_rate(raw(1000), sf(10**21, -19), None, None, raw(1))
    deposited = pool_rate(raw(2000), sf(2*10**20, -18), None, None, raw(1))
    rewarded = pool_rate(raw(2200), sf(2*10**20, -18), None, None, raw(1))
    fee_minted = pool_rate(raw(2200), sf(21*10**19, -18), None, None, raw(1))
    assert original['rate'] == deposited['rate']
    assert rewarded['rate'] > fee_minted['rate'] > original['rate']


def history(days, daily=Decimal('1.001')):
    return [dict(rate=daily ** (days-i), epoch=0, registration=10,
                 encoding='safe-float-v2', block=1_000_000-i*7200,
                 timestamp=f'day-{i}') for i in range(days+1)]


def test_correct_compounding_and_no_second_take_deduction():
    expected = float(Decimal('1.001')**365-1)
    result = compare_window(history(7), 7, expected)
    assert result['status'] == 'consistent'
    assert result['chainApy'] == pytest.approx(expected)
    assert result['observedReturn'] == pytest.approx(float(Decimal('1.001')**7-1))
    assert result['chainApr'] == pytest.approx(float(Decimal('1.001')**7-1)*365/7)
    assert result['startBlock'] == 949600
    assert compare_window(history(7), 7, .365)['status'] == 'basis-review'


@pytest.mark.parametrize('field,value', [('epoch',1),('registration',11),('encoding','fixed-v1')])
def test_resets_and_migrations_are_never_joined(field, value):
    points = history(30)
    points[15][field] = value
    assert compare_window(points, 30, .3)['status'] == 'unavailable'
    assert compare_window(points, 7, .3)['status'] != 'unavailable'


def test_missing_day_or_provider_and_negative_return():
    points = history(7)
    points[4] = None
    assert compare_window(points,7,.3)['status'] == 'unavailable'
    assert compare_window(history(7),7,None)['status'] == 'unavailable'
    assert compare_window(history(7, Decimal('.999')),7,.3)['status'] == 'review'


def test_unknown_share_encoding_and_bad_address_fail_closed():
    with pytest.raises(ValueError):
        pool_rate(raw(100), '0x00', None, None, raw(1))
    with pytest.raises(ValueError):
        pool_rate(raw(100), sf(0,0), None, None, raw(1))
    with pytest.raises(ValueError):
        account_bytes('5' * 48)


async def test_no_unfinalized_provider_block_is_queried(monkeypatch):
    import json
    from app.validator_yield import check_payload
    class Connection:
        async def __aenter__(self): return self
        async def __aexit__(self, *args): pass
        async def send(self, text): self.req=json.loads(text)
        async def recv(self):
            method=self.req['method']
            assert method in ['chain_getFinalizedHead','chain_getHeader']
            return json.dumps({'id':self.req['id'],'result':'hash' if method=='chain_getFinalizedHead' else {'number':hex(999999)}})
    monkeypatch.setattr('app.validator_yield.websockets.connect',lambda *a,**kw: Connection())
    with pytest.raises(ValueError,match='not finalized'):
        await check_payload({'netuid':1,'rows':[{'hotkey':'unused','block':1_000_000}]},'test')
