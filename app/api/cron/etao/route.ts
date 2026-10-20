import { refreshEtao } from "../../../lib/etao-source";
export const maxDuration = 60;
export async function GET(request: Request) {
  if (!process.env.CRON_SECRET || request.headers.get("authorization") !== `Bearer ${process.env.CRON_SECRET}`) return Response.json({ error: "Unauthorized" }, { status: 401 });
  try { return Response.json(await refreshEtao(), { headers: { "Cache-Control": "no-store" } }); }
  catch { console.error("eTAO snapshot refresh failed; preserving the last verified data"); return Response.json({ error: "Chain refresh failed; previous coverage retained" }, { status: 503 }); }
}
