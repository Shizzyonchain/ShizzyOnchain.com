import type { HistoryPoint } from "./root-comparison";
export type RootMode = "balanced" | "risk" | "returns";
export type RootMatch = { hotkey: string; name: string; take: number; totalReturn: number; drawdown: number; volatility: number; concentration: number; quoteGap: number; topFive: number; snapshot: string; identityTimestamp: string; start: string; end: string };
export function rootHistoryMetrics(history: HistoryPoint[], utcDay: number) {
  const expected = Array.from({ length: 31 }, (_, i) => new Date((utcDay - (31 - i) * 86400) * 1000).toISOString().slice(0, 10));
  const map = new Map(history.map(row => [row.day, row]));
  if (map.size !== history.length) throw new Error("Duplicate daily observations");
  const rows = expected.map(day => map.get(day));
  const life = rows.at(-1)?.twr_first_block;
  if (!life || rows.some(row => !row || row.twr_first_block !== life || !Number.isFinite(row.twr) || row.twr! <= 0 || !Number.isFinite(row.nav_per_share) || row.nav_per_share! <= 0)) throw new Error("Requires 31 consecutive completed daily observations with total-return and share-price data in the same fund life");
  const valid = rows as (HistoryPoint & { twr: number; nav_per_share: number })[];
  let peak = valid[0].nav_per_share, drawdown = 0;
  const changes: number[] = [];
  valid.forEach((row, index) => { peak = Math.max(peak, row.nav_per_share); drawdown = Math.min(drawdown, row.nav_per_share / peak - 1); if (index) changes.push(row.nav_per_share / valid[index - 1].nav_per_share - 1); });
  const mean = changes.reduce((sum, value) => sum + value, 0) / changes.length;
  return { totalReturn: valid.at(-1)!.twr / valid[0].twr - 1, drawdown, volatility: Math.sqrt(changes.reduce((sum, value) => sum + (value - mean) ** 2, 0) / changes.length), start: expected[0], end: expected.at(-1)! };
}
export function rankRootMatches(matches: RootMatch[], mode: RootMode, now: number) {
  const valid = matches.filter(row => [row.totalReturn, row.drawdown, row.volatility, row.concentration, row.quoteGap, row.topFive, row.take].every(Number.isFinite) && row.take >= 0 && row.take <= 1 && row.drawdown <= 0 && row.volatility >= 0 && row.concentration > 0 && row.concentration <= 1.000001 && row.quoteGap >= 0 && row.quoteGap <= 1 && [row.snapshot, row.identityTimestamp].every(time => Number.isFinite(Date.parse(time)) && now - Date.parse(time) <= 2 * 3600_000 && Date.parse(time) <= now + 60_000) && row.end === new Date(Math.floor(now / 86400_000) * 86400_000 - 86400_000).toISOString().slice(0, 10));
  if (valid.length < 2) return [];
  const weights = { balanced: [30, 20, 15, 20, 15], risk: [10, 30, 20, 25, 15], returns: [50, 15, 10, 15, 10] }[mode];
  const signal = (row: RootMatch) => [row.totalReturn, row.drawdown, -row.volatility, -row.concentration, -row.quoteGap];
  return valid.map(row => ({ ...row, score: Math.round(signal(row).reduce((sum, value, index) => {
    const lower = valid.filter(other => signal(other)[index] < value).length;
    const tied = valid.filter(other => signal(other)[index] === value).length - 1;
    return sum + (lower + tied / 2) / (valid.length - 1) * weights[index];
  }, 0) * 10) / 10 })).sort((a, b) => b.score - a.score || a.hotkey.localeCompare(b.hotkey));
}
