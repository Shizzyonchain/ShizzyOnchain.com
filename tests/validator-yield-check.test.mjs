import test from 'node:test';
import assert from 'node:assert/strict';
import { currentYieldCheck } from '../app/lib/validator-yield-check.ts';
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
