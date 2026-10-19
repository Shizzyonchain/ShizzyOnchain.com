"use client";

import { useCallback, useEffect, useMemo, useRef, useState, type PointerEvent, type RefObject } from "react";
import { createPortal } from "react-dom";
import { LineSeries, LineStyle, type IChartApi, type ISeriesApi, type UTCTimestamp } from "lightweight-charts";
import type { PriceBar } from "./lib/chart-data";

type Point = { time: number; price: number };
type Drawing = { kind: "level" | "trend"; start: Point; end?: Point; color?: string };
const validPoint = (p: Point) => p && Number.isFinite(p.time) && Number.isFinite(p.price) && p.price > 0;
const validColor = (color?: string) => typeof color === "string" && /^#[0-9a-f]{6}$/i.test(color);
const defaultColor = "#ffcc66";
const colors = ["#ffcc66", "#ffffff", "#23d18b", "#ff5263", "#46bfff", "#c28cff"];

export function ChartDrawingTools({ chartRef, hostRef, series, bars, storageId, currency, appearance, mode }: {
  chartRef: RefObject<IChartApi | null>; hostRef: RefObject<HTMLDivElement | null>;
  series: RefObject<{ candles: ISeriesApi<"Candlestick">; line: ISeriesApi<"Line"> } | null>;
  bars: PriceBar[]; storageId: string; currency: string; appearance: string; mode: "candles" | "line";
}) {
  const storageKey = `shizzy:chart-drawings:v1:${storageId}:${currency}`;
  const [saved, setSaved] = useState<{ key: string; items: Drawing[] }>({ key: "", items: [] });
  const [tool, setTool] = useState<"pan" | "level" | "trend">("pan");
  const [anchor, setAnchor] = useState<Point | null>(null);
  const [color, setColor] = useState(defaultColor);
  const [selected, setSelected] = useState(-1);
  const [storageFailed, setStorageFailed] = useState(false);
  const [message, setMessage] = useState("");
  const [surfaceHost, setSurfaceHost] = useState<HTMLDivElement | null>(null);
  useEffect(() => { const host = hostRef.current; queueMicrotask(() => setSurfaceHost(host)); }, [hostRef]);
  const down = useRef<{ point: Point; x: number; y: number } | null>(null);
  const items = useMemo(() => saved.key === storageKey ? saved.items : [], [saved, storageKey]);
  const selectedIndex = selected < items.length ? selected : -1;
  useEffect(() => {
    let items: Drawing[] = [], failed = false;
    try {
      const parsed = JSON.parse(localStorage.getItem(storageKey) || "[]");
      if (Array.isArray(parsed)) items = parsed.filter((d: Drawing) => d && validPoint(d.start) && (d.kind === "level" || (d.kind === "trend" && d.end && validPoint(d.end) && d.end.time !== d.start.time))).slice(-40).map(d => ({ ...d, color: validColor(d.color) ? d.color : defaultColor }));
    } catch { failed = true; }
    queueMicrotask(() => { setSaved({ key: storageKey, items }); setTool("pan"); setAnchor(null); setSelected(-1); setStorageFailed(failed); });
  }, [storageKey]);
  const update = useCallback((next: Drawing[]) => {
    setSaved({ key: storageKey, items: next });
    try { localStorage.setItem(storageKey, JSON.stringify(next)); setStorageFailed(false); } catch { setStorageFailed(true); }
  }, [storageKey]);

  useEffect(() => {
    const chart = chartRef.current, base = series.current?.[mode === "candles" ? "candles" : "line"];
    if (!chart || !base) return;
    const isCurrentChart = () => chartRef.current === chart;
    const levels = items.filter(d => d.kind === "level").map(d => base.createPriceLine({ price: d.start.price, color: d.color || defaultColor, lineWidth: 3, lineStyle: LineStyle.Dashed, axisLabelVisible: true, title: "Level" }));
    const lines: ISeriesApi<"Line">[] = [];
    for (const drawing of items.filter(d => d.kind === "trend")) {
      const a = drawing.start, b = drawing.end!;
      const points = bars.filter(bar => bar.time >= Math.min(a.time, b.time) && bar.time <= Math.max(a.time, b.time)).map(bar => ({ time: bar.time as UTCTimestamp, value: a.price + (b.price - a.price) * (bar.time - a.time) / (b.time - a.time) }));
      if (points.length < 2) continue;
      const line = chart.addSeries(LineSeries, { color: drawing.color || defaultColor, lineWidth: 3, priceLineVisible: false, lastValueVisible: false, crosshairMarkerVisible: false, autoscaleInfoProvider: () => null });
      line.setData(points); lines.push(line);
    }
    const marker = anchor ? base.createPriceLine({ price: anchor.price, color, lineStyle: LineStyle.Dotted, lineWidth: 2, axisLabelVisible: true, title: "Start" }) : null;
    return () => { if (!isCurrentChart()) return; for (const level of levels) base.removePriceLine(level); if (marker) base.removePriceLine(marker); for (const line of lines) chart.removeSeries(line); };
  }, [items, bars, appearance, mode, anchor, color, chartRef, series]);

  useEffect(() => {
    chartRef.current?.applyOptions({ handleScroll: { pressedMouseMove: tool === "pan", horzTouchDrag: tool === "pan" }, crosshair: { mode: tool === "pan" ? 1 : 0 } });
  }, [chartRef, tool, appearance, bars]);
  const chooseTool = (next: typeof tool) => { setTool(next); setAnchor(null); setSelected(-1); setMessage(""); down.current = null; };
  const pointAt = (event: PointerEvent<HTMLDivElement>): Point | null => {
    const host = hostRef.current, chart = chartRef.current;
    if (!host || !chart || !bars.length) return null;
    // Measure the plot canvas itself, excluding layout gutters and price axes.
    const canvas = [...host.querySelectorAll("canvas")].sort((a, b) => b.clientWidth * b.clientHeight - a.clientWidth * a.clientHeight)[0];
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();
    const x = (event.clientX - rect.left) * canvas.clientWidth / rect.width;
    const y = (event.clientY - rect.top) * canvas.clientHeight / rect.height;
    if (x < 0 || x >= canvas.clientWidth || y < 0 || y >= canvas.clientHeight) return null;
    const price = series.current?.[mode === "candles" ? "candles" : "line"].coordinateToPrice(y);
    const logical = chart.timeScale().coordinateToLogical(x);
    if (price == null || price <= 0 || !Number.isFinite(price) || logical == null) return null;
    const bar = bars[Math.max(0, Math.min(bars.length - 1, Math.round(logical)))];
    const time = chart.timeScale().coordinateToTime(x);
    return { time: typeof time === "number" ? time : bar.time, price };
  };
  const finish = (start: Point, end?: Point) => {
    if (items.length >= 40) return;
    if (tool === "trend" && (!end || end.time === start.time)) { setMessage("Choose an end point at a different candle."); return; }
    update([...items, { kind: tool === "level" ? "level" : "trend", start, end, color }]);
    setSelected(items.length); setAnchor(null); setTool("pan"); setMessage("");
  };
  const recolor = (next: string) => {
    if (!validColor(next)) return;
    setColor(next);
    if (selectedIndex >= 0) update(items.map((item, index) => index === selectedIndex ? { ...item, color: next } : item));
  };
  const overlay = tool !== "pan" && surfaceHost ? createPortal(<div className="chart-drawing-surface" role="application" aria-label="Draw on chart: drag a trend line or tap its two endpoints; tap once for a price level" tabIndex={0}
    onKeyDown={event => { if (event.key === "Escape") { event.stopPropagation(); chooseTool("pan"); } }}
    onPointerDown={event => { if (!event.isPrimary || event.button !== 0) return; event.preventDefault(); const point = pointAt(event); if (!point) return; event.currentTarget.setPointerCapture(event.pointerId); down.current = { point, x: event.clientX, y: event.clientY }; }}
    onPointerCancel={() => { down.current = null; }}
    onPointerUp={event => {
      const first = down.current; down.current = null; if (!first) return;
      const point = pointAt(event); if (!point) return;
      if (tool === "level") finish(point);
      else if (Math.hypot(event.clientX - first.x, event.clientY - first.y) > 8) finish(first.point, point);
      else if (anchor) finish(anchor, point); else { setAnchor(point); setMessage(""); }
    }} /> , surfaceHost) : null;

  return <div className="chart-drawing-tools">
    <div className="chart-study-toolbar" role="group" aria-label="Chart drawing tools">
      <button type="button" aria-pressed={tool !== "pan"} className={tool !== "pan" ? "active" : ""} disabled={!bars.length || items.length >= 40} onClick={() => chooseTool(tool === "pan" ? "trend" : "pan")}>Draw ✎</button>
      {([["pan", "Pan"], ["trend", "Trend line"], ["level", "Price level"]] as const).map(([value, label]) => <button key={value} type="button" aria-pressed={tool === value} className={tool === value ? "active" : ""} disabled={value !== "pan" && (!bars.length || items.length >= 40)} onClick={() => chooseTool(value)}>{label}</button>)}
      <button type="button" disabled={!items.length && !anchor} onClick={() => { if (!anchor) update(items.slice(0, -1)); chooseTool("pan"); }}>Undo</button>
      <button type="button" disabled={!items.length && !anchor} onClick={() => { update([]); chooseTool("pan"); }}>Clear drawings</button>
    </div>
    <div className="chart-drawing-colors"><label>Color for <select aria-label="Drawing to recolor" value={selectedIndex} onChange={event => { const index = Number(event.target.value); setSelected(index); if (items[index]) setColor(items[index].color || defaultColor); }}><option value={-1}>New drawing</option>{items.map((item, index) => <option key={index} value={index}>{item.kind === "level" ? "Price level" : "Trend line"} {index + 1}</option>)}</select></label>
      {colors.map(value => <button key={value} type="button" aria-label={`Drawing color ${value}`} aria-pressed={color === value} style={{ backgroundColor: value }} onClick={() => recolor(value)} />)}
      <label className="chart-custom-color">Custom <input type="color" aria-label="Custom drawing color" value={color} onChange={event => recolor(event.target.value)} /></label>
    </div>
    <p className="chart-drawing-hint" role="status">{message || (tool === "trend" ? anchor ? "Tap the end point at another candle. Pan cancels." : "Drag a trend line, or tap its start and end points. Pan cancels." : tool === "level" ? "Tap the chart to place a horizontal price level." : `${items.length}/40 drawings · ${currency.toUpperCase()} · ${storageFailed ? "session only" : "saved on this device"}`)}{storageFailed ? " · Device storage unavailable; drawings last for this session." : ""}</p>
    {overlay}
  </div>;
}
