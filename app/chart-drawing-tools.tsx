"use client";

import { useCallback, useEffect, useMemo, useState, type RefObject } from "react";
import { LineSeries, LineStyle, type IChartApi, type ISeriesApi, type MouseEventParams, type UTCTimestamp } from "lightweight-charts";
import type { PriceBar } from "./lib/chart-data";

type Point = { time: number; price: number };
type Drawing = { kind: "level" | "trend"; start: Point; end?: Point };
const validPoint = (p: Point) => p && Number.isFinite(p.time) && Number.isFinite(p.price) && p.price > 0;

export function ChartDrawingTools({ chartRef, series, bars, storageId, currency, appearance, mode }: {
  chartRef: RefObject<IChartApi | null>; series: RefObject<{ candles: ISeriesApi<"Candlestick">; line: ISeriesApi<"Line"> } | null>;
  bars: PriceBar[]; storageId: string; currency: string; appearance: string; mode: "candles" | "line";
}) {
  const storageKey = `shizzy:chart-drawings:v1:${storageId}:${currency}`;
  const [saved, setSaved] = useState<{ key: string; items: Drawing[] }>({ key: "", items: [] });
  const [tool, setTool] = useState<"pan" | "level" | "trend">("pan");
  const [anchor, setAnchor] = useState<Point | null>(null);
  const [storageFailed, setStorageFailed] = useState(false);
  const items = useMemo(() => saved.key === storageKey ? saved.items : [], [saved, storageKey]);
  useEffect(() => {
    let items: Drawing[] = [], failed = false;
    try {
      const parsed = JSON.parse(localStorage.getItem(storageKey) || "[]");
      if (Array.isArray(parsed)) items = parsed.filter((d: Drawing) => d && validPoint(d.start) && (d.kind === "level" || (d.kind === "trend" && d.end && validPoint(d.end) && d.end.time !== d.start.time))).slice(-40);
    } catch { failed = true; }
    queueMicrotask(() => { setSaved({ key: storageKey, items }); setTool("pan"); setAnchor(null); setStorageFailed(failed); });
  }, [storageKey]);
  const update = useCallback((next: Drawing[]) => {
    setSaved({ key: storageKey, items: next });
    try { localStorage.setItem(storageKey, JSON.stringify(next)); setStorageFailed(false); } catch { setStorageFailed(true); }
  }, [storageKey]);

  useEffect(() => {
    const chart = chartRef.current, base = series.current?.[mode === "candles" ? "candles" : "line"];
    if (!chart || !base) return;
    const isCurrentChart = () => chartRef.current === chart;
    const levels = items.filter(d => d.kind === "level").map(d => base.createPriceLine({ price: d.start.price, color: "#ffcc66", lineWidth: 2, lineStyle: LineStyle.Dashed, axisLabelVisible: true, title: "Level" }));
    const lines: ISeriesApi<"Line">[] = [];
    for (const drawing of items.filter(d => d.kind === "trend")) {
      const a = drawing.start, b = drawing.end!;
      const points = bars.filter(bar => bar.time >= Math.min(a.time, b.time) && bar.time <= Math.max(a.time, b.time)).map(bar => ({ time: bar.time as UTCTimestamp, value: a.price + (b.price - a.price) * (bar.time - a.time) / (b.time - a.time) }));
      if (points.length < 2) continue;
      const line = chart.addSeries(LineSeries, { color: "#ffcc66", lineWidth: 2, priceLineVisible: false, lastValueVisible: false, crosshairMarkerVisible: false, autoscaleInfoProvider: () => null });
      line.setData(points); lines.push(line);
    }
    const marker = anchor ? base.createPriceLine({ price: anchor.price, color: "#ffcc66", lineStyle: LineStyle.Dotted, axisLabelVisible: true, title: "Start" }) : null;
    return () => { if (!isCurrentChart()) return; for (const level of levels) base.removePriceLine(level); if (marker) base.removePriceLine(marker); for (const line of lines) chart.removeSeries(line); };
  // Ref values are created by the parent chart effect; appearance recreates that chart.
  }, [items, bars, appearance, mode, anchor, chartRef, series]);

  useEffect(() => {
    const chart = chartRef.current;
    if (!chart) return;
    chart.applyOptions({ handleScroll: { pressedMouseMove: tool === "pan", horzTouchDrag: tool === "pan" }, crosshair: { mode: tool === "pan" ? 1 : 0 } });
    const click = (param: MouseEventParams) => {
      if (tool === "pan" || !param.point || typeof param.time !== "number" || !bars.some(bar => bar.time === param.time) || items.length >= 40) return;
      const price = series.current?.[mode === "candles" ? "candles" : "line"].coordinateToPrice(param.point.y);
      if (price == null || !Number.isFinite(price) || price <= 0) return;
      const point = { time: param.time, price };
      if (tool === "level") { update([...items, { kind: "level", start: point }]); setTool("pan"); }
      else if (!anchor) setAnchor(point);
      else if (point.time !== anchor.time) { update([...items, { kind: "trend", start: anchor, end: point }]); setAnchor(null); setTool("pan"); }
    };
    const isCurrentChart = () => chartRef.current === chart;
    chart.subscribeClick(click);
    return () => { if (isCurrentChart()) chart.unsubscribeClick(click); };
  }, [chartRef, series, mode, tool, bars, items, anchor, update, appearance]);

  return <div className="chart-drawing-tools">
    <div className="chart-study-toolbar" role="group" aria-label="Chart drawing tools"><span>Draw</span>
      {([["pan", "Pan"], ["trend", "Trend line"], ["level", "Price level"]] as const).map(([value, label]) => <button key={value} type="button" aria-pressed={tool === value} className={tool === value ? "active" : ""} disabled={value !== "pan" && (!bars.length || items.length >= 40)} onClick={() => { setTool(value); setAnchor(null); }}>{label}</button>)}
      <button type="button" disabled={!items.length && !anchor} onClick={() => { if (anchor) setAnchor(null); else update(items.slice(0, -1)); setTool("pan"); }}>Undo</button>
      <button type="button" disabled={!items.length && !anchor} onClick={() => { update([]); setAnchor(null); setTool("pan"); }}>Clear drawings</button>
    </div>
    <p className="chart-drawing-hint" role="status">{tool === "trend" ? anchor ? "Tap the end point at another candle. Pan cancels." : "Tap a start point, then an end point on the chart." : tool === "level" ? "Tap the chart to place a horizontal price level." : `${items.length}/40 drawings · ${currency.toUpperCase()} · ${storageFailed ? "session only" : "saved on this device"}`}{storageFailed ? " · Device storage unavailable; drawings last for this session." : ""}</p>
  </div>;
}
