import assert from "node:assert/strict";
import test from "node:test";
import { aggregateBars, dollarBars, priceBars, chartPrecision, taoPriceCandles } from "../app/lib/chart-data.ts";
const candle = (time, close = "1") => ({ time, open: close, high: close, low: close, close });

test("TAO price history keeps pre-listing candles and never treats rolling USD volume as candle volume", () => {
  const row = { timestamp: "2023-03-01T00:00:00Z", open: "50", high: "55", low: "49", close: "54", volume_24h: "1000000" };
  const data = taoPriceCandles({ data: [row, { ...row, timestamp: "2023-03-02T00:00:00Z", high: "1" }, { ...row, open: null }] });
  assert.equal(data.length, 1);
  assert.equal(Date.parse(data[0].time), Date.parse(row.timestamp));
  assert.equal(data[0].volume_tao, undefined);
  assert.equal(priceBars(data)[0].volume, 0);
  assert.throws(() => taoPriceCandles({ error: "unavailable" }));
});

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

// Calendar boundaries differ from fixed-duration buckets, especially February.
test("weekly bars begin Monday UTC and preserve OHLC and summed volume", async () => {
  const { calendarBars } = await import("../app/lib/chart-data.ts");
  const bars = priceBars([candle("2026-10-04T00:00:00Z", "2"), candle("2026-10-05T00:00:00Z", "3"), candle("2026-10-06T00:00:00Z", "1")]).map(bar => ({...bar, volume: 4}));
  const weekly = calendarBars(bars, "1w");
  assert.deepEqual(weekly.map(bar => new Date(bar.time * 1000).toISOString().slice(0,10)), ["2026-09-28", "2026-10-05"]);
  assert.deepEqual([weekly[1].open, weekly[1].high, weekly[1].low, weekly[1].close, weekly[1].volume], [3,3,1,1,8]);
});
test("monthly bars use calendar months including leap February and USD is converted daily first", async () => {
  const { calendarBars } = await import("../app/lib/chart-data.ts");
  const bars = priceBars([candle("2024-02-28T00:00:00Z", "2"), candle("2024-02-29T00:00:00Z", "3"), candle("2024-03-01T00:00:00Z", "4")]);
  const fx = bars.map((bar,index) => ({...bar, open:100*(index+1),high:100*(index+1),low:100*(index+1),close:100*(index+1)}));
  const monthly = calendarBars(dollarBars(bars,fx), "1mo");
  assert.deepEqual(monthly.map(bar=>new Date(bar.time*1000).toISOString().slice(0,10)), ["2024-02-01","2024-03-01"]);
  assert.deepEqual([monthly[0].open,monthly[0].close,monthly[1].close],[200,600,1200]);
});
