import { prepareSubnetBatch } from "../../../lib/subnet-recommendation-preparation";

export const maxDuration = 300;
export async function GET(request: Request) {
  if (!process.env.CRON_SECRET || request.headers.get("authorization") !== `Bearer ${process.env.CRON_SECRET}`) return Response.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const result = await prepareSubnetBatch();
    console.info("Subnet preparation batch", JSON.stringify({ prepared: result.prepared.length, failed: result.failed.length, inProgress: result.inProgress.length, remaining: result.remaining, total: result.total }));
    return Response.json(result, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return Response.json({ error: "Subnet preparation unavailable; previous snapshots retained." }, { status: 503 });
  }
}
