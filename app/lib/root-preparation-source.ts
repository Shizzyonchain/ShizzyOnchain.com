import "server-only";
import { getCache } from "@vercel/functions";
import { getRootRecommendationHistory } from "./root-history-source";
import { rootHistoryMetrics } from "./root-ranking";
import { selectPreparedHistory, type PreparedHistory } from "./root-prepared-history";
const cache = () => getCache({ namespace: "shizzy-root-history-v1" });
export async function readPreparedHistory(hotkeys: string[], now: number) {
  const day = Math.floor(now / 86400_000) * 86400;
  const [current, previous] = await Promise.all([cache().get(`complete:${day}`), cache().get(`complete:${day - 86400}`)]);
  return selectPreparedHistory(current as PreparedHistory | null, previous as PreparedHistory | null, hotkeys, now);
}
export async function prepareRootHistory(hotkeys: string[], now: number) {
  const day = Math.floor(now / 86400_000) * 86400;
  const scan: PreparedHistory = { day, metrics: {}, exclusions: {}, preparedAt: "" };
  let fetched = 0;
  for (const hotkey of [...new Set(hotkeys)].sort()) {
    const entryKey = `metric:${day}:${hotkey}`;
    let entry = await cache().get(entryKey) as { metric?: ReturnType<typeof rootHistoryMetrics>; exclusion?: string } | null;
    if (!entry) {
      // Bounded preparation with resumable per-hotkey checkpoints, never on a visitor request.
      if (fetched >= 32 || Date.now() - now > 230000) return { complete: false, checked: Object.keys(scan.metrics).length + Object.keys(scan.exclusions).length, fetched };
      const started = Date.now();
      const history = await getRootRecommendationHistory(hotkey, day, Math.floor(now / 900000));
      try { entry = { metric: rootHistoryMetrics(history.data, day) }; }
      catch (error) {
        const reason = error instanceof Error ? error.message : "History unavailable";
        if (!reason.startsWith("Requires ")) throw error;
        entry = { exclusion: reason };
      }
      // Retry incomplete provider histories later instead of excluding a late daily close for 24h.
      await cache().set(entryKey, entry, { ttl: entry.exclusion && history.data.at(-1)?.day !== new Date((day - 86400) * 1000).toISOString().slice(0, 10) ? 600 : 172800 });
      if (history.lookedUpAt >= started) { fetched++; await new Promise(resolve => setTimeout(resolve, Math.max(0, 6000 - (Date.now() - started)))); }
    }
    if (entry.metric) scan.metrics[hotkey] = entry.metric;
    else if (entry.exclusion) scan.exclusions[hotkey] = entry.exclusion;
    else throw new Error("Invalid prepared history checkpoint");
  }
  scan.preparedAt = new Date().toISOString();
  // Only a complete scan replaces the published manifest; provider failures leave it intact.
  await cache().set(`complete:${day}`, scan, { ttl: 172800 });
  return { complete: true, checked: hotkeys.length, fetched, preparedAt: scan.preparedAt };
}
