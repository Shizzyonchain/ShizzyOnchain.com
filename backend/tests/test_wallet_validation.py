import pytest
from pydantic import ValidationError

from app.models import MassWalletRequest, valid_bittensor_ss58


VALID_COLDKEY = "5E4z3h9yVhmQyCFWNbY9BPpwhx4xFiPwq3eeqmBgVF6KULde"
BAD_CHECKSUM = "5DNuqbrPZppgxURaiSif8M8zQCpnVxE8VDnJrK2s3S1o1DfU"


def test_valid_bittensor_coldkey_checksum():
    assert valid_bittensor_ss58(VALID_COLDKEY)
    assert MassWalletRequest(addresses=[VALID_COLDKEY]).addresses == [VALID_COLDKEY]


def test_rejects_base58_string_with_invalid_checksum():
    assert not valid_bittensor_ss58(BAD_CHECKSUM)
    with pytest.raises(ValidationError, match="invalid Bittensor public coldkey checksum"):
        MassWalletRequest(addresses=[BAD_CHECKSUM])
