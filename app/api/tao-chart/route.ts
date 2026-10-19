import { NextRequest, NextResponse } from "next/server";
import { aggregateBars, chartIntervals, priceBars, taoPriceCandles } from "../../lib/chart-data";

export const revalidate = 60;

async function dailyTaoHistory() {
  const key = process.env.TAOSTATS_API_KEY;
  if (!key) throw new Error("Price provider unavailable");
  // Fixed windows share older history across visitors and all daily-based views.
  const start = Date.UTC(2021, 0, 1) / 1000;
  const end = Math.floor(Date.now() / 86400000) * 86400 + 86400;
  const span = 200 * 86400;
  const windows = Array.from({ length: Math.ceil((end - start) / span) }, (_, index) => ({
    from: start + index * span, to: Math.min(end, start + (index + 1) * span),
  }));
  const data = [];
  for (let index = 0; index < windows.length; index += 4) {
    const pages = await Promise.all(windows.slice(index, index + 4).map(async ({ from, to }) => {
      const url = new URL("https://api.taostats.io/v1/price/ohlc");
      for (const [name, value] of Object.entries({ asset: "TAO", period: "1d", timestamp_start: from, timestamp_end: to, limit: 200 })) url.searchParams.set(name, String(value));
      const response = await fetch(url, { headers: { Authorization: key }, next: { revalidate: to === end ? 60 : 86400 }, signal: AbortSignal.timeout(6000) });
      if (!response.ok) throw new Error("Price history unavailable");
      return taoPriceCandles(await response.json());
    }));
    data.push(...pages.flat());
  }
  if (!data.length) throw new Error("No price history");
  return data.sort((a, b) => Date.parse(a.time) - Date.parse(b.time));
}

type CoinbaseCandle = [number, number, number, number, number, number];
const granularities: Record<string, number> = { "1m": 60, "10m": 300, "1h": 3600, "1d": 86400, "1w": 86400, "1mo": 86400 };

export async function GET(request: NextRequest) {
  const interval = request.nextUrl.searchParams.get("interval") || "1h";
  const granularity = granularities[interval];
  if (!granularity) return NextResponse.json({ error: "Unsupported interval" }, { status: 400 });
  const long = interval === "1d" || interval === "1w" || interval === "1mo";
  if (long) {
    try {
      const data = await dailyTaoHistory();
      return NextResponse.json({ data, source: "TaoStats", interval, method: "taostats-price" }, { headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300" } });
    } catch {
      // Keep the exchange chart usable when longer price history is unavailable.
    }
  }
  try {
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
