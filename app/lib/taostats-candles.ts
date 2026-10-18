import type { Candle } from "./chart-data";

export function udfCandles(payload: unknown): Candle[] {
  if (!payload || typeof payload !== "object") return [];
  const p = payload as Record<string, unknown>;
  if (p.s !== "ok" || ![p.t, p.o, p.h, p.l, p.c, p.v].every(Array.isArray)) return [];
  const [t, o, h, l, c, v] = [p.t, p.o, p.h, p.l, p.c, p.v] as unknown[][];
  if ([o, h, l, c, v].some(values => values.length !== t.length)) return [];
  return t.flatMap((time, i) => {
    const values = [time, o[i], h[i], l[i], c[i], v[i]];
    if (values.some(value => typeof value !== "number" || !Number.isFinite(value)) || Number(time) <= 0 || Number(time) > 8_640_000_000_000 || Number(v[i]) < 0) return [];
    return [{ time: new Date(Number(time) * 1000).toISOString(), open: String(o[i]), high: String(h[i]), low: String(l[i]), close: String(c[i]), volume_tao: String(v[i]) }];
  });
}
