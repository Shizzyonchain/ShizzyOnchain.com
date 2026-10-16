import test from "node:test";
import assert from "node:assert/strict";
import { resolveParentIdentity } from "../app/lib/validator-identity.ts";
const now = Date.parse("2026-10-16T15:00:00Z");
const rows = [{ hotkey: "child", netuid: 51, timestamp: "2026-10-16T14:45:00Z", parents: [{ hotkey: "parent", proportion: "0.5" }] }];
const names = [{ hotkey: "parent", name: "Datura", timestamp: "2026-10-16T14:00:00Z" }];
test("attributes a verified, subnet-specific delegation parent without replacing the child address", () => {
  const result = resolveParentIdentity("child", 51, rows, names, now);
  assert.equal(result.label, "Datura · child hotkey");
  assert.deepEqual(result.parents[0].subnets, [51]);
  assert.equal(result.observedAt, "2026-10-16T14:00:00Z");
  assert.equal(resolveParentIdentity("child", 64, rows, names, now).label, null);
  assert.equal(resolveParentIdentity("other-child", 51, rows, names, now).label, null);
});
test("multiple parents are not presented as one brand or operator", () => {
  const multiple = [{ ...rows[0], parents: [...rows[0].parents, { hotkey: "second", proportion: "0.5" }] }];
  const result = resolveParentIdentity("child", 51, multiple, names, now);
  assert.equal(result.label, "Child hotkey · 2 parents");
  assert.equal(result.parents[1].name, null);
});
test("stale, future, zero-share and self relationships do not establish a label", () => {
  for (const row of [
    { ...rows[0], timestamp: "2026-10-15T14:00:00Z" },
    { ...rows[0], timestamp: "2026-10-17T14:00:00Z" },
    { ...rows[0], parents: [{ hotkey: "parent", proportion: "0" }] },
    { ...rows[0], parents: [{ hotkey: "child", proportion: "1" }] },
  ]) assert.equal(resolveParentIdentity("child", 51, [row], names, now).label, null);
  assert.equal(resolveParentIdentity("child", 51, rows, [{ ...names[0], timestamp: "2026-10-15T14:00:00Z" }], now).label, "Child hotkey · unnamed parent");
});
