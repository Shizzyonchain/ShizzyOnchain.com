CREATE TABLE IF NOT EXISTS chain_blocks (
  block_number BIGINT PRIMARY KEY,
  block_hash TEXT NOT NULL UNIQUE,
  parent_hash TEXT,
  block_time TIMESTAMPTZ NOT NULL,
  finalized BOOLEAN NOT NULL DEFAULT TRUE,
  indexed_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS subnets (
  netuid INTEGER PRIMARY KEY,
  name TEXT,
  symbol TEXT,
  first_seen_block BIGINT NOT NULL,
  last_seen_block BIGINT NOT NULL
);

CREATE TABLE IF NOT EXISTS subnet_price_samples (
  time TIMESTAMPTZ NOT NULL,
  block_number BIGINT NOT NULL,
  block_hash TEXT NOT NULL,
  netuid INTEGER NOT NULL,
  price_tao NUMERIC(38,18) NOT NULL,
  tao_reserve NUMERIC(38,9),
  alpha_reserve NUMERIC(38,9),
  alpha_out NUMERIC(38,9),
  alpha_issuance NUMERIC(38,9),
  volume_tao NUMERIC(38,9),
  tao_in_emission NUMERIC(38,12),
  alpha_out_emission NUMERIC(38,12),
  emission_share NUMERIC(38,18),
  root_prop NUMERIC(38,18),
  conviction_locked_alpha NUMERIC(38,9),
  tempo INTEGER,
  staker_epoch_dividends_alpha NUMERIC(38,12),
  PRIMARY KEY (time, netuid, block_number)
);
ALTER TABLE subnet_price_samples ADD COLUMN IF NOT EXISTS tao_in_emission NUMERIC(38,12);
ALTER TABLE subnet_price_samples ADD COLUMN IF NOT EXISTS alpha_out_emission NUMERIC(38,12);
ALTER TABLE subnet_price_samples ADD COLUMN IF NOT EXISTS emission_share NUMERIC(38,18);
ALTER TABLE subnet_price_samples ADD COLUMN IF NOT EXISTS root_prop NUMERIC(38,18);
ALTER TABLE subnet_price_samples ADD COLUMN IF NOT EXISTS conviction_locked_alpha NUMERIC(38,9);
ALTER TABLE subnet_price_samples ADD COLUMN IF NOT EXISTS tempo INTEGER;
ALTER TABLE subnet_price_samples ADD COLUMN IF NOT EXISTS staker_epoch_dividends_alpha NUMERIC(38,12);
ALTER TABLE subnet_price_samples ADD COLUMN IF NOT EXISTS alpha_issuance NUMERIC(38,9);
CREATE UNIQUE INDEX IF NOT EXISTS subnet_price_block_uidx ON subnet_price_samples(netuid, block_number, time);
CREATE INDEX IF NOT EXISTS subnet_price_lookup_idx ON subnet_price_samples(netuid, time DESC);

CREATE TABLE IF NOT EXISTS subnet_candles_1m (
  time TIMESTAMPTZ NOT NULL,
  netuid INTEGER NOT NULL,
  first_block BIGINT NOT NULL,
  last_block BIGINT NOT NULL,
  open NUMERIC(38,18) NOT NULL,
  high NUMERIC(38,18) NOT NULL,
  low NUMERIC(38,18) NOT NULL,
  close NUMERIC(38,18) NOT NULL,
  volume_open NUMERIC(38,9),
  volume_close NUMERIC(38,9),
  PRIMARY KEY (netuid, time)
);
CREATE INDEX IF NOT EXISTS subnet_candles_1m_lookup_idx
  ON subnet_candles_1m(netuid, time DESC);

-- Existing installations already have raw finalized-block samples. Seed the
-- minute table once so all chart timeframes are fast immediately after deploy.
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM subnet_candles_1m LIMIT 1) THEN
    INSERT INTO subnet_candles_1m
      (time,netuid,first_block,last_block,open,high,low,close,volume_open,volume_close)
    SELECT date_trunc('minute',time),netuid,min(block_number),max(block_number),
           (array_agg(price_tao ORDER BY block_number))[1],max(price_tao),min(price_tao),
           (array_agg(price_tao ORDER BY block_number DESC))[1],
           (array_agg(volume_tao ORDER BY block_number))[1],
           (array_agg(volume_tao ORDER BY block_number DESC))[1]
    FROM subnet_price_samples
    GROUP BY 1,2
    ON CONFLICT DO NOTHING;
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS wallet_balance_snapshots (
  time TIMESTAMPTZ NOT NULL,
  block_number BIGINT NOT NULL,
  address TEXT NOT NULL,
  free_tao NUMERIC(38,9) NOT NULL,
  staked_tao_value NUMERIC(38,9),
  total_tao_value NUMERIC(38,9),
  PRIMARY KEY (time, address, block_number)
);
CREATE INDEX IF NOT EXISTS wallet_history_idx ON wallet_balance_snapshots(address, time DESC);

CREATE TABLE IF NOT EXISTS chain_events (
  block_number BIGINT NOT NULL,
  event_index INTEGER NOT NULL,
  block_hash TEXT NOT NULL,
  time TIMESTAMPTZ NOT NULL,
  event_type TEXT NOT NULL,
  netuid INTEGER,
  destination_netuid INTEGER,
  coldkey TEXT,
  destination_coldkey TEXT,
  hotkey TEXT,
  destination_hotkey TEXT,
  amount_alpha NUMERIC(38,9),
  amount_tao NUMERIC(38,9),
  perpetual BOOLEAN,
  raw JSONB NOT NULL DEFAULT '{}'::jsonb,
  PRIMARY KEY (block_number, event_index)
);
CREATE INDEX IF NOT EXISTS chain_events_time_idx ON chain_events(time DESC);
CREATE INDEX IF NOT EXISTS chain_events_netuid_time_idx ON chain_events(netuid, time DESC);
CREATE INDEX IF NOT EXISTS chain_events_destination_netuid_time_idx
  ON chain_events(destination_netuid, time DESC);

CREATE TABLE IF NOT EXISTS wallet_stake_snapshots (
  time TIMESTAMPTZ NOT NULL,
  block_number BIGINT NOT NULL,
  address TEXT NOT NULL,
  hotkey TEXT NOT NULL,
  netuid INTEGER NOT NULL,
  alpha NUMERIC(38,9) NOT NULL,
  tao_value NUMERIC(38,9),
  PRIMARY KEY (time, address, hotkey, netuid, block_number)
);
