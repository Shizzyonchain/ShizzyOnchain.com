import { createHmac, randomBytes } from "node:crypto";
import { ipAddress } from "@vercel/functions";

// An instance-local safety net, not a replacement for distributed edge limits.
// The random salt prevents retained keys from identifying a visitor across restarts.
const salt = randomBytes(32);
const buckets = new Map<string, { count: number; end: number }>();
const maximumClients = 4096;
const warnedAt = new Map<RequestGroup, number>();
export const publicRequestLimits = { wallet: 8, activity: 120, research: 240 } as const;
export type RequestGroup = keyof typeof publicRequestLimits;
export function clientKey(request: Request) {
  // Vercel supplies this header; do not accept arbitrary forwarded headers on
  // another host. Local development shares a bucket rather than trusting input.
  return createHmac("sha256", salt).update(process.env.VERCEL ? ipAddress(request) || "unknown" : "local").digest("hex");
}
export function consumeRequest(key: string, limit: number, now = Date.now(), state = buckets) {
  for (const [id, entry] of state) if (entry.end <= now) state.delete(id);
  let entry = state.get(key);
  if (!entry) {
    if (state.size >= maximumClients) return 60; // Never evict active buckets to admit a flood.
    entry = { count: 0, end: now + 60_000 }; state.set(key, entry);
  }
  if (entry.count >= limit) return Math.max(1, Math.ceil((entry.end - now) / 1000));
  entry.count++; return 0;
}
export function requestGuard(request: Request, group: RequestGroup) {
  const retry = consumeRequest(`${group}:${clientKey(request)}`, publicRequestLimits[group]);
  if (!retry) return null;
  // Never log addresses, client keys, job IDs or raw query strings.
  const now = Date.now();
  if (now - (warnedAt.get(group) || 0) >= 60_000) {
    warnedAt.set(group, now);
    console.warn(JSON.stringify({ message: "public request throttled", group, status: 429 }));
  }
  return Response.json({ error: `Too many ${group === "wallet" ? "wallet checks" : "data requests"}. Please wait ${retry} seconds and try again.` }, { status: 429, headers: { "Retry-After": String(retry), "Cache-Control": "no-store" } });
}

export function concurrencyGate(maximum: number) {
  let active = 0;
  return async (load: () => Promise<Response>) => {
    if (active >= maximum) return Response.json({ error: "Wallet checker is busy. Please try again shortly." }, { status: 503, headers: { "Retry-After": "5", "Cache-Control": "no-store" } });
    active++;
    try { return await load(); } finally { active--; }
  };
}

type Cached = { status: number; body: string; headers: [string, string][]; until: number };
export function responseCoalescer(maximumEntries = 128, maximumPending = 16) {
  const pending = new Map<string, Promise<Cached>>();
  const cache = new Map<string, Cached>();
  const response = (value: Cached) => new Response(value.body, { status: value.status, headers: value.headers });
  return async (key: string, load: () => Promise<Response>, successTtl: number) => {
    const now = Date.now();
    for (const [id, entry] of cache) if (entry.until <= now) cache.delete(id);
    const previous = cache.get(key);
    if (previous) return response(previous);
    const active = pending.get(key);
    if (active) return response(await active);
    if (pending.size >= maximumPending) return Response.json({ error: "Data service is busy. Please try again shortly." }, { status: 503, headers: { "Cache-Control": "no-store", "Retry-After": "5" } });
    const task = (async () => {
      const result = await load();
      const value: Cached = { status: result.status, body: await result.text(), headers: Array.from(result.headers.entries()), until: Date.now() + (result.ok ? successTtl : 5000) };
      if (cache.size >= maximumEntries) cache.delete(cache.keys().next().value!);
      cache.set(key, value); return value;
    })();
    pending.set(key, task);
    try { return response(await task); } finally { pending.delete(key); }
  };
}
