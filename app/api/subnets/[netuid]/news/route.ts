import { unstable_cache } from "next/cache";
import { getSubnetNewsBriefs } from "../../../../lib/subnet-news";
import { subnetTimeline } from "../../../../lib/subnet-timeline";

const history = unstable_cache(async (netuid: number) => {
  const briefs = getSubnetNewsBriefs();
  return { netuid, archiveThrough: briefs[0]?.date || null, entries: subnetTimeline(briefs, netuid) };
}, ["subnet-news-timeline-v3-source-availability"], { revalidate: 300 });

export async function GET(request: Request, { params }: { params: Promise<{ netuid: string }> }) {
  const { netuid: raw } = await params;
  const netuid = Number(raw), offset = Number(new URL(request.url).searchParams.get("offset") || 0);
  if (!/^\d+$/.test(raw) || netuid < 1 || netuid > 1024 || !Number.isInteger(offset) || offset < 0 || offset > 10000) return Response.json({ error: "Choose a valid subnet and history page." }, { status: 400 });
  try {
    const result = await history(netuid);
    return Response.json({ ...result, entries: result.entries.slice(offset, offset + 10), total: result.entries.length, nextOffset: offset + 10 < result.entries.length ? offset + 10 : null }, { headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=60" } });
  } catch {
    return Response.json({ error: "Subnet news is temporarily unavailable." }, { status: 503, headers: { "Cache-Control": "no-store" } });
  }
}
