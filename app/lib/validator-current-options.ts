import type { RankedCandidate } from "./validator-ranking";

// A separate, explicitly limited comparison. Never weaken the full ranking.
export function limitedHistoryOptions(rows: RankedCandidate[]) {
  return rows.filter(row => row.excluded.length === 1
    && row.excluded[0] === "At least 90% reported participation in both windows required"
    && row.participation7 !== null && row.participation7 >= .9 && row.participation7 <= 1
    && row.participation30 !== null && row.participation30 > 0 && row.participation30 < .9)
    .sort((a, b) => Math.min(b.yield7!, b.yield30!) - Math.min(a.yield7!, a.yield30!)
      || a.take! - b.take! || a.hotkey.localeCompare(b.hotkey));
}
