import { getRootSnapshot } from "../../../lib/root-basket-source";
import { getRootOperation } from "../../../lib/root-operation-source";
import { rootEligibility } from "../../../lib/root-ranking";
import { prepareRootHistory } from "../../../lib/root-preparation-source";
export const maxDuration = 300;
export async function GET(request: Request) {
  if (!process.env.CRON_SECRET || request.headers.get("authorization") !== `Bearer ${process.env.CRON_SECRET}`) return Response.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const [snapshot, operation] = await Promise.all([getRootSnapshot(), getRootOperation()]);
    const now = Date.now();
    const seats = new Set(operation.filter(row => row.active && row.validator_permit && now - Date.parse(row.timestamp) <= 7200000 && Date.parse(row.timestamp) <= now + 60000).map(row => row.hotkey));
    const keys = snapshot.data.filter(row => seats.has(row.hotkey) && !rootEligibility(row).length).map(row => row.hotkey);
    if (!keys.length) throw new Error("No fresh root permit universe");
    return Response.json(await prepareRootHistory(keys, now), { headers: { "Cache-Control": "no-store" } });
  } catch (error) { console.error("Root background preparation failed:", error instanceof Error ? error.message : "Unknown preparation error"); return Response.json({ error: "Root preparation failed; the last complete result was preserved." }, { status: 503, headers: { "Cache-Control": "no-store" } }); }
}
