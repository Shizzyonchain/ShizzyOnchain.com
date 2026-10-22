import "server-only";

import type { ScreenerRow } from "../dashboard";

export async function getInitialMarkets(): Promise<ScreenerRow[]> {
  const base = process.env.BACKEND_API_URL;
  if (!base) return [];
  try {
    const response = await fetch(new URL("/v1/screener", base), {
      headers: { "X-API-Key": process.env.BACKEND_API_KEY || "" },
      next: { revalidate: 15 },
      signal: AbortSignal.timeout(5_000),
    });
    if (!response.ok) return [];
    const payload = await response.json();
    return Array.isArray(payload.data) ? payload.data : [];
  } catch {
    return [];
  }
}

export { getTaoQuote as getInitialTaoQuote } from "./tao-price-source";
