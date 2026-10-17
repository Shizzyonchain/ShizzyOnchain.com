import { NextRequest, NextResponse } from "next/server";
import { loadCandidates } from "../../../lib/validator-candidates";
export async function GET(request: NextRequest) {
  const raw = request.nextUrl.searchParams.get("netuid");
  const netuid = Number(raw);
  if (!raw || !/^\d+$/.test(raw) || !Number.isInteger(netuid) || netuid < 1 || netuid > 1024) return NextResponse.json({ error: "Choose a valid alpha subnet." }, { status: 400 });
  try {
    return NextResponse.json(await loadCandidates(netuid), { headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=300" } });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Recommendations unavailable." }, { status: 503, headers: { "Cache-Control": "no-store" } });
  }
}
