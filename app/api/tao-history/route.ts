import { NextResponse } from "next/server";
import { getTaoHistory } from "../../lib/tao-history";

export const dynamic = "force-dynamic";
export async function GET() {
  const data = await getTaoHistory();
  if (!data.length) return NextResponse.json({ error: "TAO dollar history unavailable" }, { status: 503 });
  return NextResponse.json({ data, source: "coinbase", resolution: "1m" }, {
    headers: { "Cache-Control": "public, s-maxage=10" },
  });
}
