import assert from "node:assert/strict";
import test from "node:test";
import { rankValidators } from "../app/lib/validator-ranking.ts";

const now = Date.parse("2026-10-16T16:00:00Z");
const base = {
  hotkey: "steady", name: "Steady", take: .09, yield7: .3, yield30: .3,
  participation7: 1, participation30: 1, active: true, permit: true,
  updated: 5, cutoff: 500, stakeShare: .1, dividends: .1,
  registered: "2025-01-01", timestamps: Array(4).fill("2026-10-16T15:50:00Z"),
};
test("a short yield spike cannot outrank consistent operation on balanced mode", () => {
  const spike = { ...base, hotkey: "spike", yield7: 8, yield30: .25 };
  assert.equal(rankValidators([spike, base], "balanced", now)[0].hotkey, "steady");
});
test("missing participation, inactive permits and stale evidence cannot win", () => {
  const bad = [
    { ...base, hotkey: "unknown", participation30: null },
    { ...base, hotkey: "inactive", active: false },
    { ...base, hotkey: "no-permit", permit: false },
    { ...base, hotkey: "stale", timestamps: Array(4).fill("2026-10-15T15:50:00Z") },
    { ...base, hotkey: "future", timestamps: Array(4).fill("2026-10-17T15:50:00Z") },
    { ...base, hotkey: "unproven", registered: "2026-10-15" },
    { ...base, hotkey: "expired-update", updated: 501 },
  ];
  const rows = rankValidators([...bad, base], "balanced", now);
  assert.equal(rows[0].hotkey, "steady");
  assert.ok(rows.slice(1).every(row => row.score === null && row.excluded.length));
});
test("preference changes favor low fees or lower concentration without disabling eligibility", () => {
  const cheap = { ...base, hotkey: "cheap", take: 0, stakeShare: .4 };
  const small = { ...base, hotkey: "small", take: .18, stakeShare: .01 };
  assert.equal(rankValidators([cheap, small], "fees", now)[0].hotkey, "cheap");
  assert.equal(rankValidators([cheap, small], "decentralization", now)[0].hotkey, "small");
  assert.deepEqual(rankValidators([cheap, small], "balanced", now), rankValidators([small, cheap], "balanced", now));
});
test("zero yield, nonfinite numbers and missing parameters do not become favorable defaults", () => {
  for (const overrides of [{ yield30: 0 }, { yield7: NaN }, { take: null }, { stakeShare: Infinity }, { cutoff: null }]) {
    assert.equal(rankValidators([{ ...base, ...overrides }], "balanced", now)[0].score, null);
  }
});
