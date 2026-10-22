import "server-only";
import { unstable_cache } from "next/cache";
import { getTaoQuote } from "./tao-price-source";

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

// Cache the complete quote, including its original check time. This keeps ISR
// pages fast without stamping an old provider response as a fresh quote.
export const getInitialTaoQuote = unstable_cache(getTaoQuote, ["initial-tao-usd-reference-v1"], { revalidate: 30 });
