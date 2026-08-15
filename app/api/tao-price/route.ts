import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

type TaoPrice = {
  usd: number;
  updatedAt: number;
  source: string;
  stale?: boolean;
};

let lastGoodPrice: TaoPrice | null = null;

function priceResponse(result: TaoPrice) {
  return NextResponse.json(result, {
    headers: {
      "Cache-Control": "public, s-maxage=10, stale-while-revalidate=60",
      "CDN-Cache-Control": "public, s-maxage=10, stale-while-revalidate=60",
    },
  });
}

export async function GET() {
  const feeds = [
    {
      source: "coinbase",
      load: async () => {
        const response = await fetch("https://api.coinbase.com/v2/prices/TAO-USD/spot", {
          cache: "no-store",
          signal: AbortSignal.timeout(2_500),
        });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const data = await response.json();
        return Number(data?.data?.amount);
      },
    },
    {
      source: "coingecko",
      load: async () => {
        const response = await fetch(
          "https://api.coingecko.com/api/v3/simple/price?ids=bittensor&vs_currencies=usd&include_last_updated_at=true",
          { cache: "no-store", signal: AbortSignal.timeout(2_500) },
        );
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const data = await response.json();
        return Number(data?.bittensor?.usd);
      },
    },
    {
      source: "coinpaprika",
      load: async () => {
        const response = await fetch("https://api.coinpaprika.com/v1/tickers/tao-bittensor", {
          cache: "no-store",
          signal: AbortSignal.timeout(2_500),
        });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const data = await response.json();
        return Number(data?.quotes?.USD?.price);
      },
    },
  ];
  const failures: string[] = [];

  for (const feed of feeds) {
    try {
      const usd = await feed.load();
      if (!Number.isFinite(usd) || usd <= 0) throw new Error("invalid price");
      lastGoodPrice = {
        usd,
        updatedAt: Math.floor(Date.now() / 1000),
        source: feed.source,
      };
      return priceResponse(lastGoodPrice);
    } catch (error) {
      failures.push(`${feed.source}:${error instanceof Error ? error.name : "UnknownError"}`);
    }
  }

  const now = Math.floor(Date.now() / 1000);
  if (lastGoodPrice && now - lastGoodPrice.updatedAt <= 15 * 60) {
    console.warn(JSON.stringify({
      level: "warn",
      message: "TAO price feeds unavailable; serving recent price",
      failures,
      ageSeconds: now - lastGoodPrice.updatedAt,
    }));
    return priceResponse({ ...lastGoodPrice, stale: true });
  }

  console.error(JSON.stringify({
    level: "error",
    message: "TAO price feeds unavailable",
    failures,
  }));
  return NextResponse.json(
    { error: "TAO price unavailable" },
    { status: 503, headers: { "Cache-Control": "no-store" } },
  );
}
