import { NextRequest, NextResponse } from "next/server";
import { unstable_cache } from "next/cache";
import { resolveParentIdentity, type FamilyRow, type NamedValidator } from "../../../lib/validator-identity";

async function read(path: string, parameters: Record<string, string>) {
  const key = process.env.TAOSTATS_API_KEY;
  if (!key) throw new Error("Identity source unavailable");
  const url = new URL(path, "https://api.taostats.io");
  Object.entries(parameters).forEach(([name, value]) => url.searchParams.set(name, value));
  const response = await fetch(url, { headers: { Authorization: key }, next: { revalidate: 3600 }, signal: AbortSignal.timeout(6_000) });
  if (!response.ok) throw new Error("Identity source unavailable");
  const data = await response.json();
  if (!Array.isArray(data.data) || !data.pagination) throw new Error("Invalid identity response");
  return data;
}
const directory = unstable_cache(async (): Promise<NamedValidator[]> => {
  const rows: NamedValidator[] = [];
  for (let page = 1; page <= 12; page++) {
    const payload = await read("/v1/validators", { order_by: "rank", order_dir: "asc", limit: "200", page: String(page) });
    if (payload.pagination.current_page !== page) throw new Error("Invalid directory page");
    rows.push(...payload.data);
    if (payload.pagination.next_page === null) return rows;
    if (payload.pagination.next_page !== page + 1) throw new Error("Incomplete directory");
  }
  throw new Error("Incomplete directory");
}, ["validator-identity-names-v1"], { revalidate: 3600 });

export async function GET(request: NextRequest) {
  const hotkey = request.nextUrl.searchParams.get("hotkey") || "";
  const rawNetuid = request.nextUrl.searchParams.get("netuid");
  const netuid = rawNetuid === null ? null : Number(rawNetuid);
  if (!/^[1-9A-HJ-NP-Za-km-z]{46,50}$/.test(hotkey) || (netuid !== null && (!rawNetuid || !/^\d+$/.test(rawNetuid) || !Number.isInteger(netuid) || netuid < 0 || netuid > 1024))) return NextResponse.json({ error: "Invalid identity query" }, { status: 400 });
  try {
    const parameters: Record<string, string> = { hotkey, limit: "200", page: "1" };
    if (netuid !== null) parameters.netuid = String(netuid);
    const family = await read("/v1/validators/hotkey-family", parameters);
    if (family.pagination.next_page !== null) throw new Error("Family coverage incomplete");
    const rows = family.data as FamilyRow[];
    const hasParent = rows.some(row => row.hotkey === hotkey && Array.isArray(row.parents) && row.parents.some(parent => Number(parent.proportion) > 0));
    const result = resolveParentIdentity(hotkey, netuid, rows, hasParent ? await directory() : [], Date.now());
    return NextResponse.json(result, { headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=300" } });
  } catch {
    // Optional enrichment must never block or invent an identity.
    return NextResponse.json({ error: "Parent identity could not be verified" }, { status: 503, headers: { "Cache-Control": "no-store" } });
  }
}
