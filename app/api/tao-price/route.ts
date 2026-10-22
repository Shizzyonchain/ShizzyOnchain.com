import { getTaoQuote } from "../../lib/tao-price-source";
export const dynamic = "force-dynamic";
export async function GET() {
  const quote = await getTaoQuote();
  return quote ? Response.json(quote, { headers: { "Cache-Control": "public, s-maxage=10, stale-while-revalidate=30" } }) : Response.json({ error: "TAO price unavailable" }, { status: 503, headers: { "Cache-Control": "no-store" } });
}
