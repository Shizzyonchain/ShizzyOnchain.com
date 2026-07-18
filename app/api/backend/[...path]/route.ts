import { NextRequest, NextResponse } from "next/server";

async function proxy(request: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  const { path } = await context.params;
  const base = process.env.BACKEND_API_URL || "http://api:8000";
  const target = new URL(`/${path.join("/")}`, base);
  request.nextUrl.searchParams.forEach((value, key) => target.searchParams.set(key, value));
  const response = await fetch(target, {
    method: request.method,
    headers: { "Content-Type": request.headers.get("content-type") || "application/json", "X-API-Key": process.env.BACKEND_API_KEY || "" },
    body: request.method === "GET" ? undefined : await request.text(),
    cache: "no-store",
  });
  return new NextResponse(response.body, { status: response.status, headers: { "Content-Type": response.headers.get("content-type") || "application/json" } });
}
export const GET = proxy;
export const POST = proxy;
