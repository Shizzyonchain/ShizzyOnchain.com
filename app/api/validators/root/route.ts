import { NextResponse } from "next/server";
import { getRootSnapshot } from "../../../lib/root-basket-source";

export async function GET() {
  try {
    const snapshot = await getRootSnapshot();
    if (snapshot.data.some(row => !Number.isFinite(Date.parse(row.timestamp)) || Date.parse(row.timestamp) > Date.now() + 60000)) throw new Error("Future-dated or invalid root basket source. Please retry after the provider corrects the snapshot.");
    return NextResponse.json(snapshot, { headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600" } });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Root baskets unavailable." }, { status: 503, headers: { "Cache-Control": "no-store" } });
  }
}
