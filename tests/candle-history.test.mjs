import assert from 'node:assert/strict';
import test from 'node:test';
import { completeCandleWindow } from '../app/lib/candle-history.ts';
import { rateAt, currencyReturns } from '../app/lib/currency-returns.ts';
const candle = (closeTime, price) => [closeTime - 60, price, price, price, price, 1];
test('September 27 gap: 03:41 close remains usable at 03:43:36 without using 03:44 price', () => {
  const start = Date.parse('2026-09-27T03:41:00Z') / 1000;
  const points = completeCandleWindow([candle(start+180, 325), candle(start, 321)], start+180);
  assert.equal(rateAt(points, start+156), 321);
  assert.equal(points[2].carriedFrom, start);
  const then = start+156-3600;
  points.unshift({time:then,usd:300});
  const row={time:new Date((start+156)*1000).toISOString(),price_tao:'1',time_1h:new Date(then*1000).toISOString(),price_1h_tao:'1'};
  assert.ok(Math.abs(Number(currencyReturns(row,'usd',points).change_1h)-7)<1e-9);
});
test('never extends a stale tail, uses unfinished candles or fills long outages', () => {
  assert.equal(rateAt(completeCandleWindow([candle(600,300)],900),756),undefined);
  assert.equal(rateAt(completeCandleWindow([candle(600,300),candle(960,320)],900),756),undefined);
  assert.equal(rateAt(completeCandleWindow([candle(600,300),candle(1200,320)],1200),900),undefined);
  assert.deepEqual(completeCandleWindow(null,900),[]);
});
