import { queueYieldCheck, yieldBackend } from "../../../lib/validator-yield-source";

export const maxDuration = 120;
export async function GET(request: Request) {
  if (!process.env.CRON_SECRET || request.headers.get("authorization") !== `Bearer ${process.env.CRON_SECRET}`) return Response.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const response = await yieldBackend("/v1/validators/yield-watch");
    if (!response.ok) throw new Error("Watch list unavailable");
    const payload = await response.json();
    if (!Array.isArray(payload.netuids) || payload.netuids.length > 2 || payload.netuids.some((n: unknown) => !Number.isInteger(n) || Number(n) < 1 || Number(n) > 1024)) throw new Error("Invalid watch list");
    for (const netuid of payload.netuids) await queueYieldCheck(netuid, false);
    return Response.json({ refreshed: payload.netuids }, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return Response.json({ error: "Yield preparation unavailable; previous checks retained." }, { status: 503 });
  }
}
