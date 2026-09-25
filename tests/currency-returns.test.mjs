import assert from "node:assert/strict";
import test from "node:test";
import { currencyReturns, rateAt, returnPeriods } from "../app/lib/currency-returns.ts";

const now = Date.parse("2026-09-25T16:00:30Z") / 1000;
function fixture(current = "1", previous = "1") {
  const row = { price_tao: current, time: new Date(now * 1000).toISOString() };
  const points = [{ time: now - 30, usd: 330 }];
  for (const [period, seconds] of Object.entries(returnPeriods)) {
    row[`time_${period}`] = new Date((now - seconds) * 1000).toISOString();
    row[`price_${period}_tao`] = previous;
    row[`change_${period}`] = "0";
    points.push({ time: now - seconds - 30, usd: 300 });
  }
  return { row, points: points.sort((a, b) => a.time - b.time) };
}

test("flat alpha/TAO and TAO up 10% yields USD +10% and TAO 0 across every period", () => {
  const { row, points } = fixture();
  for (const period of Object.keys(returnPeriods)) {
    assert.ok(Math.abs(Number(currencyReturns(row, "usd", points)[`change_${period}`]) - 10) < 1e-10);
    assert.equal(currencyReturns(row, "tao", points)[`change_${period}`], "0");
  }
  assert.equal(row.change_1h, "0", "switching must never mutate cached raw rows");
});

test("compound returns: alpha up 20%, dollar TAO up 10% is 32%, not 30%", () => {
  const { row, points } = fixture("1.2");
  assert.ok(Math.abs(Number(currencyReturns(row, "usd", points).change_7d) - 32) < 1e-10);
});

test("USD and TAO can have opposite signs", () => {
  const { row, points } = fixture("0.95");
  assert.ok(Number(currencyReturns(row, "tao", points).change_1h) < 0);
  assert.ok(Number(currencyReturns(row, "usd", points).change_1h) > 0);
});

test("missing FX stays unavailable, never falls back to TAO or a future rate", () => {
  const { row } = fixture();
  assert.equal(currencyReturns(row, "usd", []).change_1h, undefined);
  assert.equal(rateAt([{ time: now + 1, usd: 300 }], now), undefined);
  assert.equal(rateAt([{ time: now - 121, usd: 300 }], now), undefined);
});

test("rejects wrong-period baselines and invalid prices", () => {
  const { row, points } = fixture();
  row.time_1h = row.time_24h;
  row.price_7d_tao = "0";
  assert.equal(currencyReturns(row, "usd", points).change_1h, undefined);
  assert.equal(currencyReturns(row, "tao", points).change_7d, undefined);
});

test("older API response remains usable only in TAO mode", () => {
  const row = { price_tao: "1", change_1h: "4" };
  assert.equal(currencyReturns(row, "tao", []).change_1h, "4");
  assert.equal(currencyReturns(row, "usd", []).change_1h, undefined);
});
