"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { CandlestickSeries, ColorType, CrosshairMode, HistogramSeries, LineSeries, LineStyle,
  createChart, type IChartApi, type ISeriesApi, type UTCTimestamp } from "lightweight-charts";
import { chartPrecision, futureChartTimes, indicatorPoints, type PriceBar } from "./lib/chart-data";
import "./trading-chart.css";
import { ChartDrawingTools } from "./chart-drawing-tools";

const palettes = {
  blue: { background: "#071328", text: "#adbfda", grid: "rgba(120,146,184,.1)", border: "#173b68", ma: "#c28cff", ema: "#ffb84d", boll: "#4da3ff" },
  monochrome: { background: "#000000", text: "#c6c6c6", grid: "rgba(255,255,255,.07)", border: "#333333", ma: "#ffffff", ema: "#b5b5b5", boll: "#858585" },
};
const green = "#23d18b", red = "#ff5263";
type ChartSeries = {
  candles: ISeriesApi<"Candlestick">; line: ISeriesApi<"Line">; volume: ISeriesApi<"Histogram">;
  ma: ISeriesApi<"Line">; ema: ISeriesApi<"Line">; upper: ISeriesApi<"Line">; lower: ISeriesApi<"Line">;
};

export default function TradingChart({ appearance = "monochrome", bars, currency, timeframe, loading = false,
  error = false, note, onTimeframeChange, onRetry, volumeUnit = "TAO", volumeAvailable = true, onCurrencyChange, drawingId }: {
  appearance?: "blue" | "monochrome"; bars: PriceBar[]; currency: "usd" | "tao"; timeframe: string;
  loading?: boolean; error?: boolean; note: string; onTimeframeChange: (timeframe: string) => void; onRetry: () => void;
  volumeUnit?: "TAO" | "alpha"; volumeAvailable?: boolean;
  drawingId: string;
  onCurrencyChange?: (currency: "usd" | "tao") => void;
}) {
  const hostRef = useRef<HTMLDivElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const seriesRef = useRef<ChartSeries | null>(null);
  const fittedRef = useRef("");
  const [mode, setMode] = useState<"candles" | "line">("candles");
  const [ma, setMa] = useState(false);
  const [ema, setEma] = useState(false);
  const [boll, setBoll] = useState(false);
  const [volume, setVolume] = useState(true);
  const [hoverTime, setHoverTime] = useState<number | null>(null);
  const [fullscreen, setFullscreen] = useState(false);
  const [fullscreenError, setFullscreenError] = useState(false);
  const indicators = useMemo(() => indicatorPoints(bars), [bars]);
  const data = useMemo(() => bars.map(bar => ({ ...bar, time: bar.time as UTCTimestamp })), [bars]);
  const future = useMemo(() => futureChartTimes(bars.at(-1)?.time, timeframe).map(time => ({ time: time as UTCTimestamp })), [bars, timeframe]);
  const drawingTimes = useMemo(() => [...bars.map(bar => bar.time), ...future.map(point => Number(point.time))], [bars, future]);
  const last = bars.at(-1);
  const futureHover = hoverTime !== null && last !== undefined && hoverTime > last.time;
  const current = futureHover ? undefined : bars.find(bar => bar.time === hoverTime) || last;
  const precision = chartPrecision(last?.close || 0);
  const formatPrice = (value: number) => `${currency === "usd" ? "$" : "τ"}${value.toLocaleString("en-US", { maximumFractionDigits: precision })}`;

  // Create every series once. Indicators only change visibility: never remove
  // the chart, lose the viewport, or leave a fresh canvas without its dataset.
  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    const palette = palettes[appearance];
    const chart = createChart(host, {
      autoSize: true,
      layout: { background: { type: ColorType.Solid, color: palette.background }, textColor: palette.text,
        fontFamily: "ui-monospace, SFMono-Regular, Consolas, monospace", fontSize: 11, attributionLogo: true },
      grid: { vertLines: { color: palette.grid }, horzLines: { color: palette.grid } },
      crosshair: { mode: CrosshairMode.Magnet, vertLine: { color: "#808080", labelBackgroundColor: "#333333" },
        horzLine: { color: "#808080", labelBackgroundColor: "#333333" } },
      rightPriceScale: { borderColor: palette.border, scaleMargins: { top: .08, bottom: .23 } },
      timeScale: { borderColor: palette.border, timeVisible: true, rightOffset: 5, barSpacing: 8, minBarSpacing: .1, lockVisibleTimeRangeOnResize: true },
      handleScale: { axisPressedMouseMove: true, mouseWheel: true, pinch: true },
      handleScroll: { mouseWheel: true, pressedMouseMove: true, horzTouchDrag: true, vertTouchDrag: true },
    });
    const lineOptions = { priceLineVisible: false, lastValueVisible: false, crosshairMarkerVisible: false };
    const candles = chart.addSeries(CandlestickSeries, { upColor: green, downColor: red, borderVisible: false,
      wickUpColor: green, wickDownColor: red, priceLineColor: "#999999" });
    const line = chart.addSeries(LineSeries, { color: "#ffffff", lineWidth: 3, visible: false, priceLineColor: "#999999" });
    const histogram = chart.addSeries(HistogramSeries, { priceScaleId: "volume", priceFormat: { type: "volume" },
      priceLineVisible: false, lastValueVisible: false });
    histogram.priceScale().applyOptions({ scaleMargins: { top: .84, bottom: 0 }, visible: false });
    seriesRef.current = { candles, line, volume: histogram,
      ma: chart.addSeries(LineSeries, { ...lineOptions, color: palette.ma, lineWidth: 3, visible: false }),
      ema: chart.addSeries(LineSeries, { ...lineOptions, color: palette.ema, lineWidth: 3, lineStyle: LineStyle.Dashed, visible: false }),
      upper: chart.addSeries(LineSeries, { ...lineOptions, color: palette.boll, lineWidth: 3, lineStyle: LineStyle.Solid, visible: false }),
      lower: chart.addSeries(LineSeries, { ...lineOptions, color: palette.boll, lineWidth: 3, lineStyle: LineStyle.Solid, visible: false }),
    };
    chartRef.current = chart;
    // Fit the initial data normally, then release automatic price fitting when
    // the user grabs the plot. The library can now pan both price and time.
    const beginPan = (event: PointerEvent) => {
      if (event.button !== 0 || !(event.target instanceof HTMLCanvasElement)) return;
      const bounds = event.target.getBoundingClientRect();
      if (bounds.width < host.clientWidth / 2 || bounds.height < host.clientHeight / 2) return;
      if (candles.data().length) chart.priceScale("right").setAutoScale(false);
    };
    host.addEventListener("pointerdown", beginPan, true);
    const wheelPriceScale = (event: WheelEvent) => {
      const rect = host.getBoundingClientRect(), scale = chart.priceScale("right");
      const x = (event.clientX - rect.left) * host.clientWidth / rect.width;
      const y = (event.clientY - rect.top) * host.clientHeight / rect.height;
      if (x < host.clientWidth - scale.width() || y < 0 || y >= host.clientHeight - chart.timeScale().height() || !event.deltaY) return;
      const range = scale.getVisibleRange();
      if (!range || !Number.isFinite(range.from) || !Number.isFinite(range.to) || range.to <= range.from) return;
      event.preventDefault(); event.stopPropagation();
      const factor = Math.exp(Math.max(-.3, Math.min(.3, event.deltaY * (event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? host.clientHeight : 1) * .002)));
      const center = (range.from + range.to) / 2, half = (range.to - range.from) * factor / 2;
      if (!Number.isFinite(half) || half <= Math.max(Math.abs(center), 1e-12) * 1e-10) return;
      scale.setAutoScale(false);
      scale.setVisibleRange({ from: center - half, to: center + half });
      host.dispatchEvent(new Event("chart-price-scale-change"));
    };
    host.addEventListener("wheel", wheelPriceScale, { capture: true, passive: false });
    fittedRef.current = "";
    chart.subscribeCrosshairMove(param => setHoverTime(typeof param.time === "number" ? param.time : null));
    return () => { host.removeEventListener("pointerdown", beginPan, true); host.removeEventListener("wheel", wheelPriceScale, true); chart.remove(); chartRef.current = null; seriesRef.current = null; };
  }, [appearance]);

  useEffect(() => {
    const chart = chartRef.current, series = seriesRef.current;
    if (!chart || !series) return;
    const priceFormat = { type: "price" as const, precision, minMove: 10 ** -precision };
    for (const item of [series.candles, series.line, series.ma, series.ema, series.upper, series.lower]) item.applyOptions({ priceFormat });
    series.candles.setData([...data, ...future]);
    series.line.setData([...data.map(bar => ({ time: bar.time, value: bar.close })), ...future]);
    series.volume.setData(data.map(bar => ({ time: bar.time, value: bar.volume, color: bar.close >= bar.open ? "rgba(35,209,139,.25)" : "rgba(255,82,99,.25)" })));
    const ready = indicators.filter(point => point.ready);
    series.ma.setData(ready.map(point => ({ time: point.time as UTCTimestamp, value: point.ma })));
    series.ema.setData(indicators.map(point => ({ time: point.time as UTCTimestamp, value: point.ema })));
    series.upper.setData(ready.map(point => ({ time: point.time as UTCTimestamp, value: point.upper })));
    series.lower.setData(ready.map(point => ({ time: point.time as UTCTimestamp, value: point.lower })));
    chart.applyOptions({ timeScale: { timeVisible: !["1d", "1w", "1mo"].includes(timeframe) } });
    // Fit once per dataset/currency, not on live refresh or indicator toggles.
    const viewKey = `${timeframe}:${currency}`;
    if (data.length && fittedRef.current !== viewKey) {
      chart.priceScale("right").setAutoScale(true);
      chart.timeScale().setVisibleLogicalRange({ from: Math.max(-1, data.length - 100), to: data.length + 20 });
      fittedRef.current = viewKey;
    }
  }, [data, future, indicators, timeframe, currency, precision, appearance]);

  useEffect(() => {
    const series = seriesRef.current;
    if (!series) return;
    series.candles.applyOptions({ visible: mode === "candles" }); series.line.applyOptions({ visible: mode === "line" });
    series.ma.applyOptions({ visible: ma }); series.ema.applyOptions({ visible: ema });
    series.upper.applyOptions({ visible: boll }); series.lower.applyOptions({ visible: boll });
    series.volume.applyOptions({ visible: volume && volumeAvailable });
    chartRef.current?.priceScale("right").applyOptions({ scaleMargins: { top: .08, bottom: volume && volumeAvailable ? .23 : .08 } });
  }, [mode, ma, ema, boll, volume, volumeAvailable, appearance]);

  useEffect(() => {
    const update = () => setFullscreen(document.fullscreenElement === terminalRef.current);
    document.addEventListener("fullscreenchange", update);
    return () => document.removeEventListener("fullscreenchange", update);
  }, []);
  const toggleFullscreen = async () => {
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else if (terminalRef.current?.requestFullscreen) await terminalRef.current.requestFullscreen();
      else throw new Error("Fullscreen unavailable");
      setFullscreenError(false);
    } catch { setFullscreenError(true); }
  };
  const change = current ? 100 * (current.close / current.open - 1) : 0;
  const reset = () => { chartRef.current?.priceScale("right").setAutoScale(true); if (bars.length) chartRef.current?.timeScale().setVisibleLogicalRange({ from: -1, to: bars.length + 20 }); };
  const latest = () => { const scale = chartRef.current?.timeScale(); const range = scale?.getVisibleLogicalRange(); if (scale && bars.length) scale.setVisibleLogicalRange({ from: bars.length + 20 - (range ? range.to - range.from : 120), to: bars.length + 20 }); };

  return <div ref={terminalRef} className="trading-terminal chart-rebuilt">
    <div className="chart-toolbar" role="group" aria-label="Chart controls">
      <div className="chart-control-group" aria-label="Chart type">
        <button aria-pressed={mode === "candles"} className={mode === "candles" ? "active" : ""} onClick={() => setMode("candles")}>Candles</button>
        <button aria-pressed={mode === "line"} className={mode === "line" ? "active" : ""} onClick={() => setMode("line")}>Line</button>
      </div>
      <div className="chart-control-group chart-periods" aria-label="Candle interval">
        {[["10m", "10m", "10-minute candles"], ["1h", "1h", "1-hour candles"], ["1d", "1D", "Daily candles"], ["1w", "1W", "Weekly candles"], ["1mo", "1M", "Monthly candles"]].map(([value, label, name]) =>
          <button key={value} className={timeframe === value ? "active" : ""} aria-label={name} aria-pressed={timeframe === value} onClick={() => onTimeframeChange(value)}>{label}</button>)}
      </div>
      {onCurrencyChange ? <div className="chart-control-group" role="group" aria-label="Chart currency">
        {(["usd", "tao"] as const).map(value => <button key={value} type="button" aria-pressed={currency === value} className={currency === value ? "active" : ""} onClick={() => onCurrencyChange(value)}>{value.toUpperCase()}</button>)}
      </div> : <span className="chart-currency">{currency.toUpperCase()}</span>}
      <div className="chart-control-group chart-actions">
        <button onClick={latest} title="Return to the latest candle with room to draw ahead">Latest</button>
        <button onClick={reset} title="Fit all available history and reset price scale">Reset</button>
        <button onClick={toggleFullscreen} aria-label={fullscreen ? "Exit chart fullscreen" : "Expand chart fullscreen"}>{fullscreen ? "↙" : "⛶"}</button>
      </div>
    </div>
    <div className="chart-study-toolbar" role="group" aria-label="Technical indicators">
      <span>Indicators</span>
      {[["MA 20", ma, setMa], ["EMA 20", ema, setEma], ["Bollinger", boll, setBoll], ["Volume", volume, setVolume]].map(([label, active, setter]) =>
        <button key={String(label)} disabled={label === "Volume" && !volumeAvailable} aria-pressed={Boolean(active && (label !== "Volume" || volumeAvailable))} className={active && (label !== "Volume" || volumeAvailable) ? "active" : ""} onClick={() => (setter as typeof setMa)(value => !value)}>{String(label)}</button>)}
    </div>
    <ChartDrawingTools key={appearance} chartRef={chartRef} hostRef={hostRef} series={seriesRef} bars={bars} timeline={drawingTimes} storageId={drawingId} currency={currency} appearance={appearance} mode={mode} />
    <div className="chart-ohlc">
      {current ? <>
        <time dateTime={new Date(current.time * 1000).toISOString()}>{new Date(current.time * 1000).toLocaleString("en-US", { timeZone: "UTC", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit", hour12: false })} UTC</time>
        <span>O <b>{formatPrice(current.open)}</b></span><span>H <b>{formatPrice(current.high)}</b></span>
        <span>L <b>{formatPrice(current.low)}</b></span><span>C <b>{formatPrice(current.close)}</b></span>
        <strong className={change >= 0 ? "positive" : "negative"}>{change >= 0 ? "+" : ""}{change.toFixed(2)}%</strong>
      </> : <span>{futureHover ? `${new Date(hoverTime! * 1000).toLocaleString("en-US", { timeZone: "UTC", month: "short", day: "numeric", year: "numeric" })} UTC · Future drawing space · No price data` : loading ? "Loading price history…" : "No price history available"}</span>}
    </div>
    <div className="chart-plot">
      <div ref={hostRef} className="trading-chart-host" role="group" aria-label={`${currency.toUpperCase()} ${timeframe} ${mode} chart. ${bars.length} sampled intervals. ${note}`} />
      {!data.length && <div className="chart-empty" role="status">
        <strong>{loading ? "Loading chart…" : error ? "Chart temporarily unavailable" : "No matching price history"}</strong>
        <span>{loading ? "Getting the latest available history." : "Try another interval or retry."}</span>
        {!loading && <button onClick={onRetry}>Retry chart</button>}
      </div>}
    </div>
    <div className="chart-legend">
      {ma && bars.length >= 20 && <span><i className="ma-line" />MA 20</span>}{ema && <span><i className="ema-line" />EMA 20</span>}
      {boll && bars.length >= 20 && <span><i className="boll-line" />Bollinger 20 / 2</span>}
      {volume && volumeAvailable && <span>Volume in {volumeUnit}</span>}
      <small>Drag chart to pan · Drag or scroll price numbers to stretch/compress · Reset restores fit</small>
    </div>
    {(ma || boll) && bars.length > 0 && bars.length < 20 && <div className="chart-warning" role="status">MA 20 and Bollinger need 20 intervals. This view currently has {bars.length}.</div>}
    <div className="chart-source-note"><span>{note} · {bars.length} intervals · UTC{bars.length > 0 && ` · History from ${new Date(bars[0].time * 1000).toISOString().slice(0, 10)} · Reset shows all loaded history`}</span>
      <a href="https://www.tradingview.com/" target="_blank" rel="noopener noreferrer">Charts by TradingView ↗</a>
    </div>
    {error && data.length > 0 && <div className="chart-warning" role="status">Refresh failed. Showing the last available history. <button onClick={onRetry}>Retry</button></div>}
    {fullscreenError && <div className="chart-warning" role="status">Fullscreen isn’t supported in this browser. You can still zoom and pan here.</div>}
  </div>;
}
