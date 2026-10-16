import assert from "node:assert/strict";
import test from "node:test";
import { decodeChildStorage, parentKeysPrefix } from "../app/lib/child-hotkey-storage.ts";
const alice = "d43593c715fdd31c61141abd04a99fd6822c8558854ccde39a5684e7a56da27d";
const key = parentKeysPrefix + "00".repeat(16) + alice + "3300";
test("decodes AccountId32 and subnet without confusing parent and child roles", () => {
  const row = decodeChildStorage(key, "0x04" + "0100000000000000" + alice);
  assert.equal(row.hotkey, "5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY");
  assert.equal(row.netuid, 51);
  assert.equal(row.isChild, true);
  assert.deepEqual(row.parents, [row.hotkey]);
});
test("empty or zero-proportion parents do not remove a standalone validator", () => {
  assert.equal(decodeChildStorage(key, "0x00").isChild, false);
  assert.equal(decodeChildStorage(key, "0x04" + "00".repeat(8) + alice).isChild, false);
});
test("malformed storage fails rather than silently returning no children", () => {
  assert.throws(() => decodeChildStorage(key, "0x04"));
  assert.throws(() => decodeChildStorage(key.slice(0, -2), "0x00"));
  assert.throws(() => decodeChildStorage(key, null));
});
