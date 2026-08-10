ALTER TABLE subnet_price_samples
  ADD COLUMN IF NOT EXISTS excess_tao_emission NUMERIC(38,12);

