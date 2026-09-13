"""Estimated deregistration payout, following Subtensor's share-pool rules.

Reference: https://docs.taostats.io/docs/subnet-deregistration
The stake total must include positions on deregistered hotkeys, not AlphaOut.
"""
from decimal import Decimal


def liquidation_price(
    tao: Decimal | None,
    stake: Decimal | None,
    protocol: Decimal | None,
    pool_alpha: Decimal | None,
    registered_at: int | None,
    refund_deployment: int | None,
) -> Decimal | None:
    if registered_at is None or refund_deployment is None:
        return None
    values = [tao, stake, protocol]
    if registered_at > refund_deployment:
        values.append(pool_alpha)
    if any(v is None or not v.is_finite() or v < 0 for v in values):
        return None
    denominator = sum(values[1:], Decimal(0))
    return tao / denominator if denominator > 0 else None


# A separate table prevents fast spot-price ticks from overwriting slower
# payout enrichment. It also keeps this estimate out of historical prices.
LIQUIDATION_SCHEMA = """CREATE TABLE IF NOT EXISTS subnet_liquidation_samples (
  netuid INTEGER PRIMARY KEY,
  time TIMESTAMPTZ NOT NULL,
  block_number BIGINT NOT NULL,
  stake_block BIGINT,
  liquidation_price_tao NUMERIC(38,18)
)"""


def liquidation_join(price_alias: str) -> str:
    """Only expose estimates whose chain and external stake inputs are fresh."""
    if price_alias not in {"p", "l"}:
        raise ValueError("unexpected price alias")
    return f"""LEFT JOIN subnet_liquidation_samples liq
      ON liq.netuid={price_alias}.netuid AND liq.netuid<>0
      AND liq.time >= now() - interval '20 minutes'
      AND {price_alias}.block_number - liq.block_number BETWEEN 0 AND 100
      AND abs({price_alias}.block_number - liq.stake_block) <= 100"""
