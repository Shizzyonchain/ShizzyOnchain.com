import math
from app.yield_math import annualized_return, subnet_reward_estimate
import pytest


def test_apr_and_apy_share_the_same_period_return():
    apr, apy = annualized_return(.01, 365 / 7)
    assert apr == pytest.approx(.01 * 365 / 7)
    assert apy == pytest.approx(1.01 ** (365 / 7) - 1)
    assert apy > apr
    assert annualized_return(0, 365) == (0, 0)
    assert annualized_return(-.01, 12)[0] == pytest.approx(-.12)


def test_nonfinite_missing_and_extreme_returns_do_not_become_fake_yields():
    for r, n in [(None,365),(math.nan,365),(.1,math.inf),(-1,365),(.1,0)]:
        assert annualized_return(r,n) == (None,None)
    assert annualized_return(100, 365)[1] is None


def test_homepage_uses_compounding_and_actual_stake_not_alpha_out():
    row = dict(netuid=64,tempo=359,staker_epoch_dividends_alpha='1',
               circulating_alpha='110000',alpha_reserve='10000',alpha_out='999999999')
    result = subnet_reward_estimate(row)
    epochs = 7200 * 365 / 360
    assert result['apr'] == pytest.approx(.00001 * epochs * 100)
    assert result['apy'] == pytest.approx(math.expm1(math.log1p(.00001)*epochs)*100)
    assert result['apy'] > result['apr']
    assert result['yield_basis'] == 'latest-epoch-estimate'
    row['alpha_out'] = '1'
    assert subnet_reward_estimate(row) == result


def test_homepage_missing_stake_stays_unavailable_and_zero_rewards_stay_zero():
    row = dict(netuid=64,tempo=359,staker_epoch_dividends_alpha=0,circulating_alpha=1100,alpha_reserve=100)
    assert subnet_reward_estimate(row)['apy'] == 0
    for change in [dict(netuid=0),dict(circulating_alpha=None),dict(tempo=-1),dict(staker_epoch_dividends_alpha=-1),dict(circulating_alpha=100)]:
        assert subnet_reward_estimate({**row,**change})['apy'] is None
