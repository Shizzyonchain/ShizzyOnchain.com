import { NextResponse } from "next/server";
import { readPreparedHistory } from "../../../../lib/root-preparation-source";
import { getRootOperation } from "../../../../lib/root-operation-source";
import { getRootSnapshot } from "../../../../lib/root-basket-source";
import { rootEligibility, type RootMatch } from "../../../../lib/root-ranking";
import { basketContext } from "../../../../lib/root-baskets";
import { shortAddress } from "../../../../lib/validator-types";
export const maxDuration = 30;
export async function GET() {
  try {
    const [snapshot, operation] = await Promise.all([getRootSnapshot(), getRootOperation()]);
    const seats = new Map(operation.map(row => [row.hotkey, row]));
    function operatingReasons(hotkey: string) {
      const seat = seats.get(hotkey), age = Date.now() - Date.parse(seat?.timestamp || "");
      return !seat || !seat.active || !seat.validator_permit ? ["Current active root permit not confirmed"] : !Number.isFinite(age) || age > 7200000 || age < -60000 ? ["Root permit snapshot stale or invalid"] : [];
    }
    const universe = snapshot.data;
    const eligible = universe.filter(row => !rootEligibility(row).length && !operatingReasons(row.hotkey).length);
    const prepared = await readPreparedHistory(eligible.map(row => row.hotkey), Date.now());
    if (!prepared) return NextResponse.json({ error: "Recommendations are being refreshed in the background. The basket directory and comparison tools are ready to use.", preparing: true }, { status: 202, headers: { "Cache-Control": "no-store", "Retry-After": "60" } });
    const { scan, rollover } = prepared;
    const matches: RootMatch[] = [], excluded: { hotkey: string; name: string; reason: string }[] = [];
    for (const row of universe) {
      const name = row.name || shortAddress(row.hotkey);
      const reasons = [...rootEligibility(row), ...operatingReasons(row.hotkey)];
      const metric = scan.metrics[row.hotkey];
      if (reasons.length || !metric) { excluded.push({ hotkey: row.hotkey, name, reason: reasons.join(" · ") || scan.exclusions[row.hotkey] || "History unavailable" }); continue; }
      const context = basketContext(row), nav = Number(row.nav_tao);
      matches.push({ historyRollover: rollover, operatingTimestamp: seats.get(row.hotkey)!.timestamp, hotkey: row.hotkey, name, take: row.take!, ...metric, concentration: row.holdings.reduce((sum, holding) => sum + (Number(holding.realizable_tao) / nav) ** 2, 0), quoteGap: context.quoteGap!, topFive: context.topFiveShare!, snapshot: row.timestamp, identityTimestamp: row.identityTimestamp || "" });
    }
    return NextResponse.json({ matches, excluded, reviewed: universe.map(row => row.name || shortAddress(row.hotkey)), totalBaskets: universe.length, historyCandidates: eligible.length, hiddenChildren: snapshot.hiddenChildren, historyRollover: rollover, historyEnd: new Date((scan.day - 86400) * 1000).toISOString().slice(0, 10), preparedAt: scan.preparedAt, collectedAt: new Date().toISOString() }, { headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=300" } });
  } catch {
    return NextResponse.json({ error: "Prepared root recommendations are temporarily unavailable. The background job will retry; the basket directory remains available." }, { status: 503, headers: { "Cache-Control": "no-store" } });
  }
}
