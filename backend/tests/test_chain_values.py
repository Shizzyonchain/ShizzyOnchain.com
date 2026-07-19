from decimal import Decimal

from app.chain import ChainClient, emission_shares, fixed_to_decimal, scale_int


def test_scale_int_unwraps_bittensor_v11_codec_shapes():
    values = [
        123,
        {"bits": 123},
        {"value": {"bits": 123}},
        {"inner": {"raw": 123}},
        {"FixedU128": {"bits": 123}},
    ]

    assert [scale_int(value) for value in values] == [123] * len(values)


def test_fixed_to_decimal_preserves_binary_fraction_precision():
    assert fixed_to_decimal({"bits": 1 << 32}) == Decimal(1)
    assert fixed_to_decimal({"value": {"bits": 1 << 31}}) == Decimal("0.5")


def test_composite_storage_key_extracts_netuid_from_mapping():
    assert ChainClient._first_int({"netuid": 64}) == 64


def test_emission_share_includes_pool_injection_and_chain_buys():
    shares = emission_shares(
        {4: Decimal("0.02"), 64: Decimal("0.03")},
        {4: Decimal("0.04"), 64: Decimal("0.01")},
    )

    assert shares == {4: Decimal("0.6"), 64: Decimal("0.4")}


def test_emission_share_handles_disabled_and_zero_allocation_subnets():
    shares = emission_shares(
        {4: Decimal("0"), 5: Decimal("0")},
        {4: Decimal("0"), 5: Decimal("0")},
    )

    assert shares == {4: Decimal("0"), 5: Decimal("0")}
