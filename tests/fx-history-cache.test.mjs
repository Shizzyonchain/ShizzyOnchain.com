import assert from 'node:assert/strict';
import test from 'node:test';
import { mergeFxHistory } from '../app/lib/merge-fx-history.ts';
import { currencyReturns } from '../app/lib/currency-returns.ts';

test('cached dollar baselines survive partial refreshes without overriding real candles', () => {
  const now = 1_800_000_000;
  const cached = [{time: now - 3600, usd: 200}, {time: now, usd: 220}];
  const points = mergeFxHistory(cached, [{time: now - 3600, usd: 190, carriedFrom: now - 3660}], now);
  const row = {price_tao: '1', price_1h_tao: '1', time: new Date(now*1000).toISOString(), time_1h: new Date((now-3600)*1000).toISOString()};
  assert.ok(Math.abs(Number(currencyReturns(row, 'usd', points).change_1h) - 10) < 1e-9);
  assert.equal(Number(currencyReturns(row, 'tao', points).change_1h), 0);
  assert.equal(currencyReturns({...row, time: new Date((now+180)*1000).toISOString()}, 'usd', points).change_1h, undefined);
});

test('drops expired, future and malformed cache points and sorts valid points', () => {
  const now = 1_800_000_000;
  assert.deepEqual(mergeFxHistory([null, {time: now-9*86400, usd: 1}, {time: now+60, usd: 1}], [{time: now, usd: 2}, {time: now-60, usd: 1}], now), [{time: now-60, usd: 1}, {time: now, usd: 2}]);
});
