import test from "node:test";
import assert from "node:assert/strict";
import { subnetYieldContext, formatSubnetYield } from "../app/lib/subnet-yield.ts";
const now = Date.parse("2026-10-22T08:35:00Z");
const base = { apy: 35.6, apr: 30.46, yield_basis: "latest-epoch-estimate", time: "2026-10-22T08:34:30Z", tempo: 360, staker_epoch_dividends_alpha: 1, circulating_alpha: 110000, alpha_reserve: 10000 };
test("normal one-epoch context preserves provider yields and exposes denominator and input age", () => {
 const result = subnetYieldContext(base, now);
 assert.equal(result.apy, base.apy); assert.equal(result.apr, base.apr);
 assert.equal(result.stake,100000); assert.equal(result.epochReturnPct,.001); assert.equal(result.epochBlocks,361);
 assert.equal(result.ageSeconds,30); assert.equal(result.ageLabel,"Snapshot 30s old"); assert.equal(result.delayed,false); assert.equal(result.warning,null);
});
test("extreme APY is warned, never capped or used as a validator return", () => {
 const result = subnetYieldContext({...base,apy:1.0378997750378076e22,apr:4623.51},now);
 assert.equal(result.apy,1.0378997750378076e22); assert.equal(result.warning,"Potentially unstable");
 assert.equal(formatSubnetYield(result.apy),"1.04e+22%");
 assert.equal(subnetYieldContext({...base,apy:999.99},now).extreme,false);
 assert.equal(subnetYieldContext({...base,apy:1000},now).extreme,true);
 assert.equal(subnetYieldContext({...base,apy:20,apr:1000},now).extreme,true);
});
test("missing, overflowed and zero yields remain distinct; unknown basis is not invented", () => {
 assert.equal(subnetYieldContext({...base,apy:null},now).apy,null);
 assert.equal(subnetYieldContext({...base,apy:Infinity},now).compoundingUnavailable,true);
 assert.equal(formatSubnetYield(null),"Unavailable");
 assert.equal(subnetYieldContext({...base,apy:0,apr:0},now).warning,null);
 const unknown=subnetYieldContext({...base,yield_basis:undefined,apy:'',apr:null},now);
 assert.equal(unknown.warning,"Basis unconfirmed"); assert.equal(unknown.epochReturnPct,null);
 assert.equal(subnetYieldContext({...base,circulating_alpha:10000},now).stake,null);
});
test("old and future source times are visible, never relabelled as reward-epoch ages", () => {
 assert.equal(subnetYieldContext({...base,time:"2026-10-22T08:30:00Z"},now).ageLabel,"Snapshot 5m old · delayed");
 for(const time of [undefined,"invalid","2026-10-22T09:00:00Z"]) {
  const result=subnetYieldContext({...base,time},now);assert.equal(result.ageSeconds,null);assert.equal(result.delayed,true);
 }
});
