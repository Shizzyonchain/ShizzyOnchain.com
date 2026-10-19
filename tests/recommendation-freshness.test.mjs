import assert from "node:assert/strict";
import test from "node:test";
import { recommendationNeedsRefresh } from "../app/lib/recommendation-freshness.ts";
const now = Date.parse("2026-10-19T17:30:00Z");
const fresh = { preparedAt: new Date(now - 60000).toISOString(), candidates: [{ operation: "delegated", operatorIdentities: [{ hotkey: "child", name: "Operator" }] }] };
test("refresh aging prepared snapshots before the two-hour evidence gate, without discarding ready data", () => {
  assert.equal(recommendationNeedsRefresh(fresh, now), false);
  assert.equal(recommendationNeedsRefresh({ ...fresh, preparedAt: new Date(now - 900000).toISOString() }, now), true);
  assert.equal(fresh.preparedAt, "2026-10-19T17:29:00.000Z");
});
test("old schemas and invalid or future preparation timestamps trigger background refresh", () => {
  assert.equal(recommendationNeedsRefresh({ ...fresh, candidates: [{ operation: "delegated" }] }, now), true);
  for (const preparedAt of ["invalid", new Date(now + 3600000).toISOString()]) assert.equal(recommendationNeedsRefresh({ ...fresh, preparedAt }, now), true);
});
