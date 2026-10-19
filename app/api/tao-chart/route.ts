import { NextRequest, NextResponse } from "next/server";
import { aggregateBars, chartIntervals, priceBars } from "../../lib/chart-data";

export const revalidate = 60;

type CoinbaseCandle = [number, number, number, number, number, number];
const granularities: Record<string, number> = { "1m": 60, "10m": 300, "1h": 3600, "1d": 86400, "1w": 86400, "1mo": 86400 };

export async function GET(request: NextRequest) {
  const interval = request.nextUrl.searchParams.get("interval") || "1h";
  const granularity = granularities[interval];
  if (!granularity) return NextResponse.json({ error: "Unsupported interval" }, { status: 400 });
  try {
    const long = interval === "1w" || interval === "1mo";
    const end = Math.floor(Date.now() / 86400000) * 86400000 + 86400000;
    const pages = await Promise.all(Array.from({ length: long ? 3 : 1 }, async (_, index) => {
      const url = new URL("https://api.exchange.coinbase.com/products/TAO-USD/candles");
      url.searchParams.set("granularity", String(granularity));
      if (long) { url.searchParams.set("start", new Date(end - (index + 1) * 299 * 86400000).toISOString()); url.searchParams.set("end", new Date(end - index * 299 * 86400000).toISOString()); }
      const response = await fetch(url, { headers: { "User-Agent": "ShizzyUnchained/1.0" }, next: { revalidate: 60 }, signal: AbortSignal.timeout(6000) });
      if (!response.ok) throw new Error("Exchange history unavailable");
      const rows = await response.json();
      if (!Array.isArray(rows)) throw new Error("Invalid candle response");
      return rows as CoinbaseCandle[];
    }));
    const raw = pages.flat();
    const normalized = raw.filter(c => Array.isArray(c) && c.length >= 6).sort((a, b) => a[0] - b[0]).map(c => ({
      time: new Date(c[0] * 1000).toISOString(), low: String(c[1]), high: String(c[2]),
      open: String(c[3]), close: String(c[4]), volume_tao: String(c[5]),
    }));
    // Use UTC bucket boundaries, not adjacent pairs: missing 5-minute trades
    // must not join two unrelated buckets or shift the 10-minute timestamps.
    const bars = priceBars(normalized);
    const aggregated = interval === "10m" ? aggregateBars(bars, chartIntervals[interval]) : bars;
    const data = aggregated.slice(-(long ? 900 : 180)).map(bar => ({ time: new Date(bar.time * 1000).toISOString(),
      open: String(bar.open), high: String(bar.high), low: String(bar.low), close: String(bar.close), volume_tao: String(bar.volume) }));
    return NextResponse.json({ data, source: "coinbase", interval, method: "exchange" });
  } catch {
    return NextResponse.json({ error: "TAO chart unavailable" }, { status: 503 });
  }
}
