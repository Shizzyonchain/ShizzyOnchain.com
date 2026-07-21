"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  CandlestickSeries,
  ColorType,
  CrosshairMode,
  ISeriesApi,
  LineSeries,
  LineStyle,
  UTCTimestamp,
  createChart,
} from "lightweight-charts";

type Candle = { time: string; open: string; high: string; low: string; close: string; volume_tao?: string };
type DisplayCandle = { time: UTCTimestamp; open: number; high: number; low: number; close: number };
type Ohlc = { open: number; high: number; low: number; close: number; time: number };
const candleIntervalMs: Record<string, number> = { "1m": 60_000, "10m": 600_000, "1h": 3_600_000, "1d": 86_400_000 };

const average = (values: number[]) => values.reduce((sum, value) => sum + value, 0) / values.length;

function movingAverage(data: DisplayCandle[], period: number) {
  return data.slice(period - 1).map((candle, index) => ({
    time: candle.time,
    value: average(data.slice(index, index + period).map(item => item.close)),
  }));
}

function exponentialAverage(data: DisplayCandle[], period: number) {
  if (!data.length) return [];
  const multiplier = 2 / (period + 1);
  let value = data[0].close;
  return data.map(candle => {
    value = candle.close * multiplier + value * (1 - multiplier);
    return { time: candle.time, value };
  });
}

function bollingerBands(data: DisplayCandle[], period: number) {
  return data.slice(period - 1).map((candle, index) => {
    const values = data.slice(index, index + period).map(item => item.close);
    const mid = average(values);
    const deviation = Math.sqrt(average(values.map(value => (value - mid) ** 2)));
    return { time: candle.time, upper: mid + deviation * 2, lower: mid - deviation * 2 };
  });
}

const formatValue = (value: number, usd: boolean) => usd
  ? value.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: value < 1 ? 4 : 2 })
  : `τ${value.toLocaleString("en-US", { maximumFractionDigits: value < 1 ? 6 : 4 })}`;

export default function TradingChart({
  candles,
  currency,
  taoUsd,
  timeframe,
  valueCurrency = "tao",
  loading = false,
  error = false,
  onTimeframeChange,
}: {
  candles: Candle[];
  currency: "usd" | "tao";
  taoUsd: number;
  timeframe: string;
  valueCurrency?: "tao" | "usd";
  loading?: boolean;
  error?: boolean;
  onTimeframeChange: (timeframe: string) => void;
}) {
  const hostRef = useRef<HTMLDivElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);
  const [ma, setMa] = useState(true);
  const [ema, setEma] = useState(false);
  const [boll, setBoll] = useState(false);
  const [selected, setSelected] = useState<Ohlc | null>(null);
  const chartRef = useRef<ReturnType<typeof createChart> | null>(null);
  const candleSeriesRef = useRef<ISeriesApi<"Candlestick"> | null>(null);
  const maSeriesRef = useRef<ISeriesApi<"Line"> | null>(null);
  const emaSeriesRef = useRef<ISeriesApi<"Line"> | null>(null);
  const bollUpperRef = useRef<ISeriesApi<"Line"> | null>(null);
  const bollLowerRef = useRef<ISeriesApi<"Line"> | null>(null);
  const fittedRef = useRef(false);

  const usd = valueCurrency === "usd" || currency === "usd";
  const data = useMemo(() => {
    const multiplier = valueCurrency === "tao" && currency === "usd" ? taoUsd : 1;
    const unique = new Map<number, DisplayCandle>();
    candles.forEach(candle => {
      const seconds = Math.floor(new Date(candle.time).getTime() / 1000);
      const values = [candle.open, candle.high, candle.low, candle.close].map(Number);
      if (!Number.isFinite(seconds) || values.some(value => !Number.isFinite(value) || value <= 0)) return;
      unique.set(seconds, {
        time: seconds as UTCTimestamp,
        open: values[0] * multiplier,
        high: values[1] * multiplier,
        low: values[2] * multiplier,
        close: values[3] * multiplier,
      });
    });
    const sorted = [...unique.values()].sort((a, b) => Number(a.time) - Number(b.time));
    if (sorted.length < 2) return sorted;

    // Preserve real OHLC candles while carrying the previous close through
    // missing no-trade buckets. This keeps the time scale stable while archive
    // history is backfilled instead of rendering large blank jumps on load.
    const intervalSeconds = Math.max(60, Math.round((candleIntervalMs[timeframe] || 60_000) / 1000));
    const filled: DisplayCandle[] = [sorted[0]];
    for (let index = 1; index < sorted.length; index++) {
      const current = sorted[index];
      const previous = filled.at(-1)!;
      for (let time = Number(previous.time) + intervalSeconds; time < Number(current.time) && filled.length < 500; time += intervalSeconds) {
        filled.push({ time: time as UTCTimestamp, open: previous.close, high: previous.close, low: previous.close, close: previous.close });
      }
      filled.push(current);
    }
    return filled.slice(-500);
  }, [candles, currency, taoUsd, valueCurrency, timeframe]);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    host.replaceChildren();
    const chart = createChart(host, {
      autoSize: true,
      height: 390,
      layout: {
        background: { type: ColorType.Solid, color: "#071328" },
        textColor: "#7892b8",
        fontFamily: "var(--font-mono)",
        fontSize: 11,
        attributionLogo: false,
      },
      grid: {
        vertLines: { color: "rgba(35,76,124,.32)" },
        horzLines: { color: "rgba(35,76,124,.32)" },
      },
      crosshair: {
        mode: CrosshairMode.Normal,
        vertLine: { color: "#388bd1", labelBackgroundColor: "#126ea8" },
        horzLine: { color: "#388bd1", labelBackgroundColor: "#126ea8" },
      },
      rightPriceScale: {
        borderColor: "#173b68",
        scaleMargins: { top: .12, bottom: .12 },
      },
      timeScale: {
        borderColor: "#173b68",
        timeVisible: timeframe !== "1d",
        secondsVisible: false,
        rightOffset: 4,
        barSpacing: timeframe === "1h" ? 18 : timeframe === "1d" ? 12 : 8,
        minBarSpacing: 4,
      },
      handleScroll: true,
      handleScale: true,
    });
    chartRef.current = chart;
    const precision = usd ? 4 : 6;
    const priceFormat = { type: "price" as const, precision, minMove: 10 ** -precision };
    const candleSeries = chart.addSeries(CandlestickSeries, {
      upColor: "#20d17a",
      downColor: "#ff4d5e",
      borderVisible: false,
      wickUpColor: "#20d17a",
      wickDownColor: "#ff4d5e",
      priceFormat,
      priceLineColor: "#20a7e8",
    });
    candleSeriesRef.current = candleSeries;

    if (ma) maSeriesRef.current = chart.addSeries(LineSeries, { color: "#c28cff", lineWidth: 2, priceLineVisible: false, lastValueVisible: false, priceFormat });
    if (ema) emaSeriesRef.current = chart.addSeries(LineSeries, { color: "#ffb84d", lineWidth: 2, priceLineVisible: false, lastValueVisible: false, priceFormat });
    if (boll) {
      bollUpperRef.current = chart.addSeries(LineSeries, { color: "#4da3ff", lineWidth: 1, lineStyle: LineStyle.Dashed, priceLineVisible: false, lastValueVisible: false, priceFormat });
      bollLowerRef.current = chart.addSeries(LineSeries, { color: "#4da3ff", lineWidth: 1, lineStyle: LineStyle.Dashed, priceLineVisible: false, lastValueVisible: false, priceFormat });
    }

    chart.subscribeCrosshairMove(param => {
      const point = param.seriesData.get(candleSeries) as DisplayCandle | undefined;
      if (point) setSelected({ ...point, time: Number(point.time) });
    });
    fittedRef.current = false;

    return () => {
      chart.remove();
      chartRef.current = null;
      candleSeriesRef.current = null;
      maSeriesRef.current = null;
      emaSeriesRef.current = null;
      bollUpperRef.current = null;
      bollLowerRef.current = null;
    };
  }, [timeframe, ma, ema, boll, usd]);

  useEffect(() => {
    if (!data.length || !candleSeriesRef.current) return;
    candleSeriesRef.current.setData(data);
    maSeriesRef.current?.setData(data.length >= 20 ? movingAverage(data, 20) : []);
    emaSeriesRef.current?.setData(exponentialAverage(data, 20));
    if (bollUpperRef.current && bollLowerRef.current) {
      const bands = data.length >= 20 ? bollingerBands(data, 20) : [];
      bollUpperRef.current.setData(bands.map(point => ({ time: point.time, value: point.upper })));
      bollLowerRef.current.setData(bands.map(point => ({ time: point.time, value: point.lower })));
    }
    setSelected({ ...data.at(-1)!, time: Number(data.at(-1)!.time) });
    if (!fittedRef.current) {
      const timeScale = chartRef.current?.timeScale();
      if (timeframe === "1m" && data.length > 1) {
        const visibleCandles = Math.min(data.length, 90);
        timeScale?.setVisibleLogicalRange({
          from: data.length - visibleCandles - 0.5,
          to: data.length + 2,
        });
      } else {
        timeScale?.fitContent();
      }
      fittedRef.current = true;
    }
  }, [data, timeframe]);

  const current = selected || (data.length ? { ...data.at(-1)!, time: Number(data.at(-1)!.time) } : null);
  const change = current?.open ? (current.close / current.open - 1) * 100 : 0;

  const toggleFullscreen = async () => {
    if (!terminalRef.current) return;
    if (document.fullscreenElement) await document.exitFullscreen();
    else await terminalRef.current.requestFullscreen();
  };
  const fitChart = () => {
    const timeScale = chartRef.current?.timeScale();
    if (timeframe === "1m" && data.length > 1) {
      const visibleCandles = Math.min(data.length, 90);
      timeScale?.setVisibleLogicalRange({
        from: data.length - visibleCandles - 0.5,
        to: data.length + 2,
      });
      return;
    }
    timeScale?.fitContent();
  };

  return <div ref={terminalRef} className="trading-terminal">
    <div className="chart-toolbar" aria-label="Chart controls">
      <div className="chart-control-group">
        <span className="chart-mode">Candles</span>
        <button className={ma ? "active" : ""} aria-pressed={ma} onClick={() => setMa(value => !value)}>MA</button>
        <button className={ema ? "active" : ""} aria-pressed={ema} onClick={() => setEma(value => !value)}>EMA</button>
        <button className={boll ? "active" : ""} aria-pressed={boll} onClick={() => setBoll(value => !value)}>BOLL</button>
      </div>
      <div className="chart-control-group chart-periods">
        {[["1m", "1M"], ["10m", "10M"], ["1h", "1H"], ["1d", "1D"]].map(([value, label]) =>
          <button key={value} className={timeframe === value ? "active" : ""} aria-pressed={timeframe === value} onClick={() => onTimeframeChange(value)}>{label}</button>
        )}
      </div>
      <div className="chart-control-group chart-actions">
        <button onClick={fitChart}>Fit</button>
        <button onClick={toggleFullscreen} aria-label="Toggle chart fullscreen">⛶</button>
      </div>
    </div>
    {current && <div className="chart-ohlc" aria-live="polite">
      <span>{new Date(current.time * 1000).toLocaleString([], { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })}</span>
      <span>O <b>{formatValue(current.open, usd)}</b></span>
      <span>H <b>{formatValue(current.high, usd)}</b></span>
      <span>L <b>{formatValue(current.low, usd)}</b></span>
      <span>C <b>{formatValue(current.close, usd)}</b></span>
      <strong className={change >= 0 ? "positive" : "negative"}>{change >= 0 ? "+" : ""}{change.toFixed(2)}%</strong>
    </div>}
    <div ref={hostRef} className="trading-chart-host" role="img" aria-label={`Interactive ${timeframe} candlestick chart with zoom, pan, crosshair, and technical indicators`} />
    {!data.length && <div className="chart-empty">{error ? "Chart data is temporarily unavailable" : loading ? "Loading recent candles…" : "Building candle history from your node…"}</div>}
    <div className="chart-legend">
      {ma && <span><i className="ma-line" />MA 20</span>}
      {ema && <span><i className="ema-line" />EMA 20</span>}
      {boll && <span><i className="boll-line" />Bollinger 20, 2</span>}
      <small>Scroll to zoom · Drag to pan</small>
    </div>
  </div>;
}
