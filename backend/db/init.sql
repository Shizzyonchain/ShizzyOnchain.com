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
  description TEXT,
  website TEXT,
  github_repo TEXT,
  discord TEXT,
  contact TEXT,
  logo_url TEXT,
  additional TEXT,
  first_seen_block BIGINT NOT NULL,
  last_seen_block BIGINT NOT NULL
);
ALTER TABLE subnets ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE subnets ADD COLUMN IF NOT EXISTS website TEXT;
ALTER TABLE subnets ADD COLUMN IF NOT EXISTS github_repo TEXT;
ALTER TABLE subnets ADD COLUMN IF NOT EXISTS discord TEXT;
ALTER TABLE subnets ADD COLUMN IF NOT EXISTS contact TEXT;
ALTER TABLE subnets ADD COLUMN IF NOT EXISTS logo_url TEXT;
ALTER TABLE subnets ADD COLUMN IF NOT EXISTS additional TEXT;

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

CREATE TABLE IF NOT EXISTS wallet_lookup_jobs (
  id TEXT PRIMARY KEY,
  status TEXT NOT NULL DEFAULT 'queued',
  addresses JSONB NOT NULL,
  results JSONB NOT NULL DEFAULT '[]'::jsonb,
  completed INTEGER NOT NULL DEFAULT 0,
  total INTEGER NOT NULL,
  block_number BIGINT,
  error TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS wallet_lookup_jobs_created_idx ON wallet_lookup_jobs(created_at DESC);

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
