import test from "node:test";
import assert from "node:assert/strict";
import { compareHistory, basketOverlap } from "../app/lib/root-comparison.ts";
const points = (values, life = "1") => values.map((twr, i) => ({ day: `2026-10-${String(i + 1).padStart(2, "0")}`, twr, twr_first_block: life }));
test("same-date normalization and peak drawdown do not confuse NAV deposits with returns", () => {
  const result = compareHistory([points([2, 3, 2.4]), points([1, 1.1, 1.2])]);
  assert.deepEqual(result.series[0].values, [100, 150, 120]);
  assert.ok(Math.abs(result.series[0].drawdown + .2) < 1e-10);
  assert.ok(Math.abs(result.series[1].totalReturn - .2) < 1e-10);
});
test("fund resets, gaps and missing total return cannot be bridged", () => {
  assert.throws(() => compareHistory([points([1, 2]), points([null, null])]));
  assert.throws(() => compareHistory([points([1, 2, 3]).filter((_, i) => i !== 1), points([1, 2, 3])]));
  assert.throws(() => compareHistory([[...points([100, 200]), { ...points([1])[0], day: "2026-10-03", twr_first_block: "2" }], points([1, 2, 3])]));
});
test("overlap weights shared exposure and refuses mismatched snapshots", () => {
  const a = { block_number: 1, nav_tao: "100", holdings: [{ netuid: 1, realizable_tao: "80" }, { netuid: 2, realizable_tao: "20" }] };
  const b = { ...a, holdings: [{ netuid: 1, realizable_tao: "20" }, { netuid: 3, realizable_tao: "80" }] };
  assert.equal(basketOverlap(a, b).overlap, .2);
  assert.equal(basketOverlap(a, a).overlap, 1);
  assert.equal(basketOverlap(a, { ...b, block_number: 2 }), null);
});
