import type { HistoryPoint } from "./root-comparison";
import { dailyCloseDrawdown } from "./daily-close-drawdown.mjs";
export type RootMode = "balanced" | "risk" | "returns";
export type RootMatch = { historyRollover?: boolean; operatingTimestamp: string; hotkey: string; name: string; take: number; totalReturn: number; drawdown: number; volatility: number; concentration: number; quoteGap: number; topFive: number; snapshot: string; identityTimestamp: string; start: string; end: string };
export function rootEligibility(row: { root_stake: string | null; take: number | null; nav_tao: string }) {
  const reasons: string[] = [];
  if (row.root_stake === null || !Number.isFinite(Number(row.root_stake)) || Number(row.root_stake) <= 0) reasons.push("Positive reported root stake unavailable");
  if (row.take === null || !Number.isFinite(row.take) || row.take < 0 || row.take > 1) reasons.push("Valid validator take unavailable");
  if (!Number.isFinite(Number(row.nav_tao)) || Number(row.nav_tao) <= 0) reasons.push("Basket has no positive realizable value");
  return reasons;
}
export function rootHistoryMetrics(history: HistoryPoint[], utcDay: number) {
  const expected = Array.from({ length: 31 }, (_, i) => new Date((utcDay - (31 - i) * 86400) * 1000).toISOString().slice(0, 10));
  const map = new Map(history.map(row => [row.day, row]));
  if (map.size !== history.length) throw new Error("Duplicate daily observations");
  const rows = expected.map(day => map.get(day));
  const life = rows.at(-1)?.twr_first_block;
  if (!life || rows.some(row => !row || row.twr_first_block !== life || !Number.isFinite(row.twr) || row.twr! <= 0 || !Number.isFinite(row.nav_per_share) || row.nav_per_share! <= 0)) throw new Error("Requires 31 consecutive completed daily observations with total-return and share-price data in the same fund life");
  const valid = rows as (HistoryPoint & { twr: number; nav_per_share: number })[];
  const drawdown = dailyCloseDrawdown(valid.map(row => row.nav_per_share));
  const changes: number[] = [];
  valid.forEach((row, index) => { if (index) changes.push(row.nav_per_share / valid[index - 1].nav_per_share - 1); });
  const mean = changes.reduce((sum, value) => sum + value, 0) / changes.length;
  return { totalReturn: valid.at(-1)!.twr / valid[0].twr - 1, drawdown, volatility: Math.sqrt(changes.reduce((sum, value) => sum + (value - mean) ** 2, 0) / changes.length), start: expected[0], end: expected.at(-1)! };
}
export function rootMatchExclusions(row: RootMatch, now: number) {
  const reasons: string[] = [];
  for (const [label, value, valid] of [
    ["Staker return", row.totalReturn, row.totalReturn > -1],
    ["Capital drawdown", row.drawdown, row.drawdown >= -1 && row.drawdown <= 0],
    ["Capital volatility", row.volatility, row.volatility >= 0],
    ["Holdings concentration", row.concentration, row.concentration > 0 && row.concentration <= 1.000001],
    ["Liquidity quote gap", row.quoteGap, row.quoteGap >= 0 && row.quoteGap <= 1],
    ["Top-five holdings", row.topFive, row.topFive >= 0 && row.topFive <= 1.000001],
    ["Validator take", row.take, row.take >= 0 && row.take <= 1],
  ] as const) if (!Number.isFinite(value) || !valid) reasons.push(`${label} is missing or invalid`);
  for (const [label, time] of [["Basket", row.snapshot], ["Fee/root stake", row.identityTimestamp], ["Active root permit", row.operatingTimestamp]] as const) {
    const timestamp = Date.parse(time);
    if (!Number.isFinite(timestamp)) reasons.push(`${label} source time is missing or invalid`);
    else if (timestamp > now + 60_000) reasons.push(`${label} source time is in the future (${time})`);
    else if (now - timestamp > 2 * 3600_000) reasons.push(`${label} snapshot is over two hours old (${time})`);
  }
  const yesterday = new Date(Math.floor(now / 86400_000) * 86400_000 - 86400_000).toISOString().slice(0, 10);
  const rollover = row.historyRollover === true && now % 86400_000 < 7200000 && row.end === new Date(Math.floor(now / 86400_000) * 86400_000 - 2 * 86400_000).toISOString().slice(0, 10);
  if (row.end !== yesterday && !rollover) reasons.push(`History ends ${row.end || "on an unknown day"}; completed history through ${yesterday} UTC is required`);
  return reasons;
}
export function rankRootMatches(matches: RootMatch[], mode: RootMode, now: number) {
  const valid = matches.filter(row => rootMatchExclusions(row, now).length === 0);
  if (valid.length < 2) return [];
  const weights = { balanced: [30, 20, 15, 20, 15], risk: [10, 30, 20, 25, 15], returns: [50, 15, 10, 15, 10] }[mode];
  const signal = (row: RootMatch) => [row.totalReturn, row.drawdown, -row.volatility, -row.concentration, -row.quoteGap];
  const labels = ["30-day return", "Capital drawdown", "Capital volatility", "Holdings concentration", "Liquidity quote gap"];
  return valid.map(row => {
    const factors = signal(row).map((value, index) => {
    const lower = valid.filter(other => signal(other)[index] < value).length;
    const tied = valid.filter(other => signal(other)[index] === value).length - 1;
    const percentile = (lower + tied / 2) / (valid.length - 1);
    return { index, label: labels[index], weight: weights[index], percentile, points: percentile * weights[index] };
    });
    return { ...row, factors, score: Math.round(factors.reduce((sum, factor) => sum + factor.points, 0) * 10) / 10 };
  }).sort((a, b) => b.score - a.score || a.hotkey.localeCompare(b.hotkey));
}
