export type Candle = {
  time: string; open: string; high: string; low: string; close: string; volume_tao?: string;
};
export type PriceBar = { time: number; open: number; high: number; low: number; close: number; volume: number };
export const chartIntervals: Record<string, number> = { "1m": 60, "10m": 600, "1h": 3600, "1d": 86400 };

// Invalid/incomplete rows must not become zero-price candles or invented history.
export function priceBars(candles: Candle[]): PriceBar[] {
  const unique = new Map<number, PriceBar>();
  for (const candle of candles) {
    const time = Math.floor(Date.parse(candle.time) / 1000);
    if ([candle.open, candle.high, candle.low, candle.close].some(value => value == null || value.trim() === "")) continue;
    const [open, high, low, close] = [candle.open, candle.high, candle.low, candle.close].map(Number);
    if (!Number.isFinite(time) || [open, high, low, close].some(value => !Number.isFinite(value) || value <= 0)) continue;
    if (low > Math.min(open, close) || high < Math.max(open, close) || low > high) continue;
    const volume = Number(candle.volume_tao);
    unique.set(time, { time, open, high, low, close, volume: Number.isFinite(volume) && volume >= 0 ? volume : 0 });
  }
  return [...unique.values()].sort((a, b) => a.time - b.time);
}

// OHLC products do not reveal simultaneous extrema. USD high/low are bounds,
// explicitly labelled as estimates in the UI; never multiply all history by spot.
export function dollarBars(bars: PriceBar[], exchange: PriceBar[]): PriceBar[] {
  const rates = new Map(exchange.map(bar => [bar.time, bar]));
  return bars.flatMap(bar => {
    const rate = rates.get(bar.time);
    return rate ? [{ ...bar, open: bar.open * rate.open, high: bar.high * rate.high,
      low: bar.low * rate.low, close: bar.close * rate.close }] : [];
  });
}

export function aggregateBars(bars: PriceBar[], seconds: number): PriceBar[] {
  const buckets = new Map<number, PriceBar>();
  for (const bar of bars) {
    const time = Math.floor(bar.time / seconds) * seconds;
    const previous = buckets.get(time);
    buckets.set(time, previous ? { ...previous, high: Math.max(previous.high, bar.high), low: Math.min(previous.low, bar.low),
      close: bar.close, volume: previous.volume + bar.volume } : { ...bar, time });
  }
  return [...buckets.values()];
}

export function indicatorPoints(bars: PriceBar[], period = 20) {
  let exponential = bars[0]?.close || 0;
  const multiplier = 2 / (period + 1);
  return bars.map((bar, index) => {
    exponential += multiplier * (bar.close - exponential);
    const window = bars.slice(Math.max(0, index - period + 1), index + 1);
    const mean = window.reduce((sum, item) => sum + item.close, 0) / window.length;
    const deviation = Math.sqrt(window.reduce((sum, item) => sum + (item.close - mean) ** 2, 0) / window.length);
    return { time: bar.time, ready: window.length === period, ma: mean, ema: exponential, upper: mean + 2 * deviation, lower: mean - 2 * deviation };
  });
}

export function chartPrecision(value: number) {
  if (!(value > 0)) return 4;
  return Math.max(2, Math.min(10, 3 - Math.floor(Math.log10(value))));
}
