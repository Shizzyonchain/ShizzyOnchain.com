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
  volume_tao NUMERIC(38,9),
  tao_in_emission NUMERIC(38,12),
  alpha_out_emission NUMERIC(38,12),
  PRIMARY KEY (time, netuid, block_number)
);
ALTER TABLE subnet_price_samples ADD COLUMN IF NOT EXISTS tao_in_emission NUMERIC(38,12);
ALTER TABLE subnet_price_samples ADD COLUMN IF NOT EXISTS alpha_out_emission NUMERIC(38,12);
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
