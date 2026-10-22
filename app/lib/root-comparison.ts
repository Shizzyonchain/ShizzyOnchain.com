import { dailyCloseDrawdown } from "./daily-close-drawdown.mjs";
export type HistoryPoint = { day: string; timestamp: string; twr: number | null; twr_first_block: string | null; nav_per_share?: number | null };
export type RiskBasis = "capital" | "total-return";
export type Performance = { basis: RiskBasis; days: string[]; series: { values: number[]; totalReturn: number; drawdown: number }[] };
export function compareHistory(histories: HistoryPoint[][], basis: RiskBasis = "total-return"): Performance {
  const valueOf = (point: HistoryPoint) => basis === "capital" ? point.nav_per_share : point.twr;
  const label = basis === "capital" ? "capital NAV/share" : "total-return TWR";
  if (histories.length < 2 || histories.length > 3) throw new Error("Choose two or three baskets.");
  const lives = histories.map(history => {
    const sorted = [...history].sort((a, b) => a.day.localeCompare(b.day));
    const latest = sorted.at(-1);
    if (!latest?.twr_first_block || !Number.isFinite(valueOf(latest)) || valueOf(latest)! <= 0) throw new Error(`Comparable ${label} history is unavailable for a selected basket. No other series was substituted.`);
    const life = sorted.filter(point => point.twr_first_block === latest.twr_first_block && Number.isFinite(valueOf(point)) && valueOf(point)! > 0);
    if (new Set(life.map(point => point.day)).size !== life.length) throw new Error("Duplicate daily history.");
    return new Map(life.map(point => [point.day, valueOf(point)!]));
  });
  const days = [...lives[0].keys()].filter(day => lives.every(life => life.has(day))).sort();
  if (days.length < 2) throw new Error("Fewer than two shared daily observations in the current fund lives.");
  for (let i = 1; i < days.length; i++) if (Date.parse(days[i]) - Date.parse(days[i - 1]) !== 86400_000) throw new Error("Daily history has gaps. No continuous performance comparison was generated.");
  return { basis, days, series: lives.map(life => {
    const first = life.get(days[0])!;
    const values = days.map(day => life.get(day)! / first * 100);
    return { values, totalReturn: values.at(-1)! / 100 - 1, drawdown: dailyCloseDrawdown(days.map(day => life.get(day)!)) };
  }) };
}
type Exposure = { nav_tao: string; block_number: number; holdings: { netuid: number; realizable_tao: string }[] };
export function basketOverlap(a: Exposure, b: Exposure) {
  if (a.block_number !== b.block_number || !(Number(a.nav_tao) > 0) || !(Number(b.nav_tao) > 0)) return null;
  const right = new Map(b.holdings.map(holding => [holding.netuid, Number(holding.realizable_tao) / Number(b.nav_tao)]));
  const shared = a.holdings.map(holding => ({ netuid: holding.netuid, share: Math.min(Number(holding.realizable_tao) / Number(a.nav_tao), right.get(holding.netuid) || 0) })).filter(holding => holding.share > 0).sort((x, y) => y.share - x.share);
  return { overlap: shared.reduce((sum, holding) => sum + holding.share, 0), shared };
}
