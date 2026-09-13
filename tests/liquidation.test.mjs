import test from "node:test";
import assert from "node:assert/strict";
import { compareLiquidation, liquidationPercent } from "../app/lib/liquidation.ts";

test("payout differences keep signed percentages and missing values distinct", () => {
  assert.equal(liquidationPercent(20), "+20.00%");
  assert.equal(liquidationPercent(-20), "-20.00%");
  assert.equal(liquidationPercent(0), "0.00%");
  for (const value of [null, undefined, "", "NaN"]) assert.equal(liquidationPercent(value), "—");
});

test("missing estimates stay last in either direction", () => {
  const values = [null, "-20", "0", "20", undefined];
  assert.deepEqual([...values].sort((a, b) => compareLiquidation(a, b, "desc")), ["20", "0", "-20", null, undefined]);
  assert.deepEqual([...values].sort((a, b) => compareLiquidation(a, b, "asc")), ["-20", "0", "20", null, undefined]);
});
