from decimal import Decimal
from typing import Any


BLOCKS_PER_DAY = Decimal(7200)
ZERO = Decimal(0)


def _decimal(row: dict[str, Any], key: str) -> Decimal | None:
    value = row.get(key)
    return Decimal(str(value)) if value is not None else None


def _average(left: Decimal | None, right: Decimal | None) -> Decimal | None:
    if left is None or right is None:
        return None
    return (left + right) / 2


def _change_points(current: Decimal | None, previous: Decimal | None) -> Decimal | None:
    if current is None or previous is None:
        return None
    return (current - previous) * 100


def _rank(values: list[tuple[int, Decimal | None]]) -> dict[int, int]:
    ordered = sorted(
        ((netuid, value) for netuid, value in values if value is not None),
        key=lambda item: (-item[1], item[0]),
    )
    return {netuid: index + 1 for index, (netuid, _) in enumerate(ordered)}


def _median(values: list[Decimal]) -> Decimal | None:
    if not values:
        return None
    ordered = sorted(values)
    midpoint = len(ordered) // 2
    if len(ordered) % 2:
        return ordered[midpoint]
    return (ordered[midpoint - 1] + ordered[midpoint]) / 2


def build_chain_intelligence(records: list[Any]) -> dict[str, Any]:
    """Derive auditable emission and liquidity signals from finalized samples.

    Programmed flow is the block-integrated direct pool injection plus protocol
    chain-buy allocation. Market flow is the observed TAO reserve change after
    removing that programmed flow. No wallet labels or off-chain heuristics are
    used in these calculations.
    """

    rows = [dict(record) for record in records]
    total_liquidity = sum(
        (_decimal(row, "tao_reserve") or ZERO for row in rows),
        ZERO,
    )
    current_ranks = _rank(
        [(int(row["netuid"]), _decimal(row, "emission_share")) for row in rows]
    )
    previous_ranks = _rank(
        [(int(row["netuid"]), _decimal(row, "p1_emission_share")) for row in rows]
    )

    intelligence = []
    for row in rows:
        netuid = int(row["netuid"])
        price = _decimal(row, "price_tao")
        reserve = _decimal(row, "tao_reserve")
        emission_share = _decimal(row, "emission_share")
        direct = _decimal(row, "tao_in_emission")
        excess = _decimal(row, "excess_tao_emission")
        alpha_emission = _decimal(row, "alpha_out_emission")
        root_prop = _decimal(row, "root_prop")

        previous_block = row.get("p1_block_number")
        block_delta = (
            max(0, int(row["block_number"]) - int(previous_block))
            if previous_block is not None else None
        )
        previous_reserve = _decimal(row, "p1_tao_reserve")
        previous_direct = _decimal(row, "p1_tao_in_emission")
        previous_excess = _decimal(row, "p1_excess_tao_emission")

        direct_flow = None
        chain_buy_flow = None
        programmed_flow = None
        market_flow = None
        if (
            block_delta is not None
            and block_delta > 0
            and reserve is not None
            and previous_reserve is not None
        ):
            blocks = Decimal(block_delta)
            average_direct = _average(direct, previous_direct)
            average_excess = _average(excess, previous_excess)
            if average_direct is not None and average_excess is not None:
                direct_flow = average_direct * blocks
                chain_buy_flow = average_excess * blocks
                programmed_flow = direct_flow + chain_buy_flow
                market_flow = reserve - previous_reserve - programmed_flow

        emitted_value_1h = None
        previous_alpha_emission = _decimal(row, "p1_alpha_out_emission")
        previous_price = _decimal(row, "p1_price_tao")
        if (
            block_delta is not None
            and block_delta > 0
            and alpha_emission is not None
            and price is not None
            and previous_alpha_emission is not None
            and previous_price is not None
        ):
            emitted_value_1h = (
                (alpha_emission * price + previous_alpha_emission * previous_price)
                / 2
                * Decimal(block_delta)
            )

        emitted_value_24h = (
            alpha_emission * price * BLOCKS_PER_DAY
            if alpha_emission is not None and price is not None else None
        )
        overhang_pct = (
            emitted_value_24h / reserve * 100
            if emitted_value_24h is not None and reserve is not None and reserve > 0 else None
        )
        liquidity_cover_days = (
            reserve / emitted_value_24h
            if emitted_value_24h is not None and emitted_value_24h > 0 and reserve is not None
            else None
        )
        absorption_pct = (
            market_flow / emitted_value_1h * 100
            if market_flow is not None and emitted_value_1h is not None and emitted_value_1h > 0
            else None
        )

        liquidity_share = reserve / total_liquidity if reserve is not None and total_liquidity > 0 else None
        allocation_premium = (
            emission_share / liquidity_share
            if emission_share is not None and liquidity_share is not None and liquidity_share > 0
            else None
        )
        current_allocation = (
            direct + excess if direct is not None and excess is not None else None
        )
        excess_share_pct = (
            excess / current_allocation * 100
            if excess is not None and current_allocation is not None and current_allocation > 0
            else None
        )

        direct_delta = (
            direct - previous_direct
            if direct is not None and previous_direct is not None else None
        )
        excess_delta = (
            excess - previous_excess
            if excess is not None and previous_excess is not None else None
        )
        if direct_delta is None or excess_delta is None:
            dominant_input = "Collecting input history"
        elif direct_delta == 0 and excess_delta == 0:
            dominant_input = "Allocation inputs stable"
        elif abs(excess_delta) > abs(direct_delta):
            dominant_input = "Protocol chain-buy input"
        else:
            dominant_input = "Direct pool-injection input"

        change_10m = _change_points(
            emission_share, _decimal(row, "p10_emission_share")
        )
        change_1h = _change_points(
            emission_share, _decimal(row, "p1_emission_share")
        )
        change_6h = _change_points(
            emission_share, _decimal(row, "p6_emission_share")
        )
        if change_1h is None:
            allocation_signal = "COLLECTING"
        elif change_10m is not None and change_1h * change_10m < 0:
            allocation_signal = "REVERSING"
        elif change_1h >= Decimal("0.01"):
            allocation_signal = "GAINING"
        elif change_1h <= Decimal("-0.01"):
            allocation_signal = "LOSING"
        else:
            allocation_signal = "STEADY"

        if market_flow is None:
            market_regime = "COLLECTING"
        elif market_flow > Decimal("0.1"):
            market_regime = "ABSORBING"
        elif market_flow < Decimal("-0.1"):
            market_regime = "DISTRIBUTING"
        else:
            market_regime = "BALANCED"

        previous_rank = previous_ranks.get(netuid)
        current_rank = current_ranks.get(netuid)
        intelligence.append({
            "netuid": netuid,
            "name": row.get("name"),
            "symbol": row.get("symbol"),
            "time": row.get("time"),
            "block_number": int(row["block_number"]),
            "price_tao": price,
            "tao_reserve": reserve,
            "emission_pct": emission_share * 100 if emission_share is not None else None,
            "emission_change_10m_pp": change_10m,
            "emission_change_1h_pp": change_1h,
            "emission_change_6h_pp": change_6h,
            "emission_rank": current_rank,
            "emission_rank_change_1h": (
                previous_rank - current_rank
                if previous_rank is not None and current_rank is not None else None
            ),
            "tao_in_emission": direct,
            "excess_tao_emission": excess,
            "alpha_out_emission": alpha_emission,
            "root_prop_pct": root_prop * 100 if root_prop is not None else None,
            "root_prop_change_1h_pp": _change_points(
                root_prop, _decimal(row, "p1_root_prop")
            ),
            "direct_flow_1h_tao": direct_flow,
            "chain_buy_flow_1h_tao": chain_buy_flow,
            "programmed_flow_1h_tao": programmed_flow,
            "market_flow_1h_tao": market_flow,
            "emitted_value_1h_tao": emitted_value_1h,
            "emitted_value_24h_tao": emitted_value_24h,
            "emission_absorption_pct": absorption_pct,
            "emission_overhang_pct": overhang_pct,
            "liquidity_cover_days": liquidity_cover_days,
            "liquidity_share_pct": liquidity_share * 100 if liquidity_share is not None else None,
            "allocation_premium": allocation_premium,
            "excess_share_pct": excess_share_pct,
            "dominant_input": dominant_input,
            "allocation_signal": allocation_signal,
            "market_regime": market_regime,
        })

    emitted_values = [
        row["emitted_value_24h_tao"]
        for row in intelligence if row["emitted_value_24h_tao"] is not None
    ]
    known_market_flows = [
        row["market_flow_1h_tao"]
        for row in intelligence if row["market_flow_1h_tao"] is not None
    ]
    overhangs = [
        row["emission_overhang_pct"]
        for row in intelligence if row["emission_overhang_pct"] is not None
    ]
    programmed_per_block = [
        (_decimal(row, "tao_in_emission") or ZERO)
        + (_decimal(row, "excess_tao_emission") or ZERO)
        for row in rows
        if row.get("tao_in_emission") is not None
        and row.get("excess_tao_emission") is not None
    ]
    stress_leader = max(
        (row for row in intelligence if row["emission_overhang_pct"] is not None),
        key=lambda row: row["emission_overhang_pct"],
        default=None,
    )

    intelligence.sort(
        key=lambda row: (
            row["emission_rank"] is None,
            row["emission_rank"] or 10_000,
        )
    )
    return {
        "data": intelligence,
        "summary": {
            "latest_block": max((int(row["block_number"]) for row in rows), default=None),
            "network_programmed_tao_per_block": sum(programmed_per_block, ZERO),
            "participant_emission_value_24h_tao": sum(emitted_values, ZERO),
            "market_flow_1h_tao": sum(known_market_flows, ZERO) if known_market_flows else None,
            "market_flow_coverage_subnets": len(known_market_flows),
            "subnet_count": len(intelligence),
            "gaining_subnets_1h": sum(
                1 for row in intelligence
                if row["emission_change_1h_pp"] is not None
                and row["emission_change_1h_pp"] > 0
            ),
            "median_emission_overhang_pct": _median(overhangs),
            "stress_leader": (
                {
                    "netuid": stress_leader["netuid"],
                    "name": stress_leader["name"],
                    "emission_overhang_pct": stress_leader["emission_overhang_pct"],
                }
                if stress_leader else None
            ),
        },
    }


def rotation_kind(event_type: str) -> str:
    if event_type == "StakeAdded":
        return "inflow"
    if event_type == "StakeRemoved":
        return "outflow"
    if event_type in {"AddStakeBurn", "AlphaBurned", "AlphaRecycled"}:
        return "burn"
    return "rotation"

