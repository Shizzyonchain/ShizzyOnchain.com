from app.config import Settings


def test_live_rpc_endpoints_are_ordered_and_deduplicated():
    settings = Settings(
        subtensor_ws_url="wss://primary.example",
        subtensor_ws_fallback_urls="wss://backup.example, wss://primary.example",
    )

    assert settings.subtensor_ws_urls == [
        "wss://primary.example",
        "wss://backup.example",
    ]


def test_official_archive_is_the_default_live_fallback():
    settings = Settings()

    assert settings.subtensor_ws_urls == [
        "wss://entrypoint-finney.opentensor.ai:443",
        "wss://archive.chain.opentensor.ai:443",
    ]
