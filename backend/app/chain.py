import asyncio
import logging
from dataclasses import asdict, is_dataclass
from decimal import Decimal
from typing import Any

from app.config import Settings

RAO_PER_TAO = Decimal(1_000_000_000)
logger = logging.getLogger(__name__)


def scale_int(value: Any) -> int:
    """Unwrap integer-like SCALE codec values returned by Bittensor v11."""
    raw_value = getattr(value, "value", value)
    while isinstance(raw_value, dict):
        for key in ("bits", "value", "inner", "raw"):
            if key in raw_value:
                raw_value = raw_value[key]
                break
        else:
            if len(raw_value) != 1:
                raise TypeError(
                    f"unsupported fixed-point mapping fields: {sorted(raw_value)}"
                )
            raw_value = next(iter(raw_value.values()))
        raw_value = getattr(raw_value, "value", raw_value)
    return int(raw_value)


def fixed_to_decimal(value: Any, frac_bits: int = 32) -> Decimal:
    """Decode a SCALE fixed-point value without relying on SDK internals."""
    return Decimal(scale_int(value)) / Decimal(1 << frac_bits)


def emission_shares(
    tao_in: dict[int, Decimal], excess_tao: dict[int, Decimal]
) -> dict[int, Decimal]:
    """Return each subnet's total TAO allocation share for the block.

    Subtensor splits a subnet's allocation between direct pool injection
    (SubnetTaoInEmission) and excess TAO used for protocol chain buys
    (SubnetExcessTao). Market dashboards call their sum "Emission".
    """
    netuids = tao_in.keys() | excess_tao.keys()
    allocations = {
        netuid: tao_in.get(netuid, Decimal(0))
        + excess_tao.get(netuid, Decimal(0))
        for netuid in netuids
    }
    total = sum(allocations.values(), Decimal(0))
    return {
        netuid: value / total if total > 0 else Decimal(0)
        for netuid, value in allocations.items()
    }


def amount(value: Any) -> Decimal:
    """Convert v11 Balance/numeric values without crossing TAO/alpha units."""
    if value is None:
        return Decimal(0)
    raw = getattr(value, "amount", value)
    return Decimal(str(raw))


def token_units(value: Any) -> Decimal:
    """Convert SDK Balance values to whole TAO/alpha units."""
    if value is None:
        return Decimal(0)
    decimal_value = getattr(value, "decimal", None)
    if decimal_value is not None:
        return Decimal(str(decimal_value))
    rao_value = getattr(value, "rao", None)
    if rao_value is not None:
        return Decimal(str(rao_value)) / RAO_PER_TAO
    amount_value = getattr(value, "amount", None)
    if amount_value is not None:
        return Decimal(str(amount_value))
    return Decimal(str(value))


def total_locked_alpha(result: Any) -> Decimal:
    """Read the rolled-forward total lock mass returned by Bittensor v11."""
    total = field(result, "total_locked_alpha")
    if total is not None:
        return token_units(total)

    entries = field(result, "entries", "convictions", "hotkeys", default=[])
    if isinstance(entries, dict):
        entries = entries.values()
    return sum(
        (
            token_units(
                field(
                    entry,
                    "locked_alpha",
                    "locked_mass",
                    "locked",
                    "alpha_locked",
                    default=0,
                )
            )
            for entry in entries or []
        ),
        Decimal(0),
    )


def field(obj: Any, *names: str, default=None):
    data = asdict(obj) if is_dataclass(obj) else obj
    for name in names:
        if isinstance(data, dict) and name in data:
            return data[name]
        if hasattr(obj, name):
            return getattr(obj, name)
    return default


class ChainClient:
    """Small adapter around the current Bittensor v11 SDK; easy to fake in tests."""

    def __init__(self, settings: Settings):
        self.settings = settings
        self.client = None
        self._conviction_locked: dict[int, Decimal | None] = {}
        self._conviction_refresh_block = -1
        self._yield_metrics: dict[int, tuple[int | None, Decimal | None]] = {}
        self._yield_refresh_block = -1

    async def __aenter__(self):
        import bittensor as bt

        self.client = await bt.Subtensor(self.settings.subtensor_ws_url)
        return self

    async def __aexit__(self, *args):
        close = getattr(self.client, "close", None)
        if close:
            result = close()
            if asyncio.iscoroutine(result):
                await result

    async def block_info(self, block: int | None = None):
        return await self.client.block_info(block)

    async def subnets_at(self, block_number: int) -> list[dict]:
        view = await self.client.at(block_number)
        (
            infos,
            prices,
            tao_rows,
            alpha_rows,
            out_rows,
            issuance_rows,
            volume_rows,
            tao_emission_rows,
            excess_tao_rows,
            alpha_emission_rows,
            root_prop_rows,
            symbol_rows,
            identity_rows,
        ) = await asyncio.gather(
            view.subnets.all(),
            view.prices.alpha_prices(),
            view.query_map(("SubtensorModule", "SubnetTAO")),
            view.query_map(("SubtensorModule", "SubnetAlphaIn")),
            view.query_map(("SubtensorModule", "SubnetAlphaOut")),
            view.query_map(("AlphaAssets", "TotalAlphaIssuance")),
            view.query_map(("SubtensorModule", "SubnetVolume")),
            view.query_map(("SubtensorModule", "SubnetTaoInEmission")),
            view.query_map(("SubtensorModule", "SubnetExcessTao")),
            view.query_map(("SubtensorModule", "SubnetAlphaOutEmission")),
            view.query_map(("SubtensorModule", "RootProp")),
            view.query_map(("SubtensorModule", "TokenSymbol")),
            view.query_map(("SubtensorModule", "SubnetIdentitiesV3")),
        )
        tao = {int(k): Decimal(scale_int(v)) / RAO_PER_TAO for k, v in tao_rows}
        alpha = {int(k): Decimal(scale_int(v)) / RAO_PER_TAO for k, v in alpha_rows}
        alpha_out = {int(k): Decimal(scale_int(v)) / RAO_PER_TAO for k, v in out_rows}
        alpha_issuance = {
            int(k): Decimal(scale_int(v)) / RAO_PER_TAO for k, v in issuance_rows
        }
        volume = {int(k): Decimal(scale_int(v)) / RAO_PER_TAO for k, v in volume_rows}
        tao_emission = {
            int(k): Decimal(scale_int(v)) / RAO_PER_TAO for k, v in tao_emission_rows
        }
        excess_tao = {
            int(k): Decimal(scale_int(v)) / RAO_PER_TAO for k, v in excess_tao_rows
        }
        alpha_emission = {
            int(k): Decimal(scale_int(v)) / RAO_PER_TAO for k, v in alpha_emission_rows
        }
        emission_share = emission_shares(tao_emission, excess_tao)
        root_prop = {
            int(k): fixed_to_decimal(v)
            for k, v in root_prop_rows
        }
        symbols = {int(k): self._text(v) for k, v in symbol_rows}
        names = {
            int(k): self._text(field(v, "subnet_name"))
            for k, v in identity_rows
        }
        netuids = [int(field(info, "netuid")) for info in infos]
        if not self._conviction_locked or block_number - self._conviction_refresh_block >= 25:
            self._conviction_locked = await self._locked_alpha_by_subnet(view, netuids)
            self._conviction_refresh_block = block_number
        if not self._yield_metrics or block_number - self._yield_refresh_block >= 100:
            self._yield_metrics = await self._subnet_yield_metrics(view, netuids)
            self._yield_refresh_block = block_number
        rows = []
        for info in infos:
            netuid = int(field(info, "netuid"))
            price = prices.get(netuid) if isinstance(prices, dict) else None
            rows.append({
                "netuid": netuid,
                "price_tao": Decimal(str(price or 0)),
                "tao_reserve": tao.get(netuid),
                "alpha_reserve": alpha.get(netuid),
                "alpha_out": alpha_out.get(netuid),
                "alpha_issuance": alpha_issuance.get(netuid),
                "volume_tao": volume.get(netuid),
                "tao_in_emission": tao_emission.get(netuid, Decimal(0)),
                "alpha_out_emission": alpha_emission.get(netuid, Decimal(0)),
                "emission_share": emission_share.get(netuid, Decimal(0)),
                "root_prop": root_prop.get(netuid),
                "tempo": self._yield_metrics.get(netuid, (None, None))[0],
                "staker_epoch_dividends_alpha": self._yield_metrics.get(netuid, (None, None))[1],
                "conviction_locked_alpha": self._conviction_locked.get(netuid),
                "name": names.get(netuid),
                "symbol": symbols.get(netuid),
            })
        return rows

    async def _subnet_yield_metrics(
        self, view, netuids: list[int]
    ) -> dict[int, tuple[int | None, Decimal | None]]:
        """Read latest realized validator dividends; these change once per subnet tempo."""
        try:
            tempo_rows, dividend_rows = await asyncio.gather(
                view.query_map(("SubtensorModule", "Tempo")),
                view.query_map(("SubtensorModule", "AlphaDividendsPerSubnet")),
            )
        except Exception:
            return {netuid: (None, None) for netuid in netuids}
        tempos = {int(k): scale_int(v) for k, v in tempo_rows}
        totals: dict[int, Decimal] = {}
        for key, value in dividend_rows:
            netuid = self._first_int(key)
            if netuid is not None:
                totals[netuid] = (
                    totals.get(netuid, Decimal(0)) + Decimal(scale_int(value)) / RAO_PER_TAO
                )
        return {netuid: (tempos.get(netuid), totals.get(netuid)) for netuid in netuids}

    @classmethod
    def _first_int(cls, value: Any) -> int | None:
        """Extract a netuid from SDK composite storage keys across codec versions."""
        if isinstance(value, int):
            return value
        if isinstance(value, (tuple, list)):
            for item in value:
                result = cls._first_int(item)
                if result is not None:
                    return result
        if isinstance(value, dict):
            for item in value.values():
                result = cls._first_int(item)
                if result is not None:
                    return result
        raw = getattr(value, "value", None)
        if raw is not None and raw is not value:
            return cls._first_int(raw)
        try:
            return int(value)
        except (TypeError, ValueError):
            return None

    async def _locked_alpha_by_subnet(self, view, netuids: list[int]) -> dict[int, Decimal | None]:
        """Sum rolled-forward conviction lock mass, refreshing in bounded batches."""
        totals: dict[int, Decimal | None] = {}

        async def one(netuid: int):
            try:
                result = await view.locks.subnet_convictions(netuid=netuid)
                return netuid, total_locked_alpha(result)
            except Exception as exc:
                logger.warning(
                    "conviction lock read failed for netuid %s: %s",
                    netuid,
                    exc,
                )
                return netuid, None

        for start in range(0, len(netuids), 16):
            for netuid, total in await asyncio.gather(*(one(n) for n in netuids[start:start + 16])):
                totals[netuid] = total
        return totals

    @staticmethod
    def _text(value: Any) -> str | None:
        if value is None:
            return None
        if isinstance(value, bytes):
            return value.decode("utf-8", errors="replace")
        if isinstance(value, list) and all(isinstance(item, int) for item in value):
            return bytes(value).decode("utf-8", errors="replace")
        return str(value)

    async def wallet(self, address: str, block_number: int) -> dict:
        view = await self.client.at(block_number)
        free, positions, staked_value = await asyncio.gather(
            view.balances.get(address),
            view.staking.stake_for_coldkey(coldkey_ss58=address),
            view.staking.stake_value_for_coldkey(coldkey_ss58=address),
        )
        stakes = []
        for position in positions:
            stakes.append({
                "hotkey": str(field(position, "hotkey_ss58", "hotkey")),
                "netuid": int(field(position, "netuid")),
                "alpha": amount(field(position, "stake", "alpha", "amount")),
                "tao_value": amount(staked_value.spot_value(position.stake)),
            })
        staked = amount(field(staked_value, "stake_value"))
        free_tao = amount(free)
        return {
            "address": address,
            "block_number": block_number,
            "free_tao": free_tao,
            "staked_tao_value": staked,
            "total_tao_value": free_tao + staked,
            "stakes": stakes,
        }
