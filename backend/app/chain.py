import asyncio
from dataclasses import asdict, is_dataclass
from decimal import Decimal
from typing import Any

from bittensor.utils.balance import fixed_to_float

from app.config import Settings

RAO_PER_TAO = Decimal(1_000_000_000)


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
    tao_value = getattr(value, "tao", None)
    if tao_value is not None:
        return Decimal(str(tao_value))
    rao_value = getattr(value, "rao", None)
    if rao_value is not None:
        return Decimal(str(rao_value)) / RAO_PER_TAO
    return Decimal(str(value))


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
        infos, prices, tao_rows, alpha_rows, out_rows, volume_rows, tao_emission_rows, alpha_emission_rows, emission_rows, root_prop_rows, symbol_rows, identity_rows = await asyncio.gather(
            view.subnets.all(),
            view.prices.alpha_prices(),
            view.query_map(("SubtensorModule", "SubnetTAO")),
            view.query_map(("SubtensorModule", "SubnetAlphaIn")),
            view.query_map(("SubtensorModule", "SubnetAlphaOut")),
            view.query_map(("SubtensorModule", "SubnetVolume")),
            view.query_map(("SubtensorModule", "SubnetTaoInEmission")),
            view.query_map(("SubtensorModule", "SubnetAlphaOutEmission")),
            view.query_map(("SubtensorModule", "EmissionValues")),
            view.query_map(("SubtensorModule", "RootProp")),
            view.query_map(("SubtensorModule", "TokenSymbol")),
            view.query_map(("SubtensorModule", "SubnetIdentitiesV3")),
        )
        tao = {int(k): Decimal(int(v)) / RAO_PER_TAO for k, v in tao_rows}
        alpha = {int(k): Decimal(int(v)) / RAO_PER_TAO for k, v in alpha_rows}
        alpha_out = {int(k): Decimal(int(v)) / RAO_PER_TAO for k, v in out_rows}
        volume = {int(k): Decimal(int(v)) / RAO_PER_TAO for k, v in volume_rows}
        tao_emission = {int(k): Decimal(int(v)) / RAO_PER_TAO for k, v in tao_emission_rows}
        alpha_emission = {int(k): Decimal(int(v)) / RAO_PER_TAO for k, v in alpha_emission_rows}
        emission_share = {int(k): Decimal(int(v)) / RAO_PER_TAO for k, v in emission_rows}
        root_prop = {
            int(k): Decimal(str(fixed_to_float(v, frac_bits=32, total_bits=128)))
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
                "volume_tao": volume.get(netuid),
                "tao_in_emission": tao_emission.get(netuid, Decimal(0)),
                "alpha_out_emission": alpha_emission.get(netuid, Decimal(0)),
                "emission_share": emission_share.get(netuid, Decimal(0)),
                "root_prop": root_prop.get(netuid),
                "conviction_locked_alpha": self._conviction_locked.get(netuid),
                "name": names.get(netuid),
                "symbol": symbols.get(netuid),
            })
        return rows

    async def _locked_alpha_by_subnet(self, view, netuids: list[int]) -> dict[int, Decimal | None]:
        """Sum rolled-forward conviction lock mass, refreshing in bounded batches."""
        totals: dict[int, Decimal | None] = {}

        async def one(netuid: int):
            try:
                result = await view.locks.subnet_convictions(netuid=netuid)
                entries = field(result, "entries", "convictions", "hotkeys", default=result)
                if isinstance(entries, dict):
                    entries = entries.values()
                total = Decimal(0)
                for entry in entries or []:
                    locked = field(entry, "locked_mass", "locked", "alpha_locked", default=0)
                    total += token_units(locked)
                return netuid, total
            except Exception:
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
