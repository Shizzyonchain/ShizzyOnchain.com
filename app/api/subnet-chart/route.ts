import { NextRequest, NextResponse } from "next/server";
import { aggregateBars, priceBars } from "../../lib/chart-data";
import { udfCandles } from "../../lib/taostats-candles";

const intervals: Record<string, { resolution: string; seconds: number; count: number }> = {
  "10m": { resolution: "5", seconds: 300, count: 360 },
  "1h": { resolution: "60", seconds: 3600, count: 180 },
  "1d": { resolution: "1D", seconds: 86400, count: 180 },
};
export async function GET(request: NextRequest) {
  const interval = request.nextUrl.searchParams.get("interval") || "1h";
  const subnet = request.nextUrl.searchParams.get("netuid") || "";
  const netuid = Number(subnet);
  const config = intervals[interval];
  if (!/^\d{1,3}$/.test(subnet) || !Number.isInteger(netuid) || netuid < 1 || netuid > 128 || !config) return NextResponse.json({ error: "Unsupported chart query" }, { status: 400 });
  const key = process.env.TAOSTATS_API_KEY;
  if (!key) return NextResponse.json({ error: "Chart provider unavailable" }, { status: 503 });
  try {
    // Stable minute buckets share the provider response across visitors.
    const to = Math.floor(Date.now() / 60_000) * 60;
    const url = new URL("/v1/tradingview/udf/history", "https://api.taostats.io");
    for (const [name, value] of Object.entries({ symbol: `SUB-${netuid}`, resolution: config.resolution, to, from: to - config.seconds * config.count, countback: config.count })) url.searchParams.set(name, String(value));
    const response = await fetch(url, { headers: { Authorization: key }, next: { revalidate: 60 }, signal: AbortSignal.timeout(7000) });
    if (!response.ok) throw new Error("Provider unavailable");
    const candles = udfCandles(await response.json());
    const bars = priceBars(candles);
    const data = (interval === "10m" ? aggregateBars(bars, 600) : bars).slice(-180).map(bar => [new Date(bar.time * 1000).toISOString(), String(bar.open), String(bar.high), String(bar.low), String(bar.close), String(bar.volume)]);
    if (!data.length) throw new Error("No usable candles");
    return NextResponse.json({ data, method: "taostats-alpha", source: "TaoStats", volumeUnit: "alpha", interval }, { headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120" } });
  } catch {
    return NextResponse.json({ error: "TaoStats chart history unavailable; use node fallback." }, { status: 503 });
  }
}
