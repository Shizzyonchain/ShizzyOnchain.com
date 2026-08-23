import assert from "node:assert/strict";
import test from "node:test";

import { bestAvailableBubbleTimeframe, bubbleTimeframeHasCoverage } from "../app/lib/bubble-timeframe.ts";

test("falls back to one hour when daily history is unavailable", () => {
  const rows = Array.from({ length: 10 }, (_, index) => ({
    netuid: index + 1,
    change_10m: "0.01",
    change_1h: index % 2 ? "-0.5" : "0.5",
    change_24h: null,
  }));

  assert.equal(bestAvailableBubbleTimeframe(rows), "change_1h");
  assert.equal(bubbleTimeframeHasCoverage(rows, "change_24h"), false);
});

test("keeps the daily view when at least 80 percent of rows have real baselines", () => {
  const rows = Array.from({ length: 10 }, (_, index) => ({
    change_10m: "0",
    change_1h: "0",
    change_24h: index < 8 ? "0" : null,
  }));

  assert.equal(bestAvailableBubbleTimeframe(rows), "change_24h");
  assert.equal(bubbleTimeframeHasCoverage(rows, "change_24h"), true);
});

test("does not mistake missing values for zero movement", () => {
  const rows = [{ change_1h: null }, { change_1h: undefined }, { change_1h: "" }];
  assert.equal(bubbleTimeframeHasCoverage(rows, "change_1h"), false);
});
