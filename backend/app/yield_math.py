"""One annualization convention shared by measured and estimated yields."""
import math
from decimal import Decimal


def annualized_return(period_return, periods_per_year):
    """APR = R*N; APY = (1+R)**N-1, for the SAME measured period.

    A 7/30-day R already includes rewards accrued within that period. APR
    adds no further compounding; APY repeats and compounds that whole period.
    Neither is a forecast and neither includes token-price changes.
    """
    try:
        r, n = float(period_return), float(periods_per_year)
        if not math.isfinite(r) or not math.isfinite(n) or r <= -1 or n <= 0:
            return None, None
        apr = r * n
        exponent = math.log1p(r) * n
        apy = math.expm1(exponent) if exponent < 700 else None
        return apr if math.isfinite(apr) else None, apy
    except (ValueError, TypeError, OverflowError):
        return None, None


def subnet_reward_estimate(row):
    """Latest net epoch dividends / RECENT actual staked alpha, not AlphaOut.

    This is explicitly an estimate: stake can change between the reward epoch
    and the current stake reading. It is not a validator's historical APY.
    """
    blank = {"apr": None, "apy": None, "yield_basis": "latest-epoch-estimate"}
    try:
        if row.get("netuid") == 0 or row.get("tempo") is None:
            return blank
        tempo = int(row["tempo"])
        if tempo < 0 or any(row.get(key) is None for key in ["circulating_alpha", "alpha_reserve", "staker_epoch_dividends_alpha"]):
            return blank
        stake = Decimal(str(row["circulating_alpha"])) - Decimal(str(row["alpha_reserve"]))
        dividends = Decimal(str(row["staker_epoch_dividends_alpha"]))
        if not stake.is_finite() or not dividends.is_finite() or stake <= 0 or dividends < 0:
            return blank
        apr, apy = annualized_return(dividends / stake, 7200 * 365 / (tempo + 1))
        return {"apr": apr * 100 if apr is not None else None,
                "apy": apy * 100 if apy is not None else None,
                "yield_basis": "latest-epoch-estimate"}
    except (ValueError, TypeError, ArithmeticError):
        return blank
