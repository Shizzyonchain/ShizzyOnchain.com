import "server-only";
import type { FxPoint } from "./currency-returns";

export async function getTaoHistory(): Promise<FxPoint[]> {
  const now = Math.floor(Date.now() / 60_000) * 60;
  // Small, cacheable one-minute windows cover current, 10m, 1h, 24h and 7d
  // comparisons without fetching seven days of minute candles on every request.
  const windows = [[now - 10800, now], ...[86400, 604800].map(offset => {
    const anchor = Math.floor((now - offset) / 300) * 300;
    return [anchor - 1800, anchor + 600];
  })];
  const results = await Promise.allSettled(windows.map(async ([start, end]) => {
    const url = new URL("https://api.exchange.coinbase.com/products/TAO-USD/candles");
    url.searchParams.set("granularity", "60");
    url.searchParams.set("start", new Date(start * 1000).toISOString());
    url.searchParams.set("end", new Date(end * 1000).toISOString());
    const response = await fetch(url, { next: { revalidate: 60 }, signal: AbortSignal.timeout(6000) });
    if (!response.ok) throw new Error(`History HTTP ${response.status}`);
    const raw: unknown = await response.json();
    if (!Array.isArray(raw)) throw new Error("Invalid history");
    return raw.flatMap((c): FxPoint[] => {
      if (!Array.isArray(c) || c.length < 5) return [];
      const time = Number(c[0]) + 60, usd = Number(c[4]);
      return Number.isFinite(time) && time <= now && Number.isFinite(usd) && usd > 0 ? [{ time, usd }] : [];
    });
  }));
  const points = new Map<number, FxPoint>();
  for (const result of results) {
    if (result.status === "fulfilled") for (const point of result.value) points.set(point.time, point);
  }
  return [...points.values()].sort((a, b) => a.time - b.time);
}
