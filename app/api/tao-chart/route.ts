import { NextRequest, NextResponse } from "next/server";

export const revalidate = 60;

type CoinbaseCandle = [number, number, number, number, number, number];
const granularities: Record<string, number> = { "1m": 60, "10m": 300, "1h": 3600, "1d": 86400 };

export async function GET(request: NextRequest) {
  const interval = request.nextUrl.searchParams.get("interval") || "1h";
  const granularity = granularities[interval];
  if (!granularity) return NextResponse.json({ error: "Unsupported interval" }, { status: 400 });
  try {
    const response = await fetch(`https://api.exchange.coinbase.com/products/TAO-USD/candles?granularity=${granularity}`, {
      headers: { "User-Agent": "ShizzyUnchained/1.0" },
      next: { revalidate: 60 },
      signal: AbortSignal.timeout(6_000),
    });
    if (!response.ok) throw new Error();
    const raw = await response.json() as CoinbaseCandle[];
    if (!Array.isArray(raw)) throw new Error("Invalid Coinbase candle response");
    const normalized = raw.filter(c => Array.isArray(c) && c.length >= 6).sort((a, b) => a[0] - b[0]).map(c => ({
      time: new Date(c[0] * 1000).toISOString(), low: String(c[1]), high: String(c[2]),
      open: String(c[3]), close: String(c[4]), volume_tao: String(c[5]),
    }));
    if (interval !== "10m") return NextResponse.json({ data: normalized, source: "coinbase" });
    const data = [];
    for (let i = 0; i < normalized.length; i += 2) {
      const pair = normalized.slice(i, i + 2);
      if (pair.length < 2) continue;
      data.push({
        time: pair[0].time, open: pair[0].open, close: pair.at(-1)!.close,
        high: String(Math.max(...pair.map(c => Number(c.high)))),
        low: String(Math.min(...pair.map(c => Number(c.low)))),
        volume_tao: String(pair.reduce((sum, c) => sum + Number(c.volume_tao), 0)),
      });
    }
    return NextResponse.json({ data, source: "coinbase" });
  } catch {
    return NextResponse.json({ error: "TAO chart unavailable" }, { status: 503 });
  }
}
