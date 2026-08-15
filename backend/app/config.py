from functools import lru_cache

from pydantic import Field, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    # Render supplies list settings as ordinary comma-separated strings. Disable
    # Pydantic's automatic JSON decoding so the validator below can normalize
    # both single values and comma-separated lists consistently.
    model_config = SettingsConfigDict(
        env_file=".env",
        extra="ignore",
        enable_decoding=False,
    )

    database_url: str = "postgresql://shizzy:shizzy@localhost:5432/shizzy"
    subtensor_ws_url: str = "wss://entrypoint-finney.opentensor.ai:443"
    subtensor_ws_fallback_urls: list[str] = Field(
        default_factory=lambda: ["wss://archive.chain.opentensor.ai:443"]
    )
    backfill_ws_url: str = "wss://archive.chain.opentensor.ai:443"
    backfill_price_gaps: bool = True
    backfill_sample_blocks: int = 5
    backfill_concurrency: int = 4
    subtensor_network: str = "finney"
    indexer_start_block: str = "latest"
    indexer_confirmation_mode: str = "finalized"
    index_wallet_snapshots: bool = False
    watched_wallets: list[str] = Field(default_factory=list)
    api_keys: list[str] = Field(default_factory=list)
    public_reads: bool = False
    allowed_origins: list[str] = Field(default_factory=list)
    max_mass_wallets: int = 100
    max_pending_wallet_jobs: int = 25
    wallet_job_retention_hours: int = 24
    wallet_query_concurrency: int = 8
    wallet_rpc_timeout_seconds: float = 30
    rpc_connect_timeout_seconds: float = 8
    rpc_subscribe_timeout_seconds: float = 8
    rpc_head_timeout_seconds: float = 30
    rpc_block_timeout_seconds: float = 45
    log_level: str = "INFO"

    @field_validator(
        "api_keys",
        "allowed_origins",
        "watched_wallets",
        "subtensor_ws_fallback_urls",
        mode="before",
    )
    @classmethod
    def split_csv(cls, value):
        if isinstance(value, str):
            return [part.strip() for part in value.split(",") if part.strip()]
        return value

    @property
    def subtensor_ws_urls(self) -> list[str]:
        """Ordered, de-duplicated live RPC endpoints used by the indexer."""
        return list(dict.fromkeys([self.subtensor_ws_url, *self.subtensor_ws_fallback_urls]))


@lru_cache
def get_settings() -> Settings:
    return Settings()
