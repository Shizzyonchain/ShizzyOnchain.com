import assert from "node:assert/strict";
import test from "node:test";
import { aggregateBars, dollarBars, priceBars, chartPrecision } from "../app/lib/chart-data.ts";
const candle = (time, close = "1") => ({ time, open: close, high: close, low: close, close });

test("rejects missing prices and impossible OHLC, keeps gaps and deduplicates", () => {
  const bars = priceBars([
    candle("2026-10-04T00:20:00Z", "2"), candle("2026-10-04T00:00:00Z"),
    candle("2026-10-04T00:00:00Z", "3"), { ...candle("2026-10-04T00:10:00Z"), open: "null" },
    { ...candle("2026-10-04T00:30:00Z"), high: ".5" }, candle("invalid"),
  ]);
  assert.equal(bars.length, 2);
  assert.equal(bars[0].close, 3);
  assert.equal(bars[1].time - bars[0].time, 1200);
});

test("USD history uses each matching historical FX candle, never the latest rate", () => {
  const prices = priceBars([candle("2026-10-04T00:00:00Z"), candle("2026-10-04T00:10:00Z")]);
  const exchange = priceBars([candle("2026-10-04T00:00:00Z", "200"), candle("2026-10-04T00:10:00Z", "250")]);
  assert.deepEqual(dollarBars(prices, exchange).map(bar => bar.close), [200, 250]);
  assert.equal(dollarBars(prices, exchange.slice(1)).length, 1);
});

test("ten-minute aggregation stays on clock boundaries when a five-minute bucket is missing", () => {
  const bars = priceBars([candle("2026-10-04T00:05:00Z", "1"), candle("2026-10-04T00:15:00Z", "2"), candle("2026-10-04T00:20:00Z", "3")]);
  const result = aggregateBars(bars, 600);
  assert.deepEqual(result.map(bar => new Date(bar.time * 1000).toISOString()),
    ["2026-10-04T00:00:00.000Z", "2026-10-04T00:10:00.000Z", "2026-10-04T00:20:00.000Z"]);
  assert.deepEqual(result.map(bar => [bar.open, bar.close]), [[1, 1], [2, 2], [3, 3]]);
});

test("small alpha prices remain readable", () => { assert.equal(chartPrecision(.00001234), 8); });
