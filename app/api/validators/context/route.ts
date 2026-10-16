import { NextRequest, NextResponse } from "next/server";
import { getStandaloneValidators } from "../../../lib/standalone-validators";

export async function GET(request: NextRequest) {
  const hotkey = request.nextUrl.searchParams.get("hotkey") || "";
  const kind = request.nextUrl.searchParams.get("kind") || "operation";
  if (!/^[1-9A-HJ-NP-Za-km-z]{46,50}$/.test(hotkey) || !["operation", "operator"].includes(kind)) return NextResponse.json({ error: "Invalid profile context request." }, { status: 400 });
  const key = process.env.TAOSTATS_API_KEY;
  if (!key) return NextResponse.json({ error: "Source unavailable." }, { status: 503 });
  try {
    const validator = (await getStandaloneValidators()).rows.find(row => row.hotkey === hotkey);
    if (!validator) return NextResponse.json({ error: "Parent/standalone validator not found." }, { status: 404 });
    const url = new URL(kind === "operator" ? `/v1/accounts/${validator.coldkey}/identity` : "/v1/subnets/metagraph", "https://api.taostats.io");
    if (kind === "operation") { url.searchParams.set("hotkey", hotkey); url.searchParams.set("limit", "256"); }
    const response = await fetch(url, { headers: { Authorization: key }, next: { revalidate: 1800 }, signal: AbortSignal.timeout(8_000) });
    if (kind === "operator" && response.status === 404) return NextResponse.json({ data: [], checkedAt: new Date().toISOString(), source: "TaoStats on-chain coldkey identity" }, { headers: { "Cache-Control": "public, s-maxage=1800" } });
    if (!response.ok) throw new Error("Required source temporarily unavailable.");
    const payload = await response.json();
    if (!Array.isArray(payload.data) || (kind === "operation" && payload.pagination?.next_page !== null)) throw new Error("Incomplete context source.");
    if (kind === "operation" && payload.data.some((row: { hotkey: string }) => row.hotkey !== hotkey)) throw new Error("Context hotkey mismatch.");
    if (kind === "operator" && payload.data.some((row: { address: string }) => row.address !== validator.coldkey)) throw new Error("Operator identity mismatch.");
    return NextResponse.json({ data: payload.data, checkedAt: new Date().toISOString(), source: kind === "operator" ? "TaoStats on-chain coldkey identity" : "TaoStats metagraph" }, { headers: { "Cache-Control": "public, s-maxage=1800, stale-while-revalidate=300" } });
  } catch (error) { return NextResponse.json({ error: error instanceof Error ? error.message : "Context unavailable." }, { status: 503, headers: { "Cache-Control": "no-store" } }); }
}
