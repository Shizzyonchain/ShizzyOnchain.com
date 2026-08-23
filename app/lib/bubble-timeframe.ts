export type BubbleTimeframe = "change_10m" | "change_1h" | "change_24h";

export const bubbleTimeframes: BubbleTimeframe[] = ["change_10m", "change_1h", "change_24h"];

const fallbackOrder: BubbleTimeframe[] = ["change_24h", "change_1h", "change_10m"];

export function bubbleTimeframeHasCoverage(
  rows: Array<Record<string, unknown>>,
  timeframe: BubbleTimeframe,
  requiredRatio = 0.8,
) {
  if (!rows.length) return false;
  const required = Math.max(1, Math.ceil(rows.length * requiredRatio));
  const covered = rows.filter((row) => {
    const value = row[timeframe];
    return value !== null && value !== undefined && value !== "" && Number.isFinite(Number(value));
  }).length;
  return covered >= required;
}

export function bestAvailableBubbleTimeframe(rows: Array<Record<string, unknown>>): BubbleTimeframe {
  return fallbackOrder.find((timeframe) => bubbleTimeframeHasCoverage(rows, timeframe)) || "change_24h";
}

export function resolveBubbleTimeframe(
  rows: Array<Record<string, unknown>>,
  preferred: BubbleTimeframe,
): BubbleTimeframe {
  return bubbleTimeframeHasCoverage(rows, preferred) ? preferred : bestAvailableBubbleTimeframe(rows);
}

export function bubbleTimeframeLabel(timeframe: BubbleTimeframe) {
  if (timeframe === "change_10m") return "10-minute";
  if (timeframe === "change_1h") return "1-hour";
  return "1-day";
}
