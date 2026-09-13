from decimal import Decimal as D

import pytest

from app.chain import ChainClient
from app.config import Settings
from app.liquidation import liquidation_price


@pytest.mark.parametrize("registration,expected", [(8334450, "1"), (8334451, "0.5")])
def test_payout_includes_protocol_and_registration_gated_pool(registration, expected):
    assert liquidation_price(D(100), D(70), D(30), D(100), registration, 8334450) == D(expected)


@pytest.mark.parametrize("tao,stake,protocol,pool,registration,gate", [
    (None, D(70), D(30), D(100), 2, 1),
    (D(100), None, D(30), D(100), 2, 1),
    (D(100), D(70), None, D(100), 2, 1),
    (D(100), D(70), D(30), None, 2, 1),
    (D(100), D(70), D(30), D(100), None, 1),
    (D(100), D(70), D(30), D(100), 2, None),
    (D(100), D(0), D(0), D(0), 2, 1),
    (D(-1), D(70), D(30), D(100), 2, 1),
    (D("NaN"), D(70), D(30), D(100), 2, 1),
])
def test_missing_or_invalid_inputs_do_not_create_a_payout(tao, stake, protocol, pool, registration, gate):
    assert liquidation_price(tao, stake, protocol, pool, registration, gate) is None


def test_zero_reserves_are_a_real_zero_payout():
    assert liquidation_price(D(0), D(70), D(30), None, 1, 1) == 0


class FakeView:
    @property
    def subnets(self):
        return self

    @property
    def prices(self):
        return self

    async def all(self):
        return [{"netuid": n} for n in (0, 1, 2, 3, 4)]

    async def alpha_prices(self):
        return {n: D(2) for n in range(5)}

    async def query_map(self, storage):
        name = storage[1]
        if name == "NetworkRegisteredAt":
            return [(n, 100) for n in range(5)]
        if name in {"SubnetTAO", "SubnetAlphaIn"}:
            return [(n, 100_000_000_000) for n in range(5)]
        if name == "SubnetProtocolAlpha":
            return [(n, 30_000_000_000) for n in range(5)]
        # Deliberately unrelated issuance: the payout must not use AlphaOut.
        if name == "SubnetAlphaOut":
            return [(n, 900_000_000_000) for n in range(5)]
        return []

    async def query(self, storage):
        return 100 if storage[1] == "TaoInRefundDeploymentBlock" else 1_000_000_000

    async def at(self, block):
        return self


async def test_chain_rejects_stale_or_reused_subnet_stake_and_excludes_root():
    chain = ChainClient(Settings())
    chain.client = FakeView()
    chain._circulating_stake = {n: D(70) for n in range(5)}
    chain._circulating_stake_refresh_block = 1000
    chain._stake_identity = {0: (100, 1000), 1: (100, 1000), 2: (100, 899), 3: (99, 1000)}
    rows = await chain.subnets_at(1000, include_yield_metrics=False, include_lock_metrics=False)
    payouts = {r["netuid"]: r["liquidation_price_tao"] for r in rows}
    assert payouts == {0: None, 1: D(1), 2: None, 3: None, 4: None}


async def test_failed_protocol_query_does_not_break_market_prices():
    class FailedView(FakeView):
        async def query_map(self, storage):
            if storage[1] == "SubnetProtocolAlpha":
                raise RuntimeError("RPC unavailable")
            return await super().query_map(storage)

    chain = ChainClient(Settings())
    chain.client = FailedView()
    chain._circulating_stake = {1: D(70)}
    chain._circulating_stake_refresh_block = 1000
    chain._stake_identity = {1: (100, 1000)}
    rows = await chain.subnets_at(1000, include_yield_metrics=False, include_lock_metrics=False)
    assert all(r["price_tao"] == 2 and r["liquidation_price_tao"] is None for r in rows)
