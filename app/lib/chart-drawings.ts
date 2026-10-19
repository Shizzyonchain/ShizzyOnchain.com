export type DrawPoint = { time: number; price: number };
export type ChartDrawing = { kind: "level" | "trend" | "circle" | "brush"; start: DrawPoint; end?: DrawPoint; points?: DrawPoint[]; color?: string; width?: number };
export const drawingColor = (value?: string) => typeof value === "string" && /^#[0-9a-f]{6}$/i.test(value) ? value : "#ffcc66";
const point = (p: DrawPoint) => p && Number.isFinite(p.time) && Number.isFinite(p.price) && p.price > 0;
export function readDrawings(raw: unknown): ChartDrawing[] {
  if (!Array.isArray(raw)) return [];
  return raw.filter((d: ChartDrawing) => d && point(d.start) && (d.kind === "level" || ((d.kind === "trend" || d.kind === "circle") && d.end && point(d.end)) || (d.kind === "brush" && Array.isArray(d.points) && d.points.length >= 2 && d.points.length <= 1024 && d.points.every(point)))).slice(-40).map(d => ({ ...d, color: drawingColor(d.color), width: [1,2,3,4,5].includes(d.width) ? d.width : 3 }));
}
// Fractional times preserve freehand loops and points between candle centers.
export function logicalForTime(times: number[], time: number): number {
  if (times.length < 2) return 0;
  let low = 0, high = times.length - 1;
  while (low + 1 < high) { const middle = (low + high) >> 1; if (times[middle] <= time) low = middle; else high = middle; }
  if (time <= times[0]) low = 0;
  else if (time >= times.at(-1)!) low = times.length - 2;
  return low + (time - times[low]) / (times[low + 1] - times[low]);
}
export function timeForLogical(times: number[], logical: number): number {
  if (times.length < 2) return times[0] || 0;
  const left = Math.max(0, Math.min(times.length - 2, Math.floor(logical)));
  return times[left] + (logical - left) * (times[left + 1] - times[left]);
}
