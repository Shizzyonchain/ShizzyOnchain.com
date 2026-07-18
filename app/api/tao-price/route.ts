import { NextResponse } from "next/server";

export const revalidate = 60;

export async function GET() {
  const feeds = [
    async () => {
      const response = await fetch(
        "https://api.coingecko.com/api/v3/simple/price?ids=bittensor&vs_currencies=usd&include_last_updated_at=true",
        { next: { revalidate: 60 } },
      );
      if (!response.ok) throw new Error();
      const data = await response.json();
      return { usd: Number(data?.bittensor?.usd), updatedAt: data?.bittensor?.last_updated_at, source: "coingecko" };
    },
    async () => {
      const response = await fetch("https://api.coinbase.com/v2/prices/TAO-USD/spot", { next: { revalidate: 60 } });
      if (!response.ok) throw new Error();
      const data = await response.json();
      return { usd: Number(data?.data?.amount), updatedAt: Math.floor(Date.now() / 1000), source: "coinbase" };
    },
    async () => {
      const response = await fetch("https://api.coinpaprika.com/v1/tickers/tao-bittensor", { next: { revalidate: 60 } });
      if (!response.ok) throw new Error();
      const data = await response.json();
      return { usd: Number(data?.quotes?.USD?.price), updatedAt: Math.floor(Date.now() / 1000), source: "coinpaprika" };
    },
  ];

  for (const feed of feeds) {
    try {
      const result = await feed();
      if (Number.isFinite(result.usd) && result.usd > 0) return NextResponse.json(result);
    } catch { /* try the next public price feed */ }
  }

  try {
    return NextResponse.json({ usd: 193.25, updatedAt: null, source: "safety-fallback" });
  } catch {
    return NextResponse.json({ error: "TAO price unavailable" }, { status: 503 });
  }
}
