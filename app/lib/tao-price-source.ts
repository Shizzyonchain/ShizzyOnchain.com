import "server-only";
import { getCache } from "@vercel/functions";
import { quoteUsable, type TaoQuote } from "./fx-price";
let memory: TaoQuote | null = null;
let pending: Promise<TaoQuote | null> | null = null;

export async function getTaoQuote(): Promise<TaoQuote | null> {
  const cache = getCache({ namespace: "tao-usd-reference-v1" });
  let cached: TaoQuote | null = memory;
  try {
    const value = await cache.get("quote") as TaoQuote | null;
    if (quoteUsable(value) && (!cached || value!.updatedAt > cached.updatedAt)) cached = value;
  } catch { /* Cache is optional locally and during transient platform failures. */ }
  if (quoteUsable(cached) && Date.now() - cached!.updatedAt * 1000 < 30_000) return cached;
  if (pending) return pending;
  pending = (async () => {
    const read = async (source: string, url: string, extract: (data: Record<string, unknown>) => { usd: number; updatedAt?: number }) => {
      const response = await fetch(url, { cache: "no-store", signal: AbortSignal.timeout(1800) });
      if (!response.ok) throw new Error("Quote provider unavailable");
      const parsed = extract(await response.json());
      const quote = { ...parsed, source, updatedAt: parsed.updatedAt ?? Math.floor(Date.now() / 1000) };
      if (!quoteUsable(quote) || Date.now() - quote.updatedAt * 1000 > 180_000) throw new Error("Invalid or old quote");
      return quote;
    };
    let quote: TaoQuote;
    try {
      quote = await read("coinbase", "https://api.coinbase.com/v2/prices/TAO-USD/spot", data => ({ usd: Number((data.data as { amount?: string })?.amount) }));
    } catch {
      try {
        quote = await Promise.any([
          read("coingecko", "https://api.coingecko.com/api/v3/simple/price?ids=bittensor&vs_currencies=usd&include_last_updated_at=true", data => { const value = data.bittensor as { usd?: number; last_updated_at?: number }; return { usd: Number(value?.usd), updatedAt: Number(value?.last_updated_at) }; }),
          read("coinpaprika", "https://api.coinpaprika.com/v1/tickers/tao-bittensor", data => ({ usd: Number((data.quotes as { USD?: { price?: number } })?.USD?.price), updatedAt: Date.parse(String(data.last_updated)) / 1000 })),
        ]);
      } catch { return quoteUsable(cached) ? { ...cached!, stale: true } : null; }
    }
    memory = quote;
    try { await cache.set("quote", quote, { ttl: 900 }); } catch { /* Warm memory still retains the original timestamp. */ }
    return quote;
  })().finally(() => { pending = null; });
  return pending;
}
