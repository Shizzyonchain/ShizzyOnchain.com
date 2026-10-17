import test from 'node:test';
import assert from 'node:assert/strict';
import { currentYieldCheck, yieldCandidates } from '../app/lib/validator-yield-check.ts';
test('only the exact fresh provider snapshot can carry a current chain check', () => {
  const timestamp = '2026-10-16T12:00:00Z';
  const check = { providerBlock: 100, providerTimestamp: timestamp };
  const now = Date.parse(timestamp)+3600000;
  assert.equal(currentYieldCheck(check,100,timestamp,now),check);
  assert.equal(currentYieldCheck(check,101,timestamp,now),undefined);
  assert.equal(currentYieldCheck(check,100,timestamp,now+7200000),undefined);
  assert.equal(currentYieldCheck(check,100,timestamp,now-7200000),undefined);
  assert.equal(currentYieldCheck(check,100,'invalid',now),undefined);
});
test('chain rankings never mix provider rates with calculated APY, and need exact fresh snapshots', () => {
  const timestamp='2026-10-16T12:00:00Z', now=Date.parse(timestamp)+60000;
  const candidates=['a','b','c'].map(hotkey=>({hotkey,yieldBlock:100,timestamps:[timestamp],yieldBasis:'nominator-net',yield7:.3,yield30:.3}));
  const window={status:'basis-review',chainApy:.4,chainApr:.34};
  const checks={netuid:64,state:'ready',result:{methodVersion:3,rows:['a','b'].map(hotkey=>({hotkey,providerBlock:100,providerTimestamp:timestamp,seven:window,thirty:window}))}};
  const selected=yieldCandidates(candidates,checks,64,now);
  assert.equal(selected.source,'chain');
  assert.equal(selected.candidates[0].yield7,.4);
  assert.equal(selected.candidates[0].apr7,.34);
  assert.equal(selected.candidates[2].yield7,null);
  assert.equal(selected.candidates[2].yieldBasis,'unknown');
  assert.equal(yieldCandidates(candidates,checks,51,now).source,'provider');
  assert.equal(yieldCandidates(candidates,checks,64,now+7200000).source,'provider');
  assert.equal(yieldCandidates(candidates,{...checks,result:{...checks.result,methodVersion:2}},64,now).source,'provider');
});
