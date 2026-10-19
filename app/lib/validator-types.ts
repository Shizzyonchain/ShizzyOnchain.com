export type Validator = {
  hotkey: string; coldkey: string; name: string | null; rank: number;
  active_subnets: number; global_nominators: number; take: string;
  global_weighted_stake: string; root_stake: string; weighted_root_stake: string;
  global_alpha_stake_as_tao: string; dominance: string;
  global_weighted_stake_24_hr_change: string | null;
  dominance_24_hr_change: string | null; global_nominators_24_hr_change: number | null;
  nominator_return_per_day: string; validator_return_per_day: string;
  root_rank: number; alpha_rank: number; created_on_date: string | null;
  block_number: number; timestamp: string;
};
export type ValidatorYield = {
  hotkey: string; netuid: number; stake: string; timestamp: string; block_number: number;
  one_hour_apy: number | null; one_day_apy: number | null;
  seven_day_apy: number | null; thirty_day_apy: number | null;
  one_day_epoch_participation: number | null;
  seven_day_epoch_participation: number | null;
  thirty_day_epoch_participation: number | null;
};
export type ValidatorResult<T> = {
  data: T[];
  pagination: { current_page: number; next_page: number | null; prev_page: number | null; total_items: number; total_pages: number };
};

export function numeric(value: unknown): number | null {
  if (value === null || value === undefined || value === "") return null;
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}
export function displayNumber(value: unknown, digits = 2): string {
  const n = numeric(value);
  return n === null ? "—" : n.toLocaleString("en-US", { maximumFractionDigits: digits });
}
export function rao(value: unknown): number | null {
  const n = numeric(value);
  return n === null ? null : n / 1e9;
}
export function shortAddress(address: string): string {
  return `${address.slice(0, 6)}…${address.slice(-6)}`;
}

export function directorySnapshotTimes(rows: { timestamp: string }[], now: number) {
  const times = rows.map(row => Date.parse(row.timestamp));
  const valid = times.filter(Number.isFinite);
  return { oldest: valid.length ? Math.min(...valid) : null, newest: valid.length ? Math.max(...valid) : null,
    stale: times.filter(time => !Number.isFinite(time) || now - time > 7200000 || time > now + 60000).length };
}
