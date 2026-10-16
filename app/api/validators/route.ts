import { NextRequest, NextResponse } from "next/server";

const orders = new Set(["rank", "root_rank", "alpha_rank", "active_subnets", "global_nominators", "take", "global_weighted_stake", "global_alpha_stake_as_tao", "weighted_root_stake", "root_stake", "dominance"]);
const hotkeyPattern = /^[1-9A-HJ-NP-Za-km-z]{46,50}$/;

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams;
  const kind = query.get("kind") || "directory";
  const hotkey = query.get("hotkey");
  const page = Number(query.get("page") || 1);
  const order = query.get("order") || "rank";
  if (!["directory", "yield", "history"].includes(kind) || !Number.isInteger(page) || page < 1 || page > 50 || !orders.has(order) || (hotkey && !hotkeyPattern.test(hotkey)) || (kind !== "directory" && !hotkey)) {
    return NextResponse.json({ error: "Invalid validator query." }, { status: 400 });
  }
  const key = process.env.TAOSTATS_API_KEY;
  if (!key) return NextResponse.json({ error: "Validator data is not configured for this environment." }, { status: 503 });
  const path = kind === "yield" ? "/v1/validators/yield" : kind === "history" ? `/v1/validators/${hotkey}/history` : "/v1/validators";
  const target = new URL(path, "https://api.taostats.io");
  target.searchParams.set("page", String(page));
  target.searchParams.set("limit", kind === "directory" ? "200" : "100");
  if (hotkey && kind !== "history") target.searchParams.set("hotkey", hotkey);
  target.searchParams.set("order_by", kind === "history" ? "timestamp" : kind === "yield" ? "netuid" : order);
  target.searchParams.set("order_dir", kind === "history" ? "desc" : kind === "directory" && !order.endsWith("rank") && order !== "take" ? "desc" : "asc");
  try {
    // Shared data cache: requests with identical filters do not spend credits per visitor.
    const response = await fetch(target, { headers: { Authorization: key }, next: { revalidate: 3600 }, signal: AbortSignal.timeout(8_000) });
    if (!response.ok) return NextResponse.json({ error: response.status === 429 ? "Validator provider is rate limited. Please try again later." : "Validator provider is temporarily unavailable." }, { status: 503, headers: { "Cache-Control": "no-store" } });
    const payload = await response.json();
    if (!Array.isArray(payload.data) || !payload.pagination) throw new Error("Invalid provider response");
    return NextResponse.json({ data: payload.data, pagination: payload.pagination, source: "TaoStats", fetchedAt: new Date().toISOString() }, { headers: { "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400" } });
  } catch {
    return NextResponse.json({ error: "Validator data could not be loaded. Please try again." }, { status: 503, headers: { "Cache-Control": "no-store" } });
  }
}
