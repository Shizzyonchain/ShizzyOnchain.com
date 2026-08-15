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

export async function getInitialTaoUsd(): Promise<number> {
  const feeds = [
    async () => {
      const response = await fetch("https://api.coinbase.com/v2/prices/TAO-USD/spot", {
        next: { revalidate: 60 },
        signal: AbortSignal.timeout(3_000),
      });
      if (!response.ok) throw new Error("Coinbase TAO price unavailable");
      const payload = await response.json();
      return Number(payload?.data?.amount);
    },
    async () => {
      const response = await fetch(
        "https://api.coingecko.com/api/v3/simple/price?ids=bittensor&vs_currencies=usd",
        { next: { revalidate: 60 }, signal: AbortSignal.timeout(3_000) },
      );
      if (!response.ok) throw new Error("CoinGecko TAO price unavailable");
      const payload = await response.json();
      return Number(payload?.bittensor?.usd);
    },
    async () => {
      const response = await fetch("https://api.coinpaprika.com/v1/tickers/tao-bittensor", {
        next: { revalidate: 60 },
        signal: AbortSignal.timeout(3_000),
      });
      if (!response.ok) throw new Error("CoinPaprika TAO price unavailable");
      const payload = await response.json();
      return Number(payload?.quotes?.USD?.price);
    },
  ];

  try {
    return await Promise.any(
      feeds.map(async (feed) => {
        const price = await feed();
        if (!Number.isFinite(price) || price <= 0) throw new Error("Invalid TAO price");
        return price;
      }),
    );
  } catch {
    return 0;
  }
}
