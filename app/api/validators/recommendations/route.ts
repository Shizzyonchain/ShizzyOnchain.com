import { after, NextRequest, NextResponse } from "next/server";
import { prepareSubnetRecommendations, readSubnetRecommendations } from "../../../lib/subnet-recommendation-preparation";
export const maxDuration = 120;
export async function GET(request: NextRequest) {
  const raw = request.nextUrl.searchParams.get("netuid");
  const netuid = Number(raw);
  if (!raw || !/^\d+$/.test(raw) || !Number.isInteger(netuid) || netuid < 1 || netuid > 1024) return NextResponse.json({ error: "Choose a valid alpha subnet." }, { status: 400 });
  try {
    const snapshot = await readSubnetRecommendations(netuid);
    if (!snapshot) {
      after(async () => { try { await prepareSubnetRecommendations(netuid); } catch { console.error("Subnet recommendation preparation failed", netuid); } });
      return NextResponse.json({ preparing: true, message: "Preparing this subnet’s recommendations in the background." }, { status: 202, headers: { "Cache-Control": "no-store", "Retry-After": "5" } });
    }
    return NextResponse.json(snapshot, { headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=60" } });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Recommendations unavailable." }, { status: 503, headers: { "Cache-Control": "no-store" } });
  }
}
