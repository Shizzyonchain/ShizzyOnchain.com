import assert from "node:assert/strict";
import test from "node:test";
import { readFile } from "node:fs/promises";
import { stripTypeScriptTypes } from "node:module";
const types = new URL("../app/lib/validator-types.ts", import.meta.url).href;
const source = (await readFile(new URL("../app/lib/root-baskets.ts", import.meta.url), "utf8")).replace('"./validator-types"', JSON.stringify(types));
const { joinRootBaskets, holdingShare, basketContext } = await import(`data:text/javascript;base64,${Buffer.from(stripTypeScriptTypes(source)).toString("base64")}`);
const holding = { netuid: 51, alpha: "1000000000", realizable_tao: "2500000000", spot_tao: "3000000000" };
const basket = { hotkey: "parent", nav_tao: "5000000000", spot_nav_tao: "6000000000", deposited_tao: "5000000000", redeemed_tao: "0", timestamp: "2026-10-16T16:00:00Z", holdings: [holding, { ...holding, netuid: 0 }], staker_return_7d: null };
test("allocation uses realizable value, not the higher spot mark", () => {
  assert.equal(holdingShare(holding, basket), .5);
  assert.equal(holdingShare(holding, { ...basket, nav_tao: "0" }), null);
});
test("child exclusion preserves unlisted parent baskets and missing return history", () => {
  const rows = joinRootBaskets([basket, { ...basket, hotkey: "child" }], [], ["child"]);
  assert.equal(rows.length, 1);
  assert.equal(rows[0].hotkey, "parent");
  assert.equal(rows[0].name, null);
  assert.equal(rows[0].take, null);
  assert.equal(rows[0].staker_return_7d, null);
});
test("duplicate snapshots and invalid holdings fail instead of presenting misleading allocations", () => {
  assert.throws(() => joinRootBaskets([basket, basket], [], []));
  assert.throws(() => joinRootBaskets([{ ...basket, holdings: [holding, holding] }], [], []));
  assert.throws(() => joinRootBaskets([{ ...basket, holdings: [{ ...holding, realizable_tao: "-1" }] }], [], []));
  assert.throws(() => joinRootBaskets([{ ...basket, nav_tao: "4999999999" }], [], []));
});
test("concentration, cash exposure and quote gap use the correct denominator", () => {
  const context = basketContext(basket);
  assert.equal(context.topFiveShare, 1);
  assert.equal(context.cashShare, .5);
  assert.ok(Math.abs(context.quoteGap - 1 / 6) < 1e-12);
  assert.equal(basketContext({ ...basket, nav_tao: "0", spot_nav_tao: "0" }).quoteGap, null);
});

test("future and timezone-ambiguous basket timestamps cannot enter comparisons", () => {
  const now = Date.parse("2026-10-19T16:00:00Z");
  assert.throws(() => joinRootBaskets([{ ...basket, timestamp: "2026-10-19T19:55:00Z" }], [], [], now), /future-dated/);
  assert.throws(() => joinRootBaskets([{ ...basket, timestamp: "2026-10-19T15:55:00" }], [], [], now), /source time/);
  assert.equal(joinRootBaskets([{ ...basket, timestamp: "2026-10-19T11:55:00-04:00" }], [], [], now).length, 1);
  assert.equal(joinRootBaskets([{ ...basket, timestamp: "2026-10-19T16:00:30Z" }], [], [], now).length, 1);
});
