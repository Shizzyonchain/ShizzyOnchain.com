"use client";

import { useCallback, useEffect, useEffectEvent, useMemo, useRef, useState, type PointerEvent, type RefObject } from "react";
import { createPortal } from "react-dom";
import type { IChartApi, ISeriesApi, Logical, UTCTimestamp } from "lightweight-charts";
import type { PriceBar } from "./lib/chart-data";
import { drawingColor, logicalForTime, readDrawings, timeForLogical, type ChartDrawing as Drawing, type DrawPoint as Point } from "./lib/chart-drawings";

type Tool = "pan" | "select" | Drawing["kind"];
type XY = { x: number; y: number };
type Projection = { left: number; top: number; width: number; height: number; shapes: { index: number; drawing: Drawing; path: string; handles: XY[] }[] };
type Gesture = { origin: Point; originXY: XY; points: Point[]; index: number; operation: "draw" | "move" | "start" | "end"; original?: Drawing };
const colors = ["#ffcc66", "#ffffff", "#23d18b", "#ff5263", "#46bfff", "#c28cff"];
const labels = { trend: "Trend line", level: "Price level", circle: "Circle", brush: "Freehand" };
const emptyProjection: Projection = { left: 0, top: 0, width: 0, height: 0, shapes: [] };

export function ChartDrawingTools({ chartRef, hostRef, series, bars, storageId, currency, appearance, mode }: {
  chartRef: RefObject<IChartApi | null>; hostRef: RefObject<HTMLDivElement | null>;
  series: RefObject<{ candles: ISeriesApi<"Candlestick">; line: ISeriesApi<"Line"> } | null>;
  bars: PriceBar[]; storageId: string; currency: string; appearance: string; mode: "candles" | "line";
}) {
  const storageKey = `shizzy:chart-drawings:v1:${storageId}:${currency}`;
  const [saved, setSaved] = useState<{ key: string; items: Drawing[] }>({ key: "", items: [] });
  const [tool, setTool] = useState<Tool>("pan");
  const [anchor, setAnchor] = useState<Point | null>(null);
  const [draft, setDraft] = useState<Drawing | null>(null);
  const [color, setColor] = useState("#ffcc66");
  const [width, setWidth] = useState(3);
  const [selected, setSelected] = useState(-1);
  const [editing, setEditing] = useState(-1);
  const [storageFailed, setStorageFailed] = useState(false);
  const [surfaceHost, setSurfaceHost] = useState<HTMLDivElement | null>(null);
  const [projection, setProjection] = useState<Projection>(emptyProjection);
  const gesture = useRef<Gesture | null>(null);
  const times = useMemo(() => bars.map(bar => bar.time), [bars]);
  const items = useMemo(() => saved.key === storageKey ? saved.items : [], [saved, storageKey]);
  const selectedIndex = selected >= 0 && selected < items.length ? selected : -1;
  const drawing = tool !== "pan" && tool !== "select";
  useEffect(() => { const host = hostRef.current; queueMicrotask(() => setSurfaceHost(host)); }, [hostRef]);
  useEffect(() => {
    let items: Drawing[] = [], failed = false;
    try { items = readDrawings(JSON.parse(localStorage.getItem(storageKey) || "[]")); } catch { failed = true; }
    queueMicrotask(() => { setSaved({ key: storageKey, items }); setTool("pan"); setAnchor(null); setDraft(null); setEditing(-1); setSelected(-1); setStorageFailed(failed); });
  }, [storageKey]);
  const update = useCallback((next: Drawing[]) => {
    setSaved({ key: storageKey, items: next });
    try { localStorage.setItem(storageKey, JSON.stringify(next)); setStorageFailed(false); } catch { setStorageFailed(true); }
  }, [storageKey]);
  const plot = () => {
    const host = hostRef.current, chart = chartRef.current, base = series.current?.[mode === "candles" ? "candles" : "line"];
    if (!host || !chart || !base || times.length < 2) return null;
    const canvas = [...host.querySelectorAll("canvas")].sort((a,b) => b.clientWidth * b.clientHeight - a.clientWidth * a.clientHeight)[0];
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect(), outer = host.getBoundingClientRect();
    const firstX = chart.timeScale().timeToCoordinate(times[0] as UTCTimestamp);
    if (firstX === null || !rect.width || !rect.height) return null;
    const firstLogical = Number(chart.timeScale().coordinateToLogical(firstX));
    return { host, chart, base, canvas, rect, left: (rect.left-outer.left)*host.clientWidth/outer.width, top:(rect.top-outer.top)*host.clientHeight/outer.height, firstLogical };
  };
  const xyFor = (point: Point, p: NonNullable<ReturnType<typeof plot>>): XY | null => {
    const x = p.chart.timeScale().logicalToCoordinate((p.firstLogical + logicalForTime(times, point.time)) as Logical);
    const y = p.base.priceToCoordinate(point.price);
    return x === null || y === null ? null : { x:Number(x), y:Number(y) };
  };
  const project = useEffectEvent(() => {
    const p = plot(); if (!p) return;
    const displayed = items.map((item,index) => editing === index && draft ? draft : item);
    if (draft && editing < 0) displayed.push(draft);
    const shapes: Projection["shapes"] = [];
    displayed.forEach((item,index) => {
      const a = xyFor(item.start,p), b = item.end ? xyFor(item.end,p) : null;
      if (!a) return;
      let path = "", handles = [a];
      if (item.kind === "level") { path = `M0 ${a.y}H${p.canvas.clientWidth}`; handles = [{x:p.canvas.clientWidth/2,y:a.y}]; }
      else if (item.kind === "trend" && b) { path = `M${a.x} ${a.y}L${b.x} ${b.y}`; handles = [a,b]; }
      else if (item.kind === "circle" && b) { const radius = Math.hypot(b.x-a.x,b.y-a.y); path = `M${a.x-radius} ${a.y}a${radius} ${radius} 0 1 0 ${radius*2} 0a${radius} ${radius} 0 1 0 ${-radius*2} 0`; handles = [a,b]; }
      else if (item.kind === "brush") { const points = (item.points || []).map(point=>xyFor(point,p)).filter((v): v is XY=>v!==null); path = points.map((point,i)=>`${i?'L':'M'}${point.x} ${point.y}`).join(' '); handles = []; }
      if (path) shapes.push({index,drawing:item,path,handles});
    });
    setProjection({ left:p.left,top:p.top,width:p.canvas.clientWidth,height:p.canvas.clientHeight,shapes });
  });
  // Paint only on data/gesture/viewport changes, not a permanent animation loop.
  useEffect(() => {
    const host = hostRef.current, chart = chartRef.current; if (!host || !chart) return;
    const isCurrentChart = () => chartRef.current === chart;
    let frame = 0;
    const schedule = () => { cancelAnimationFrame(frame); frame = requestAnimationFrame(project); };
    schedule();
    chart.timeScale().subscribeVisibleLogicalRangeChange(schedule);
    host.addEventListener("pointermove",schedule); host.addEventListener("pointerup",schedule); host.addEventListener("wheel",schedule,{passive:true}); host.addEventListener("touchmove",schedule,{passive:true});
    const scroller = host.closest(".market-modal"); scroller?.addEventListener("scroll",schedule,{passive:true});
    const observer = new ResizeObserver(schedule); observer.observe(host);
    return () => { cancelAnimationFrame(frame); observer.disconnect(); scroller?.removeEventListener("scroll",schedule); host.removeEventListener("pointermove",schedule); host.removeEventListener("pointerup",schedule); host.removeEventListener("wheel",schedule); host.removeEventListener("touchmove",schedule); if (isCurrentChart()) chart.timeScale().unsubscribeVisibleLogicalRangeChange(schedule); };
  }, [items, draft, editing, bars, mode, hostRef, chartRef, appearance]);
  useEffect(() => { chartRef.current?.applyOptions({handleScroll:{pressedMouseMove:!drawing&&tool!=="select",horzTouchDrag:!drawing&&tool!=="select"}}); }, [chartRef,drawing,tool,appearance,bars]);
  const location = (event: PointerEvent<SVGSVGElement>) => {
    const p = plot(); if (!p) return null;
    const x = (event.clientX-p.rect.left)*p.canvas.clientWidth/p.rect.width, y = (event.clientY-p.rect.top)*p.canvas.clientHeight/p.rect.height;
    const logical = p.chart.timeScale().coordinateToLogical(x), price = p.base.coordinateToPrice(y);
    if (logical===null || price===null || !Number.isFinite(price) || price<=0) return null;
    return { point:{time:timeForLogical(times,Number(logical)-p.firstLogical),price:Number(price)},xy:{x,y} };
  };
  const chooseTool = (next: Tool) => { setTool(next);setAnchor(null);setDraft(null);setEditing(-1);setSelected(-1);gesture.current=null; };
  const selectDrawing = (index: number) => { setSelected(index);setTool("select");setColor(drawingColor(items[index]?.color));setWidth(items[index]?.width||3); };
  const style = (next: {color?: string;width?:number}) => {
    if (next.color) setColor(next.color); if (next.width) setWidth(next.width);
    if (selectedIndex>=0) update(items.map((item,index)=>index===selectedIndex?{...item,...next}:item));
  };
  const buildDraft = (g: Gesture, point: Point): Drawing => {
    if (g.operation!=="draw" && g.original) {
      if (g.operation==="start") return {...g.original,start:point};
      if (g.operation==="end") return {...g.original,end:point};
      const dt=point.time-g.origin.time, dp=point.price-g.origin.price;
      const shift=(p:Point)=>({time:p.time+dt,price:Math.max(1e-12,p.price+dp)});
      return {...g.original,start:shift(g.original.start),end:g.original.end?shift(g.original.end):undefined,points:g.original.points?.map(shift)};
    }
    return {kind:tool as Drawing["kind"],start:anchor||g.origin,end:point,points:tool==="brush"?[...g.points]:undefined,color,width};
  };
  const finish = (item: Drawing, index=-1) => {
    if ((item.kind==="trend" && item.start.time===item.end?.time) || (item.kind==="brush" && (item.points?.length||0)<2)) return;
    if (index<0 && items.length>=40) return;
    update(index<0?[...items,item]:items.map((old,i)=>i===index?item:old));
    setSelected(index<0?items.length:index);setColor(drawingColor(item.color));setWidth(item.width||3);setTool("select");setAnchor(null);setDraft(null);setEditing(-1);
  };
  const pointerDown = (event: PointerEvent<SVGSVGElement>) => {
    if (!event.isPrimary || event.button!==0) return;
    const at=location(event);if(!at)return;
    const target=event.target as SVGElement, index=Number(target.getAttribute("data-index"));
    const hit=target.hasAttribute("data-index") && Number.isInteger(index) && items[index];
    if(!drawing && !hit)return;
    // Freeze the chart before it can interpret grabbing a drawing as panning.
    // The Select mode keeps it frozen until the user returns to Pan/Done.
    chartRef.current?.applyOptions({handleScroll:{pressedMouseMove:false,horzTouchDrag:false}});
    event.preventDefault();event.stopPropagation();event.currentTarget.setPointerCapture(event.pointerId);
    if(hit && !drawing) { selectDrawing(index);setEditing(index); }
    // A forgiving handle hit area works even when the transparent line hit-path
    // receives the event just beside a small visible endpoint (especially touch).
    const handles = hit ? projection.shapes.find(shape=>shape.index===index)?.handles || [] : [];
    const nearbyHandle = handles.findIndex(point=>Math.hypot(point.x-at.xy.x,point.y-at.xy.y)<=18);
    const handle = target.getAttribute("data-handle") || (nearbyHandle===0?"start":nearbyHandle===1?"end":null);
    const operation = drawing ? "draw" : (handle==="start"?"start":handle==="end"?"end":"move");
    gesture.current={origin:at.point,originXY:at.xy,points:[at.point],index:hit&&!drawing?index:-1,operation,original:hit?items[index]:undefined};
    if(drawing)setDraft({kind:tool as Drawing["kind"],start:anchor||at.point,end:at.point,points:tool==="brush"?[at.point]:undefined,color,width});
  };
  const pointerMove = (event: PointerEvent<SVGSVGElement>) => {
    const at=location(event);if(!at)return;
    const g=gesture.current;
    if(g){
      if(tool==="brush"){if(g.points.length<1024)g.points.push(at.point);else g.points[g.points.length-1]=at.point;}
      setDraft(buildDraft(g,at.point));
    } else if(anchor && (tool==="trend"||tool==="circle"))setDraft({kind:tool,start:anchor,end:at.point,color,width});
  };
  const pointerUp = (event: PointerEvent<SVGSVGElement>) => {
    const g=gesture.current;gesture.current=null; if(!g)return;
    event.preventDefault();event.stopPropagation();
    if(event.currentTarget.hasPointerCapture(event.pointerId))event.currentTarget.releasePointerCapture(event.pointerId);
    const at=location(event);if(!at){setDraft(null);setEditing(-1);return;}
    const moved=Math.hypot(at.xy.x-g.originXY.x,at.xy.y-g.originXY.y)>3;
    if(g.operation!=="draw"){if(moved)finish(buildDraft(g,at.point),g.index);else{setDraft(null);setEditing(-1);}return;}
    if(tool==="brush"){g.points.push(at.point);if(g.points.length>1024)g.points.splice(1023);finish(buildDraft(g,at.point));}
    else if(tool==="level" || moved || anchor)finish(buildDraft(g,at.point));
    else {setAnchor(at.point);setDraft(null);}
  };
  const selectedDrawing=selectedIndex>=0?items[selectedIndex]:null;
  const palette=()=><div className="chart-drawing-colors">
    <label>Style for <select aria-label="Drawing to recolor" value={selectedIndex} onChange={event=>{const index=Number(event.target.value);if(index>=0)selectDrawing(index);else setSelected(-1);}}><option value={-1}>New drawing</option>{items.map((item,index)=><option key={index} value={index}>{labels[item.kind]} {index+1}</option>)}</select></label>
    {colors.map(value=><button key={value} type="button" aria-label={`Drawing color ${value}`} aria-pressed={color===value} style={{backgroundColor:value}} onClick={()=>style({color:value})}/>)}
    <label className="chart-custom-color">Custom<input type="color" aria-label="Custom drawing color" value={color} onChange={event=>style({color:event.target.value})}/></label>
    <select aria-label="Drawing thickness" value={width} onChange={event=>style({width:Number(event.target.value)})}>{[1,2,3,4,5].map(value=><option key={value} value={value}>{value}px</option>)}</select>
  </div>;
  const overlay=surfaceHost?createPortal(<div className="chart-annotation-layer">
    <svg className={`chart-annotation-svg ${drawing?'is-drawing':''}`} style={{left:projection.left,top:projection.top,width:projection.width,height:projection.height}} viewBox={`0 0 ${projection.width||1} ${projection.height||1}`} aria-label="Chart drawings" role="group"
      onPointerDown={pointerDown} onPointerMove={pointerMove} onPointerUp={pointerUp} onPointerCancel={()=>{gesture.current=null;setDraft(null);setEditing(-1);}}>
      {drawing&&<rect width="100%" height="100%" fill="transparent" pointerEvents="all"/>}
      {projection.shapes.map(shape=><g key={shape.index}>
        <path d={shape.path} fill="none" stroke={drawingColor(shape.drawing.color)} strokeWidth={shape.drawing.width||3} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={shape.drawing.kind==="level"?"6 4":undefined} pointerEvents="none"/>
        {shape.drawing.kind==="level" && <text x={projection.width-6} y={Math.max(14,Math.min(projection.height-6,shape.handles[0].y-7))} textAnchor="end" fill={drawingColor(shape.drawing.color)} fontSize={11} pointerEvents="none">{currency==="usd"?"$":"τ "}{shape.drawing.start.price.toLocaleString("en-US",{maximumSignificantDigits:7})}</text>}
        {!drawing && shape.index<items.length && <path d={shape.path} fill="none" stroke="transparent" strokeWidth={Math.max(16,(shape.drawing.width||3)+10)} pointerEvents="stroke" data-index={shape.index} role="button" tabIndex={0} aria-label={`Select ${labels[shape.drawing.kind]} ${shape.index+1}`} onKeyDown={event=>{if(event.key==='Enter'||event.key===' '){event.preventDefault();selectDrawing(shape.index);}}}/>}
        {selectedIndex===shape.index&&!drawing&&shape.handles.map((point,index)=><circle key={index} cx={point.x} cy={point.y} r={7} fill="#000" stroke={drawingColor(shape.drawing.color)} strokeWidth={2} pointerEvents="all" data-index={shape.index} data-handle={index===0?'start':'end'} className="drawing-handle"/>)}
      </g>)}
    </svg>
  </div>,surfaceHost):null;
  return <div className="chart-drawing-tools">
    <div className="chart-study-toolbar" role="group" aria-label="Chart drawing tools">
      <button type="button" aria-pressed={drawing} className={drawing?'active':''} disabled={bars.length<2||items.length>=40} onClick={()=>chooseTool(drawing?'pan':'brush')}>Draw ✎</button>
      {([["pan","Pan"],["select","Select"],["trend","Trend line"],["level","Price level"],["circle","Circle"],["brush","Freehand"]] as const).map(([value,label])=><button key={value} type="button" aria-pressed={tool===value} className={tool===value?'active':''} disabled={value!=='pan'&&value!=='select'&&(bars.length<2||items.length>=40)} onClick={()=>chooseTool(value)}>{label}</button>)}
      <button type="button" disabled={!items.length&&!draft&&!anchor} onClick={()=>{if(!draft&&!anchor)update(items.slice(0,-1));chooseTool('pan');}}>Undo</button>
      <button type="button" disabled={selectedIndex<0} onClick={()=>{update(items.filter((_,index)=>index!==selectedIndex));chooseTool('pan');}}>Delete selected</button>
      <button type="button" disabled={!items.length} onClick={()=>{update([]);chooseTool('pan');}}>Clear drawings</button>
      <button type="button" onClick={()=>chooseTool('pan')}>Done drawing</button>
    </div>
    {palette()}
    <p className="chart-drawing-hint" role="status">{tool==='brush'?'Drag freely to draw. Release to edit color and thickness above the chart.':tool==='circle'?'Drag from the center outward to draw a circle, or tap center then edge.':tool==='trend'?'Drag a line, or tap its two ends. A live preview follows your pointer.':tool==='level'?'Tap or drag to place a price level.':selectedDrawing?'Drawing selected. Grab its line to move it, or drag an end handle to reshape it. Color and thickness are above the chart. Choose Pan or Done drawing to move the chart.':`${items.length}/40 drawings · ${currency.toUpperCase()} · saved on this device. Grab a drawing to edit it.`}{storageFailed?' Storage unavailable; changes last for this session.':''}</p>
    {overlay}
  </div>;
}
