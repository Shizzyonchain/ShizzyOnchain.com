import type { FxPoint } from "./currency-returns";

export function mergeFxHistory(previous: FxPoint[], incoming: FxPoint[], now = Date.now() / 1000): FxPoint[] {
  const merged = new Map<number, FxPoint>();
  for (const point of [...previous, ...incoming]) {
    if (!Number.isFinite(point?.time) || !Number.isFinite(point?.usd) || point.usd <= 0
      || point.time < now - 8 * 86400 || point.time > now) continue;
    const existing = merged.get(point.time);
    if (!point.carriedFrom || !existing || existing.carriedFrom) merged.set(point.time, point);
  }
  return [...merged.values()].sort((a, b) => a.time - b.time);
}
