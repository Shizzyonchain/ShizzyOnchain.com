import { NextRequest, NextResponse } from "next/server";

// vercel.json pins all functions to sfo1, keeping this relay close to Render's
// Oregon service without relying on deprecated per-route region configuration.

const readableRoutes = [
  /^v1\/screener$/,
  /^v1\/activity$/,
  /^v1\/subnets\/\d+\/candles$/,
  /^v1\/wallets\/jobs\/[a-f0-9]{32}$/,
];

function routeIsAllowed(method: string, pathname: string) {
  if (method === "POST") return pathname === "v1/wallets/jobs";
  return method === "GET" && readableRoutes.some((pattern) => pattern.test(pathname));
}

async function proxy(request: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  const requestId = crypto.randomUUID();
  const startedAt = performance.now();
  const { path } = await context.params;
  const pathname = path.join("/");
  if (!routeIsAllowed(request.method, pathname)) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  const contentLength = Number(request.headers.get("content-length") || 0);
  if (request.method === "POST" && contentLength > 16_384) {
    return NextResponse.json({ error: "Request body too large" }, { status: 413 });
  }
  const requestBody = request.method === "GET" ? undefined : await request.text();
  if (requestBody && new TextEncoder().encode(requestBody).byteLength > 16_384) {
    return NextResponse.json({ error: "Request body too large" }, { status: 413 });
  }
  const base = process.env.BACKEND_API_URL || "http://api:8000";
  const target = new URL(`/${pathname}`, base);
  request.nextUrl.searchParams.forEach((value, key) => target.searchParams.set(key, value));
  const endpoint = path.at(-1);
  const isMarketSnapshot = request.method === "GET" && (endpoint === "candles" || endpoint === "screener");
  try {
    const response = await fetch(target, {
      method: request.method,
      headers: { "Content-Type": request.headers.get("content-type") || "application/json", "X-API-Key": process.env.BACKEND_API_KEY || "", "X-Request-Id": requestId },
      body: requestBody,
      cache: isMarketSnapshot ? "force-cache" : "no-store",
      signal: AbortSignal.timeout(endpoint === "candles" ? 25_000 : isMarketSnapshot ? 15_000 : 8_000),
      ...(isMarketSnapshot ? { next: { revalidate: 5 } } : {}),
    });
    const upstreamMs = Math.round(performance.now() - startedAt);
    if (upstreamMs >= 1_000 || !response.ok) {
      console.warn(JSON.stringify({
        level: response.ok ? "warn" : "error",
        message: "backend relay completed",
        route: pathname,
        method: request.method,
        status: response.status,
        requestId,
        upstreamMs,
      }));
    }
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
    console.error(JSON.stringify({
      level: "error",
      message: "backend relay failed",
      requestId,
      route: pathname,
      method: request.method,
      upstreamMs,
      error: error instanceof Error ? error.name : "UnknownError",
    }));
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
