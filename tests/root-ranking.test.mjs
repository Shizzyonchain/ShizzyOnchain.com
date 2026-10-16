import test from "node:test";
import assert from "node:assert/strict";
import { rootHistoryMetrics, rankRootMatches } from "../app/lib/root-ranking.ts";
const now = Date.parse("2026-10-16T16:00:00Z"), day = Math.floor(now / 86400_000) * 86400;
const history = Array.from({ length: 31 }, (_, i) => ({ day: new Date((day - (31 - i) * 86400) * 1000).toISOString().slice(0, 10), twr: 1 + i / 1000, twr_first_block: "1", nav_per_share: i === 20 ? .7 : 1 }));
const base = { hotkey: "steady", name: "Steady", take: .18, totalReturn: .03, drawdown: -.01, volatility: .001, concentration: .05, quoteGap: .01, topFive: .2, snapshot: "2026-10-16T15:50:00Z", identityTimestamp: "2026-10-16T15:50:00Z", start: "2026-09-15", end: "2026-10-15" };
test("capital losses remain visible despite steadily accruing staker returns", () => {
  const metrics = rootHistoryMetrics(history, day);
  assert.ok(Math.abs(metrics.drawdown + .3) < 1e-12);
  assert.ok(metrics.totalReturn > 0);
  assert.throws(() => rootHistoryMetrics(history.slice(1), day));
  assert.throws(() => rootHistoryMetrics(history.map((row, i) => i === 0 ? { ...row, twr_first_block: "old" } : row), day));
});
test("balanced and lower-risk modes do not simply select the largest return", () => {
  const risky = { ...base, hotkey: "risky", totalReturn: .2, drawdown: -.3, volatility: .1, concentration: .9, quoteGap: .3 };
  assert.equal(rankRootMatches([risky, base], "balanced", now)[0].hotkey, "steady");
  assert.equal(rankRootMatches([risky, base], "risk", now)[0].hotkey, "steady");
});
test("stale evidence cannot win and fees are not deducted twice", () => {
  const stale = { ...base, hotkey: "stale", snapshot: "2026-10-15T15:00:00Z" };
  assert.deepEqual(rankRootMatches([base, stale], "returns", now), []);
  const high = { ...base, hotkey: "high", totalReturn: .04 };
  const low = { ...base, hotkey: "low", take: 0 };
  assert.equal(rankRootMatches([low, high], "returns", now)[0].hotkey, "high");
  assert.equal(rankRootMatches([low, high], "returns", now)[0].totalReturn, .04);
});
