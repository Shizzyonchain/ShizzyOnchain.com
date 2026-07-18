import asyncio
from dataclasses import asdict, is_dataclass
from decimal import Decimal
from typing import Any

from app.config import Settings

RAO_PER_TAO = Decimal(1_000_000_000)


def amount(value: Any) -> Decimal:
    """Convert v11 Balance/numeric values without crossing TAO/alpha units."""
    if value is None:
        return Decimal(0)
    raw = getattr(value, "amount", value)
    return Decimal(str(raw))


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
        infos, prices, tao_rows, alpha_rows, out_rows, volume_rows, symbol_rows = await asyncio.gather(
            view.subnets.all(),
            view.prices.alpha_prices(),
            view.query_map(("SubtensorModule", "SubnetTAO")),
            view.query_map(("SubtensorModule", "SubnetAlphaIn")),
            view.query_map(("SubtensorModule", "SubnetAlphaOut")),
            view.query_map(("SubtensorModule", "SubnetVolume")),
            view.query_map(("SubtensorModule", "TokenSymbol")),
        )
        tao = {int(k): Decimal(int(v)) / RAO_PER_TAO for k, v in tao_rows}
        alpha = {int(k): Decimal(int(v)) / RAO_PER_TAO for k, v in alpha_rows}
        alpha_out = {int(k): Decimal(int(v)) / RAO_PER_TAO for k, v in out_rows}
        volume = {int(k): Decimal(int(v)) / RAO_PER_TAO for k, v in volume_rows}
        symbols = {int(k): self._text(v) for k, v in symbol_rows}
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
                "name": None,
                "symbol": symbols.get(netuid),
            })
        return rows

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
