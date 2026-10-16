import { NextResponse } from "next/server";
import { getRootSnapshot } from "../../../lib/root-basket-source";

export async function GET() {
  try {
    return NextResponse.json(await getRootSnapshot(), { headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600" } });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Root baskets unavailable." }, { status: 503, headers: { "Cache-Control": "no-store" } });
  }
}
