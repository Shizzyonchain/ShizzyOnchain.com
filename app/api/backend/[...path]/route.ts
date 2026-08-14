import { NextRequest, NextResponse } from "next/server";

// Keep the API relay close to the Render service in Oregon. Routing these
// requests through Vercel's default Virginia region caused intermittent 502s
// even while the Render origin was healthy.
export const preferredRegion = "sfo1";

async function proxy(request: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  const requestId = crypto.randomUUID();
  const startedAt = performance.now();
  const { path } = await context.params;
  const base = process.env.BACKEND_API_URL || "http://api:8000";
  const target = new URL(`/${path.join("/")}`, base);
  request.nextUrl.searchParams.forEach((value, key) => target.searchParams.set(key, value));
  const endpoint = path.at(-1);
  const isMarketSnapshot = request.method === "GET" && (endpoint === "candles" || endpoint === "screener");
  try {
    const response = await fetch(target, {
      method: request.method,
      headers: { "Content-Type": request.headers.get("content-type") || "application/json", "X-API-Key": process.env.BACKEND_API_KEY || "", "X-Request-Id": requestId },
      body: request.method === "GET" ? undefined : await request.text(),
      cache: isMarketSnapshot ? "force-cache" : "no-store",
      signal: AbortSignal.timeout(isMarketSnapshot ? 15_000 : 8_000),
      ...(isMarketSnapshot ? { next: { revalidate: 5 } } : {}),
    });
    const upstreamMs = Math.round(performance.now() - startedAt);
    return new NextResponse(response.body, { status: response.status, headers: {
      "Content-Type": response.headers.get("content-type") || "application/json",
      "Server-Timing": `render;dur=${upstreamMs}`,
      "X-Request-Id": requestId,
      "X-Upstream-Duration-Ms": String(upstreamMs),
      ...(isMarketSnapshot ? {
        "Cache-Control": "public, s-maxage=5, stale-while-revalidate=60",
        "CDN-Cache-Control": "public, s-maxage=5, stale-while-revalidate=60",
      } : {}),
    } });
  } catch (error) {
    const upstreamMs = Math.round(performance.now() - startedAt);
    console.error("Render API request failed", {
      requestId,
      path: target.pathname,
      upstreamMs,
      error: error instanceof Error ? error.name : "UnknownError",
    });
    return NextResponse.json(
      { error: "Market data service timed out", request_id: requestId },
      { status: 504, headers: {
        "Cache-Control": "no-store",
        "Server-Timing": `render;dur=${upstreamMs}`,
        "X-Request-Id": requestId,
        "X-Upstream-Duration-Ms": String(upstreamMs),
      } },
    );
  }
}
export const GET = proxy;
export const POST = proxy;
