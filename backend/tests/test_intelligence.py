from decimal import Decimal

from app.intelligence import build_chain_intelligence, rotation_kind


def sample_row(**overrides):
    row = {
        "netuid": 64,
        "name": "Chutes",
        "symbol": "ALPHA",
        "time": None,
        "block_number": 1300,
        "price_tao": Decimal("2"),
        "tao_reserve": Decimal("1100"),
        "emission_share": Decimal("0.6"),
        "tao_in_emission": Decimal("0.2"),
        "excess_tao_emission": Decimal("0.1"),
        "alpha_out_emission": Decimal("0.5"),
        "root_prop": Decimal("0.4"),
        "p10_emission_share": Decimal("0.59"),
        "p1_block_number": 1000,
        "p1_price_tao": Decimal("2"),
        "p1_tao_reserve": Decimal("1000"),
        "p1_tao_in_emission": Decimal("0.2"),
        "p1_excess_tao_emission": Decimal("0.1"),
        "p1_alpha_out_emission": Decimal("0.5"),
        "p1_emission_share": Decimal("0.55"),
        "p1_root_prop": Decimal("0.35"),
        "p6_emission_share": Decimal("0.5"),
    }
    row.update(overrides)
    return row


def test_chain_intelligence_separates_programmed_and_market_flow():
    payload = build_chain_intelligence([sample_row()])
    row = payload["data"][0]

    assert row["direct_flow_1h_tao"] == Decimal("60")
    assert row["chain_buy_flow_1h_tao"] == Decimal("30")
    assert row["programmed_flow_1h_tao"] == Decimal("90")
    assert row["market_flow_1h_tao"] == Decimal("10")
    assert row["emitted_value_1h_tao"] == Decimal("300")
    assert row["emitted_value_24h_tao"] == Decimal("7200")
    assert row["emission_change_1h_pp"] == Decimal("5")
    assert row["allocation_signal"] == "GAINING"
    assert row["market_regime"] == "ABSORBING"


def test_chain_intelligence_does_not_invent_history():
    row = sample_row(
        p1_block_number=None,
        p1_price_tao=None,
        p1_tao_reserve=None,
        p1_tao_in_emission=None,
        p1_excess_tao_emission=None,
        p1_alpha_out_emission=None,
        p1_emission_share=None,
        p1_root_prop=None,
    )

    result = build_chain_intelligence([row])["data"][0]
    assert result["market_flow_1h_tao"] is None
    assert result["emission_absorption_pct"] is None
    assert result["allocation_signal"] == "COLLECTING"
    assert result["dominant_input"] == "Collecting input history"


def test_rotation_kind_excludes_non_economic_key_noise():
    assert rotation_kind("StakeAdded") == "inflow"
    assert rotation_kind("StakeRemoved") == "outflow"
    assert rotation_kind("StakeSwapped") == "rotation"
    assert rotation_kind("AlphaBurned") == "burn"

