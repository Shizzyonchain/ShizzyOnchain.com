import re
from hashlib import blake2b
from datetime import datetime
from decimal import Decimal

from pydantic import BaseModel, Field, field_validator


_BASE58_ALPHABET = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz"


def valid_bittensor_ss58(address: str) -> bool:
    """Validate a Bittensor (SS58 network 42) account checksum."""
    try:
        number = 0
        for character in address:
            number = number * 58 + _BASE58_ALPHABET.index(character)
        decoded = number.to_bytes((number.bit_length() + 7) // 8, "big")
        decoded = b"\0" * (len(address) - len(address.lstrip("1"))) + decoded
        if len(decoded) != 35 or decoded[0] != 42:
            return False
        checksum = blake2b(b"SS58PRE" + decoded[:-2], digest_size=64).digest()
        return decoded[-2:] == checksum[:2]
    except (ValueError, OverflowError):
        return False


class MassWalletRequest(BaseModel):
    addresses: list[str] = Field(min_length=1)
    persist: bool = False

    @field_validator("addresses")
    @classmethod
    def unique_addresses(cls, value: list[str]) -> list[str]:
        addresses = list(dict.fromkeys(address.strip() for address in value))
        invalid = [address for address in addresses if not re.fullmatch(r"[1-9A-HJ-NP-Za-km-z]{45,50}", address) or not valid_bittensor_ss58(address)]
        if invalid:
            examples = ", ".join(f"{address[:6]}…{address[-5:]}" for address in invalid[:3])
            raise ValueError(f"invalid Bittensor public coldkey checksum: {examples}")
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
