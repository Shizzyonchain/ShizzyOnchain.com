from decimal import Decimal

from app.chain import ChainClient, fixed_to_decimal, scale_int


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
