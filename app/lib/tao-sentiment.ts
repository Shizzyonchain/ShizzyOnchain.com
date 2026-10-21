type NumberLike = string | number | null;
export type SentimentRow = {
  netuid: number;
  time?: string | null;
  change_1h?: NumberLike;
  liquidity_change_1h?: NumberLike;
  volume_1h_tao?: NumberLike;
  volume_acceleration_1h?: NumberLike;
  change_24h?: NumberLike;
  liquidity_change_24h?: NumberLike;
  volume_24h_tao?: NumberLike;
  volume_acceleration_24h?: NumberLike;
};
const numeric = (value: NumberLike | undefined) => value !== null && value !== undefined && value !== "" && Number.isFinite(Number(value));
const clamp = (value: number) => Math.max(0, Math.min(100, value));
const median = (values: number[]) => {
  const sorted = [...values].sort((a, b) => a - b), mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
};
export function sentimentLabel(score: number) {
  return score < 25 ? "Extreme fear" : score < 45 ? "Fear" : score <= 55 ? "Neutral" : score <= 75 ? "Greed" : "Extreme greed";
}

// A transparent heuristic, not a surveyed emotion index or calibrated forecast.
// Raw alpha/TAO data keeps the reading independent of the display currency.
export function taoSentiment(rows: SentimentRow[], period: "1h" | "24h" = "1h") {
  const roster = rows.filter(row => row.netuid > 0).map(row => period === "1h" ? row : ({
    ...row, change_1h: row.change_24h, liquidity_change_1h: row.liquidity_change_24h,
    volume_1h_tao: row.volume_24h_tao, volume_acceleration_1h: row.volume_acceleration_24h,
  }));
  const times = roster.map(row => Date.parse(row.time || "")).filter(Number.isFinite);
  const newest = times.length ? Math.max(...times) : NaN;
  const usable = roster.filter(row => {
    const time = Date.parse(row.time || "");
    return Number.isFinite(time) && newest - time <= 180_000 &&
      numeric(row.change_1h) && numeric(row.liquidity_change_1h) && Number(row.liquidity_change_1h) > -100 &&
      numeric(row.volume_1h_tao) && Number(row.volume_1h_tao) >= 0 &&
      // Zero is a valid ratio when this period has no trades and the prior period did.
      numeric(row.volume_acceleration_1h) && Number(row.volume_acceleration_1h) >= 0;
  });
  const coverage = roster.length ? usable.length / roster.length : 0;
  if (roster.length < 32 || coverage < 0.8) return null;
  const breadth = 100 * usable.reduce((sum, row) => sum + (Number(row.change_1h) > 0 ? 1 : Number(row.change_1h) < 0 ? 0 : 0.5), 0) / usable.length;
  const momentum = clamp(50 + median(usable.map(row => Number(row.change_1h))) * 10);
  const liquidity = clamp(50 + median(usable.map(row => Number(row.liquidity_change_1h))) * 10);
  let volume = 0, directionalActivity = 0;
  for (const row of usable) {
    const current = Number(row.volume_1h_tao);
    volume += current;
    directionalActivity += current * Math.sign(Number(row.change_1h)) * Math.min(1, Math.max(0, Number(row.volume_acceleration_1h) - 1));
  }
  // Quiet volume stays neutral; high volume amplifies its observed direction.
  const volumeScore = volume > 0 ? clamp(50 + 50 * directionalActivity / volume) : 50;
  return { score: Math.round(breadth * 0.35 + momentum * 0.25 + liquidity * 0.25 + volumeScore * 0.15),
    coverage, count: usable.length, total: roster.length, updatedAt: newest,
    components: { breadth, momentum, liquidity, volume: volumeScore } };
}
