import { NextResponse } from "next/server";
import { getInitialMarkets } from "../../lib/market-data";

export async function GET() {
  const rows = await getInitialMarkets();
  const times = rows.map(row => Date.parse(row.time || "")).filter(Number.isFinite);
  if (!times.length) return NextResponse.json({ error: "Market status unavailable" }, { status: 503 });
  return NextResponse.json({ updatedAt: new Date(Math.max(...times)).toISOString() }, {
    headers: { "Cache-Control": "public, s-maxage=5, stale-while-revalidate=15" },
  });
}
