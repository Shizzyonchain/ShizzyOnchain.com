import { NextResponse } from "next/server";
import { unstable_cache } from "next/cache";
import { getRootSnapshot } from "../../../../lib/root-basket-source";
import { getRootHistory } from "../../../../lib/root-history-source";
import { rootHistoryMetrics, type RootMatch } from "../../../../lib/root-ranking";
import { basketContext } from "../../../../lib/root-baskets";
export const maxDuration = 60;

const load = unstable_cache(async (day: number) => {
  const snapshot = await getRootSnapshot();
  // A fixed NAV-based research universe bounds provider credits without preselecting high yields.
  const universe = snapshot.data.filter(row => Number(row.root_stake) > 0 && row.name && row.take !== null && Number(row.nav_tao) >= 10_000_000).sort((a, b) => Number(b.nav_tao) - Number(a.nav_tao)).slice(0, 8);
  const matches: RootMatch[] = [], excluded: { name: string; reason: string }[] = [];
  // Two requests at a time; all visitors share the cached result and existing history cache.
  for (let i = 0; i < universe.length; i += 2) {
    const results = await Promise.allSettled(universe.slice(i, i + 2).map(async row => {
      const metrics = rootHistoryMetrics((await getRootHistory(row.hotkey, day)).data, day);
      const context = basketContext(row);
      const nav = Number(row.nav_tao);
      return { hotkey: row.hotkey, name: row.name!, take: row.take!, ...metrics, concentration: row.holdings.reduce((sum, holding) => sum + (Number(holding.realizable_tao) / nav) ** 2, 0), quoteGap: context.quoteGap!, topFive: context.topFiveShare!, snapshot: row.timestamp, identityTimestamp: row.identityTimestamp || "" };
    }));
    results.forEach((result, index) => {
      if (result.status === "fulfilled") matches.push(result.value);
      else {
        const reason = result.reason instanceof Error ? result.reason.message : "Required history unavailable";
        if (!reason.startsWith("Requires ")) throw new Error("Required history source failed. No partial ranking generated.");
        excluded.push({ name: universe[i + index].name!, reason });
      }
    });
  }
  return { matches, excluded, reviewed: universe.map(row => row.name), totalBaskets: snapshot.data.length, collectedAt: new Date().toISOString() };
}, ["root-provisional-matches-v1"], { revalidate: 3600 });
export async function GET() {
  try { return NextResponse.json(await load(Math.floor(Date.now() / 86400_000) * 86400), { headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=300" } }); }
  catch { return NextResponse.json({ error: "Root recommendation sources are unavailable. The basket directory remains available." }, { status: 503, headers: { "Cache-Control": "no-store" } }); }
}
