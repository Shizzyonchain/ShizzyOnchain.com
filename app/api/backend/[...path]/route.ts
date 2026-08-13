import { NextRequest, NextResponse } from "next/server";

// Keep the API relay close to the Render service in Oregon. Routing these
// requests through Vercel's default Virginia region caused intermittent 502s
// even while the Render origin was healthy.
export const preferredRegion = "sfo1";

async function proxy(request: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  const { path } = await context.params;
  const base = process.env.BACKEND_API_URL || "http://api:8000";
  const target = new URL(`/${path.join("/")}`, base);
  request.nextUrl.searchParams.forEach((value, key) => target.searchParams.set(key, value));
  const endpoint = path.at(-1);
  const isMarketSnapshot = request.method === "GET" && (endpoint === "candles" || endpoint === "screener");
  const response = await fetch(target, {
    method: request.method,
    headers: { "Content-Type": request.headers.get("content-type") || "application/json", "X-API-Key": process.env.BACKEND_API_KEY || "" },
    body: request.method === "GET" ? undefined : await request.text(),
    cache: isMarketSnapshot ? "force-cache" : "no-store",
    ...(isMarketSnapshot ? { next: { revalidate: 20 } } : {}),
  });
  return new NextResponse(response.body, { status: response.status, headers: {
    "Content-Type": response.headers.get("content-type") || "application/json",
    ...(isMarketSnapshot ? {
      "Cache-Control": "public, s-maxage=20, stale-while-revalidate=60",
      "CDN-Cache-Control": "public, s-maxage=20, stale-while-revalidate=60",
    } : {}),
  } });
}
export const GET = proxy;
export const POST = proxy;
