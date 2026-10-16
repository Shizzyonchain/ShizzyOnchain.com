import { NextResponse } from "next/server";
import { unstable_cache } from "next/cache";
import { getRootSnapshot } from "../../../../lib/root-basket-source";
import { getRootRecommendationHistory } from "../../../../lib/root-history-source";
import { rootEligibility, rootHistoryMetrics, type RootMatch } from "../../../../lib/root-ranking";
import { basketContext } from "../../../../lib/root-baskets";
import { shortAddress } from "../../../../lib/validator-types";
export const maxDuration = 300;
const historyScan = unstable_cache(async (day: number, hotkeys: string[]) => {
  const metrics: Record<string, ReturnType<typeof rootHistoryMetrics>> = {};
  const exclusions: Record<string, string> = {};
  for (const hotkey of hotkeys) {
    const started = Date.now();
    const history = await getRootRecommendationHistory(hotkey, day);
    try { metrics[hotkey] = rootHistoryMetrics(history, day); }
    catch (error) {
      const reason = error instanceof Error ? error.message : "History unavailable";
      if (!reason.startsWith("Requires ")) throw error;
      exclusions[hotkey] = reason;
    }
    // Pace first-time preparation to 15 history calls/minute. Per-hotkey results survive retries.
    if (hotkey !== hotkeys.at(-1)) await new Promise(resolve => setTimeout(resolve, Math.max(0, 4000 - (Date.now() - started))));
  }
  return { metrics, exclusions, preparedAt: new Date().toISOString() };
}, ["all-root-history-scan-daily-v1"], { revalidate: 86400 });
export async function GET() {
  try {
    const snapshot = await getRootSnapshot();
    const universe = snapshot.data;
    const eligible = universe.filter(row => !rootEligibility(row).length);
    const day = Math.floor(Date.now() / 86400_000) * 86400;
    const scan = await historyScan(day, eligible.map(row => row.hotkey).sort());
    const matches: RootMatch[] = [], excluded: { hotkey: string; name: string; reason: string }[] = [];
    for (const row of universe) {
      const name = row.name || shortAddress(row.hotkey);
      const reasons = rootEligibility(row);
      const metric = scan.metrics[row.hotkey];
      if (reasons.length || !metric) { excluded.push({ hotkey: row.hotkey, name, reason: reasons.join(" · ") || scan.exclusions[row.hotkey] || "History unavailable" }); continue; }
      const context = basketContext(row), nav = Number(row.nav_tao);
      matches.push({ hotkey: row.hotkey, name, take: row.take!, ...metric, concentration: row.holdings.reduce((sum, holding) => sum + (Number(holding.realizable_tao) / nav) ** 2, 0), quoteGap: context.quoteGap!, topFive: context.topFiveShare!, snapshot: row.timestamp, identityTimestamp: row.identityTimestamp || "" });
    }
    return NextResponse.json({ matches, excluded, reviewed: universe.map(row => row.name || shortAddress(row.hotkey)), totalBaskets: universe.length, historyCandidates: eligible.length, hiddenChildren: snapshot.hiddenChildren, preparedAt: scan.preparedAt, collectedAt: new Date().toISOString() }, { headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=300" } });
  } catch {
    return NextResponse.json({ error: "Complete root history preparation is unavailable or needs a retry. No partial winner was selected. The basket directory remains available; completed histories are cached for the next attempt." }, { status: 503, headers: { "Cache-Control": "no-store" } });
  }
}
