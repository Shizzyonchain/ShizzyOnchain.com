import re
from datetime import datetime
from decimal import Decimal

from pydantic import BaseModel, Field, field_validator


class MassWalletRequest(BaseModel):
    addresses: list[str] = Field(min_length=1)
    persist: bool = False

    @field_validator("addresses")
    @classmethod
    def unique_addresses(cls, value: list[str]) -> list[str]:
        addresses = list(dict.fromkeys(address.strip() for address in value))
        invalid = [address for address in addresses if not re.fullmatch(r"[1-9A-HJ-NP-Za-km-z]{45,50}", address)]
        if invalid:
            raise ValueError("every address must be a valid-length base58 SS58 coldkey")
        return addresses


class StakePosition(BaseModel):
    hotkey: str
    netuid: int
    alpha: Decimal
    tao_value: Decimal | None = None


class WalletResult(BaseModel):
    address: str
    block_number: int
    free_tao: Decimal
    staked_tao_value: Decimal | None
    total_tao_value: Decimal | None
    stakes: list[StakePosition]
    error: str | None = None


class PricePoint(BaseModel):
    time: datetime
    block_number: int
    netuid: int
    price_tao: Decimal
    tao_reserve: Decimal | None
    alpha_reserve: Decimal | None
