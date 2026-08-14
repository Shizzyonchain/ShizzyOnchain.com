CREATE TABLE IF NOT EXISTS subnet_latest_samples (
  LIKE subnet_price_samples INCLUDING DEFAULTS
);

CREATE UNIQUE INDEX IF NOT EXISTS subnet_latest_samples_netuid_uidx
  ON subnet_latest_samples(netuid);

INSERT INTO subnet_latest_samples
SELECT latest.*
FROM subnets known
JOIN LATERAL (
  SELECT sample.*
  FROM subnet_price_samples sample
  WHERE sample.netuid=known.netuid
  ORDER BY sample.time DESC,sample.block_number DESC
  LIMIT 1
) latest ON true
ON CONFLICT(netuid) DO NOTHING;
