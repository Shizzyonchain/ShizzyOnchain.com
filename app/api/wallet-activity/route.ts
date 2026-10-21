import { NextRequest } from "next/server";
import { validWalletAddress, activityRows } from "../../lib/wallet-activity";
export async function GET(request: NextRequest) {
  const address = request.nextUrl.searchParams.get("address") || "";
  const kind = request.nextUrl.searchParams.get("kind") || "transactions";
  const page = Number(request.nextUrl.searchParams.get("page") || 1);
  if (!validWalletAddress(address) || !["transactions", "transfers"].includes(kind) || !Number.isInteger(page) || page < 1 || page > 1000) return Response.json({ error: "Invalid wallet activity request" }, { status: 400 });
  const key = process.env.TAOSTATS_API_KEY;
  if (!key) return Response.json({ error: "Wallet history is temporarily unavailable" }, { status: 503 });
  const url = new URL(kind === "transfers" ? "/v1/transfers" : "/v1/extrinsics", "https://api.taostats.io");
  Object.entries({ network: "finney", [kind === "transfers" ? "address" : "signer_address"]: address, limit: "20", page: String(page), order_by: "timestamp", order_dir: "desc" }).forEach(([name, value]) => url.searchParams.set(name, value));
  if (kind === "transactions") url.searchParams.set("fields", "id,timestamp,pallet,name,success,signer_address");
  try {
    const response = await fetch(url, { headers: { Authorization: key }, next: { revalidate: 300 }, signal: AbortSignal.timeout(8000) });
    if (!response.ok) throw new Error(`Provider status ${response.status}`);
    const payload = await response.json();
    if (payload.pagination?.current_page !== page) throw new Error("Invalid history pagination");
    const rows = activityRows(payload.data, kind as "transactions" | "transfers", address);
    const next = payload.pagination.next_page;
    return Response.json({ rows, nextPage: Number.isInteger(next) && next > page && next <= 1000 ? next : null, fetchedAt: new Date().toISOString(), source: "TaoStats indexed Finney data" }, { headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=300" } });
  } catch (error) { console.warn("Wallet activity unavailable", { kind, reason: error instanceof Error ? error.message : "Unknown provider failure" }); return Response.json({ error: "Recent activity could not be loaded. Please try again." }, { status: 503, headers: { "Cache-Control": "no-store" } }); }
}
