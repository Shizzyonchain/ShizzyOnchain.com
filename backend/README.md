# ShizzyUnchained Subtensor data pipeline

A deployable Bittensor market-intelligence application for indexing **finalized** blocks into
PostgreSQL/TimescaleDB and presenting subnet price action and wallet portfolios through a polished
responsive web interface. It is read-only: it never loads a wallet key or submits an extrinsic.

The code targets the current Bittensor Python SDK v11. The chain adapter is deliberately small so
runtime/SDK changes are isolated in `app/chain.py`.

## What is included

- `chain_subscribeFinalizedHeads` WebSocket subscription with reconnect/backoff.
- Block-pinned SDK reads, so every subnet in one sample comes from the same finalized state.
- Spot price from Bittensor's `alpha_prices` runtime read; pool reserves and alpha-out are retained.
  Do not recompute price as a simple reserve ratio: current pools are weighted Balancer pools.
- Idempotent block ingestion and automatic catch-up over missed finalized blocks.
- Timescale hypertables, raw per-block samples, and 1-minute OHLC continuous aggregates.
- Live mass wallet checks (free TAO, stake positions, chain-valued stake in TAO), with optional
  persistence for portfolio history.
- Responsive ShizzyUnchained web app with a sortable screener, momentum list, multi-timeframe
  canvas charts, search, and a combined mass-wallet portfolio view.
- Screener metrics for 1-hour, 24-hour, and 7-day price change, cumulative-volume deltas,
  liquidity, alpha supply, and TAO-denominated market capitalization.
- API-key authentication, strict CORS, loopback-only API publishing, non-root/read-only containers,
  and Redis-backed price notifications.

## Architecture

```text
your Subtensor node (private ws://...:9944)
       | finalized heads + block-pinned reads
       v
indexer ---> TimescaleDB ---> REST API ---> ShizzyUnchained web app
                |                 |
                +---- Redis ------+---- WebSocket clients
```

The browser should normally call your shizzyunchained.com backend, not this service directly. That
keeps the API key off the public website and gives you one place for user quotas and caching.

## Quick start

Prerequisites: Docker Engine with Compose v2, 4 GB free RAM for the app stack, and a reachable
Subtensor WebSocket endpoint.

1. Copy `.env.example` to `.env`.
2. Set `POSTGRES_PASSWORD` in `.env` (Compose uses it to initialize PostgreSQL).
3. Set the same long random value in `API_KEYS` and `API_KEY`, then choose `SUBTENSOR_WS_URL`.
   `API_KEYS` protects the backend; `API_KEY` is injected only into the server-side web proxy.
4. Start the stack:

   ```bash
   docker compose up -d --build
   docker compose logs -f indexer
   ```

5. Open `http://127.0.0.1:3000` to use the screener and wallet checker. Verify the services:

   ```bash
   curl http://127.0.0.1:8000/healthz
   curl -H "X-API-Key: YOUR_KEY" http://127.0.0.1:8000/v1/subnets/prices
   ```

The public Finney endpoint in the template is useful for a smoke test. Production should point at
your own node so traffic limits or third-party outages cannot interrupt indexing.

## Running your own Subtensor node

Use the official Subtensor repository and its Compose file; do not copy an image or binary from an
unofficial registry. A lite node is sufficient for live indexing from its retained window (currently
roughly 300 blocks). An archive node is required to backfill/query state outside that window.

On a separate Linux host (recommended):

```bash
git clone https://github.com/RaoFoundation/subtensor.git
cd subtensor
docker compose up -d mainnet-lite
docker compose logs -f mainnet-lite
```

Keep RPC bound to a private interface/firewall. Point `SUBTENSOR_WS_URL` at that private address.
For an archive deployment, start `mainnet-archive` instead and provision fast NVMe with generous
growth headroom. The current official guide lists about 128 GB for lite and at least 3.5 TB (growing)
for archive, with 4+ CPU cores and 16 GB RAM as the floor. Recheck the guide before ordering hardware.

## API

All `/v1` routes require `X-API-Key` unless `PUBLIC_READS=true`.

- `GET /healthz` — DB and indexer watermark.
- `GET /v1/subnets/prices` — current price and pool state for all indexed subnets.
- `GET /v1/screener` — current markets plus 1h/24h/7d performance, 24h volume, liquidity,
  alpha supply, and market cap.
- `GET /v1/subnets/{netuid}/prices?interval=raw|1m&start=...&end=...&limit=...` — history.
- `POST /v1/wallets/mass-check` — up to `MAX_MASS_WALLETS` coldkeys at one finalized block.
- `GET /v1/wallets/{address}/history` — snapshots previously stored with `persist: true`.
- `WS /v1/ws/prices?api_key=...` — a full latest-price snapshot after each indexed block.

Example mass check:

```json
{
  "addresses": ["5F...", "5G..."],
  "persist": false
}
```

`persist` should only be enabled for wallets whose history you intend to retain. The response values
are decimal JSON strings where necessary; never convert token values through binary floating point.

## Backfill and restart behavior

- With an empty database and `INDEXER_START_BLOCK=latest`, indexing begins at the next finalized
  head and does not fabricate history.
- Set `INDEXER_START_BLOCK=1234567` before the first start to backfill from that block. This requires
  an archive endpoint capable of serving every requested block.
- After any restart, the indexer resumes at `max(chain_blocks.block_number) + 1` and fills gaps.
- The worker also detects historical chart gaps and repairs them in the background from
  `BACKFILL_WS_URL` (the official Finney archive endpoint by default). It stores a real
  block-pinned market snapshot every `BACKFILL_SAMPLE_BLOCKS` blocks; the default of five
  produces one-minute chart coverage while live indexing continues.
- Inserts are idempotent. Never run two indexer replicas against one database unless you add a
  PostgreSQL advisory-lock leader election layer.

## Deployment path

1. **Smoke test:** app Compose stack plus public Finney endpoint; leave it running for several blocks.
2. **Own node:** run a lite node on private networking; change `SUBTENSOR_WS_URL`; verify the watermark.
3. **Reverse proxy:** place Caddy/Nginx/your cloud load balancer in front of loopback port 8000, enable
   and port 3000, enable TLS, request/body limits, and per-IP/user rate limits. Route the public domain
   to port 3000; keep port 8000 private because the web server proxies API requests with its server-side
   key. Keep `/docs` private if the API surface should not be advertised.
4. **Website integration:** point shizzyunchained.com at the web container. The API credential remains
   on the server and is never embedded in browser JavaScript.
5. **Production database:** use encrypted disks, daily logical/schema backups plus volume snapshots,
   tested restores, retention/compression policies, and alerts for storage, lag, and failed restarts.
6. **Archive/backfill:** deploy an archive node separately, take a database backup, set the initial
   block on a fresh database, and let catch-up finish before switching traffic.

## Security and operational notes

- Never expose Subtensor RPC port 9944 directly to the internet. Firewall it to the indexer host and
  do not enable unsafe RPC methods.
- This service does not need seed phrases or wallet files. Do not mount them into these containers.
- Rotate API keys and database passwords through your secret manager. `.env` is excluded from the
  Docker build context; do not commit it.
- `PUBLIC_READS=true` is convenient but unsuitable for an unmetered public launch. Add proxy-level
  quotas and abuse controls first.
- Validate/limit upstream request sizes at the proxy. The application caps wallet count, history
  duration, and returned rows.
- Alert when the last indexed block is stale, WebSocket reconnects persist, DB connections saturate,
  or disk use crosses 70/85/95 percent.
- TAO/USD is not on the Bittensor chain. Add a separately attributed market-data feed and table if
  the website needs USD values; do not label TAO-denominated prices as dollars.

## Development and verification

```bash
python -m venv .venv
. .venv/bin/activate
pip install -e ".[dev]"
ruff check .
pytest
docker compose config
```

Before a production upgrade, test the new SDK/node runtime against a staging database. The first
place to adjust for an SDK shape change is `app/chain.py`; API and schema code should not need to know
the SDK's internal object layout.

If upgrading an existing database created by the earlier starter, apply the screener migration once:

```bash
docker compose exec -T postgres psql -U shizzy -d shizzy < db/migrations/002_screener.sql
```

The web app lives under `web/`. Its only runtime secrets are `BACKEND_API_URL` and
`BACKEND_API_KEY`; Compose supplies both from the root environment.

## Official references

- Bittensor SDK: https://www.bittensor.com/docs/sdk
- v11 migration and exact read mappings: https://www.bittensor.com/docs/migration
- Staking and weighted pool price semantics: https://www.bittensor.com/docs/concepts/staking-pools
- Running a node: https://www.bittensor.com/docs/guides/running-a-node
- Subtensor source: https://github.com/RaoFoundation/subtensor
