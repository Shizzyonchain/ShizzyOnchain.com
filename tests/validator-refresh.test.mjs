import assert from "node:assert/strict";
import test from "node:test";
import { prepareSubnetWrites } from "../app/lib/subnet-preparation-batch.ts";
import { directorySnapshotTimes } from "../app/lib/validator-types.ts";

test("one preparation run covers all 128 subnets with bounded concurrent cache writes", async () => {
  let active = 0, peak = 0; const seen = [];
  const result = await prepareSubnetWrites(Array.from({length:128},(_,i)=>i+1), async netuid => {
    active++; peak = Math.max(peak, active); seen.push(netuid);
    await Promise.resolve(); active--; return { netuid };
  }, Infinity);
  assert.equal(peak, 4); assert.equal(new Set(seen).size, 128);
  assert.equal(result.prepared.length, 128); assert.equal(result.remaining, 0);
});
test("failed or leased subnet writes cannot abort the other subnet preparations", async () => {
  const result = await prepareSubnetWrites([1,2,3], async netuid => { if(netuid===2) throw Error("source failure"); if(netuid===3) return; return true; }, Infinity);
  assert.deepEqual(result.prepared,[1]); assert.deepEqual(result.failed,[2]); assert.deepEqual(result.inProgress,[3]); assert.equal(result.remaining,2);
  const expired = await prepareSubnetWrites([1,2], async()=>{throw Error("must not run");},0,()=>1);
  assert.equal(expired.prepared.length,0); assert.equal(expired.remaining,2);
});
test("directory freshness reports old, invalid and future rows despite a fresh newest row", () => {
  const now = Date.parse("2026-10-19T18:00:00Z");
  const times = directorySnapshotTimes([{timestamp:"2026-10-19T17:55:00Z"},{timestamp:"2026-10-19T14:00:00Z"},{timestamp:"invalid"},{timestamp:"2026-10-19T20:00:00Z"}],now);
  assert.equal(times.oldest,Date.parse("2026-10-19T14:00:00Z")); assert.equal(times.stale,3);
  assert.deepEqual(directorySnapshotTimes([],now),{oldest:null,newest:null,stale:0});
});
