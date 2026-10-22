import test from "node:test";
import assert from "node:assert/strict";
import { rootHistoryMetrics } from "../app/lib/root-ranking.ts";
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

test("NAV/share decline and rising TWR remain distinct; capital comparison matches recommendation risk", () => {
 const utcDay = Date.parse("2026-10-22T00:00:00Z") / 1000;
 const history = Array.from({ length: 31 }, (_, i) => ({ day: new Date((utcDay - (31 - i) * 86400) * 1000).toISOString().slice(0, 10), twr: 1 + i * .001, twr_first_block: "1", nav_per_share: i === 20 ? .9686 : 1 }));
 const capital = compareHistory([history, history], "capital");
 const twr = compareHistory([history, history], "total-return");
 assert.equal(capital.basis, "capital"); assert.equal(twr.basis, "total-return");
 assert.deepEqual(capital.days, twr.days);
 assert.equal(capital.series[0].drawdown, rootHistoryMetrics(history, utcDay).drawdown);
 assert.ok(Math.abs(capital.series[0].drawdown + .0314) < 1e-12);
 assert.equal(twr.series[0].drawdown, 0);
 assert.notEqual(capital.series[0].totalReturn, twr.series[0].totalReturn);
});
test("capital view never substitutes TWR for missing, gapped or reset NAV/share history", () => {
 assert.throws(() => compareHistory([points([1,2]), points([1,2])], "capital"), /capital NAV\/share.*No other series/);
 const capital = points([1,2,3]).map(point => ({ ...point, nav_per_share: 1 }));
 assert.throws(() => compareHistory([capital.map((point,i) => i===1 ? {...point,nav_per_share:null} : point), capital], "capital"), /gaps/);
 assert.throws(() => compareHistory([capital.map((point,i) => i===2 ? {...point,twr_first_block:"new"} : point), capital], "capital"), /Fewer than two/);
 assert.throws(() => compareHistory([capital.map((point,i) => i===2 ? {...point,nav_per_share:0} : point), capital], "capital"), /unavailable/);
});
