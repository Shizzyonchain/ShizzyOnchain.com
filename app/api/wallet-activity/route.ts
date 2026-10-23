import { requestGuard, responseCoalescer } from "../../lib/request-protection";
import { NextRequest } from "next/server";
import { validWalletAddress, activityRows, swapRows } from "../../lib/wallet-activity";
const coalesce = responseCoalescer();
async function loadActivity(request: NextRequest) {
  const address = request.nextUrl.searchParams.get("address") || "";
  const kind = request.nextUrl.searchParams.get("kind") || "transactions";
  const page = Number(request.nextUrl.searchParams.get("page") || 1);
  if (!validWalletAddress(address) || !["transactions", "transfers", "swaps", "trades"].includes(kind) || !Number.isInteger(page) || page < 1 || page > 1000) return Response.json({ error: "Invalid wallet activity request" }, { status: 400 });
  const key = process.env.TAOSTATS_API_KEY;
  if (!key) return Response.json({ error: "Wallet history is temporarily unavailable" }, { status: 503 });
  const trading = kind === "swaps" || kind === "trades";
  const url = new URL(trading ? `/v1/subnets/${kind}` : kind === "transfers" ? "/v1/transfers" : "/v1/extrinsics", "https://api.taostats.io");
  Object.entries({ [trading ? "coldkey" : kind === "transfers" ? "address" : "signer_address"]: address, limit: "20", page: String(page), order_by: "timestamp", order_dir: "desc" }).forEach(([name, value]) => url.searchParams.set(name, value));
  if (trading) url.searchParams.set("tao_value_min", "5000000000");
  else url.searchParams.set("network", "finney");
  if (kind === "transactions") url.searchParams.set("fields", "id,timestamp,pallet,name,success,signer_address");
  try {
    const response = await fetch(url, { headers: { Authorization: key }, next: { revalidate: 300 }, signal: AbortSignal.timeout(8000) });
    if (response.status === 429) {
      console.warn(JSON.stringify({ message: "wallet activity provider quota reached", status: 429 }));
      return Response.json({ error: "Activity provider is busy. Please wait a minute and try again." }, { status: 429, headers: { "Retry-After": "60", "Cache-Control": "no-store" } });
    }
    if (!response.ok) throw new Error(`Provider status ${response.status}`);
    const payload = await response.json();
    if (payload.pagination?.current_page !== page) throw new Error("Invalid history pagination");
    const rows = trading ? swapRows(payload.data, kind as "swaps" | "trades", address) : activityRows(payload.data, kind as "transactions" | "transfers", address);
    const next = payload.pagination.next_page;
    return Response.json({ rows, nextPage: Number.isInteger(next) && next > page && next <= 1000 ? next : null, fetchedAt: new Date().toISOString(), source: "TaoStats indexed Finney data" }, { headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=300" } });
  } catch (error) { console.warn("Wallet activity unavailable", { kind, reason: error instanceof Error ? error.message : "Unknown provider failure" }); return Response.json({ error: "Recent activity could not be loaded. Please try again." }, { status: 503, headers: { "Cache-Control": "no-store" } }); }
}

export async function GET(request: NextRequest) {
  const blocked = requestGuard(request, "activity");
  if (blocked) return blocked;
  const address = request.nextUrl.searchParams.get("address") || "";
  const kind = request.nextUrl.searchParams.get("kind") || "transactions";
  const page = Number(request.nextUrl.searchParams.get("page") || 1);
  if (!validWalletAddress(address) || !["transactions", "transfers", "swaps", "trades"].includes(kind) || !Number.isInteger(page) || page < 1 || page > 1000) return Response.json({ error: "Invalid wallet activity request" }, { status: 400 });
  return coalesce(`${address}:${kind}:${page}`, () => loadActivity(request), 300_000);
}
