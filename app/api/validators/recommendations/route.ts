import { after, NextRequest, NextResponse } from "next/server";
import { prepareSubnetRecommendations, readSubnetRecommendations } from "../../../lib/subnet-recommendation-preparation";
import { recommendationNeedsRefresh } from "../../../lib/recommendation-freshness";
export const maxDuration = 120;
export async function GET(request: NextRequest) {
  const raw = request.nextUrl.searchParams.get("netuid");
  const netuid = Number(raw);
  if (!raw || !/^\d+$/.test(raw) || !Number.isInteger(netuid) || netuid < 1 || netuid > 1024) return NextResponse.json({ error: "Choose a valid alpha subnet." }, { status: 400 });
  try {
    const snapshot = await readSubnetRecommendations(netuid);
    if (!snapshot) {
      after(async () => { try { await prepareSubnetRecommendations(netuid); } catch (error) { console.error("Subnet recommendation preparation failed", netuid, error instanceof Error ? error.message : "Unknown source failure"); } });
      return NextResponse.json({ preparing: true, message: "Preparing this subnet’s recommendations in the background." }, { status: 202, headers: { "Cache-Control": "no-store", "Retry-After": "5" } });
    }
    const refreshing = recommendationNeedsRefresh(snapshot, Date.now());
    if (refreshing) after(async () => { try { await prepareSubnetRecommendations(netuid); } catch (error) { console.error("Subnet recommendation refresh failed", netuid, error instanceof Error ? error.message : "Unknown source failure"); } });
    return NextResponse.json({ ...snapshot, refreshing }, { headers: { "Cache-Control": "public, s-maxage=15, stale-while-revalidate=15" } });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Recommendations unavailable." }, { status: 503, headers: { "Cache-Control": "no-store" } });
  }
}
