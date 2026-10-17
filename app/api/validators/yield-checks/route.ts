import { NextRequest } from "next/server";
import { queueYieldCheck, yieldBackend } from "../../../lib/validator-yield-source";

export const maxDuration = 30;
function subnet(request: NextRequest) {
  const raw = request.nextUrl.searchParams.get("netuid") || "";
  const netuid = Number(raw);
  return /^\d+$/.test(raw) && Number.isInteger(netuid) && netuid >= 1 && netuid <= 1024 ? netuid : null;
}
export async function GET(request: NextRequest) {
  const netuid = subnet(request);
  if (!netuid) return Response.json({ error: "Choose a valid subnet" }, { status: 400 });
  try {
    const response = await yieldBackend(`/v1/validators/yield-checks?netuid=${netuid}`);
    if (!response.ok) throw new Error("Unavailable");
    return Response.json(await response.json(), { headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=60" } });
  } catch {
    return Response.json({ netuid, state: "unavailable", rows: [], error: "Background chain checks are unavailable. Provider yields are not independently confirmed." }, { headers: { "Cache-Control": "no-store" } });
  }
}
export async function POST(request: NextRequest) {
  const netuid = subnet(request);
  if (!netuid) return Response.json({ error: "Choose a valid subnet" }, { status: 400 });
  try {
    return Response.json(await queueYieldCheck(netuid), { status: 202, headers: { "Cache-Control": "no-store" } });
  } catch {
    return Response.json({ error: "Background check unavailable. Existing yield figures remain usable as provider-reported data." }, { status: 503 });
  }
}
