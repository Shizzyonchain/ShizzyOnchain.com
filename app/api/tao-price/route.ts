import { NextResponse } from "next/server";

export const revalidate = 60;

export async function GET() {
  try {
    const response = await fetch(
      "https://api.coingecko.com/api/v3/simple/price?ids=bittensor&vs_currencies=usd&include_last_updated_at=true",
      { next: { revalidate: 60 } },
    );
    if (!response.ok) throw new Error("TAO price feed unavailable");
    const data = await response.json();
    const usd = Number(data?.bittensor?.usd);
    if (!Number.isFinite(usd) || usd <= 0) throw new Error("Invalid TAO price");
    return NextResponse.json({ usd, updatedAt: data.bittensor.last_updated_at, source: "coingecko" });
  } catch {
    return NextResponse.json({ error: "TAO price unavailable" }, { status: 503 });
  }
}
