import test from "node:test";
import assert from "node:assert/strict";
import { rootEligibility, rootHistoryMetrics, rankRootMatches } from "../app/lib/root-ranking.ts";
const now = Date.parse("2026-10-16T16:00:00Z"), day = Math.floor(now / 86400_000) * 86400;
const history = Array.from({ length: 31 }, (_, i) => ({ day: new Date((day - (31 - i) * 86400) * 1000).toISOString().slice(0, 10), twr: 1 + i / 1000, twr_first_block: "1", nav_per_share: i === 20 ? .7 : 1 }));
const base = { operatingTimestamp: "2026-10-16T15:50:00Z", hotkey: "steady", name: "Steady", take: .18, totalReturn: .03, drawdown: -.01, volatility: .001, concentration: .05, quoteGap: .01, topFive: .2, snapshot: "2026-10-16T15:50:00Z", identityTimestamp: "2026-10-16T15:50:00Z", start: "2026-09-15", end: "2026-10-15" };
test("small and unnamed baskets have no size or name eligibility cutoff", () => {
  assert.deepEqual(rootEligibility({ root_stake: "1", nav_tao: "1", take: 0 }), []);
  assert.equal(rootEligibility({ root_stake: null, nav_tao: "0", take: null }).length, 3);
  const rows = Array.from({ length: 20 }, (_, i) => ({ ...base, hotkey: String(i), name: "", totalReturn: i / 100 }));
  assert.equal(rankRootMatches(rows, "returns", now).length, 20);
  assert.equal(rankRootMatches(rows, "returns", now)[0].hotkey, "19");
});
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

test("missing or stale current root-permit evidence cannot win", () => {
  assert.equal(rankRootMatches([{ ...base, operatingTimestamp: undefined }], "balanced", now).length, 0);
  assert.equal(rankRootMatches([{ ...base, operatingTimestamp: "2026-10-15T15:50:00Z" }], "balanced", now).length, 0);
});
