import { NextRequest, NextResponse } from "next/server";
import { getStandaloneValidators } from "../../../../lib/standalone-validators";
import { getRootHistory } from "../../../../lib/root-history-source";

export async function GET(request: NextRequest) {
  const hotkey = request.nextUrl.searchParams.get("hotkey") || "";
  if (!/^[1-9A-HJ-NP-Za-km-z]{46,50}$/.test(hotkey)) return NextResponse.json({ error: "Invalid validator hotkey." }, { status: 400 });
  try {
    if (!(await getStandaloneValidators()).rows.some(row => row.hotkey === hotkey)) return NextResponse.json({ error: "History comparison is limited to listed parent/standalone validators." }, { status: 404 });
    const day = Math.floor(Date.now() / 86400_000) * 86400;
    return NextResponse.json(await getRootHistory(hotkey, day), { headers: { "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=600" } });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "History unavailable." }, { status: 503, headers: { "Cache-Control": "no-store" } });
  }
}
