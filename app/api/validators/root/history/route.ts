import { NextRequest, NextResponse } from "next/server";
import { unstable_cache } from "next/cache";
import { getStandaloneValidators } from "../../../../lib/standalone-validators";
import type { HistoryPoint } from "../../../../lib/root-comparison";

const history = unstable_cache(async (hotkey: string, utcDay: number) => {
  const key = process.env.TAOSTATS_API_KEY;
  if (!key) throw new Error("Basket history is not configured.");
  const target = new URL("/v1/validators/baskets/history", "https://api.taostats.io");
  Object.entries({ hotkey, timestamp_start: String(utcDay - 91 * 86400), timestamp_end: String(utcDay - 1), limit: "200", page: "1", order_by: "day", order_dir: "asc" }).forEach(([name, value]) => target.searchParams.set(name, value));
  const response = await fetch(target, { headers: { Authorization: key }, next: { revalidate: 3600 }, signal: AbortSignal.timeout(10_000) });
  if (!response.ok) throw new Error(response.status === 429 ? "History provider is rate limited. Please try later." : "Basket history source is unavailable.");
  const payload = await response.json();
  if (!Array.isArray(payload.data) || payload.pagination?.current_page !== 1 || payload.pagination.next_page !== null) throw new Error("Incomplete basket history. No partial comparison generated.");
  const data: HistoryPoint[] = payload.data.map((row: HistoryPoint & { hotkey: string }) => {
    if (row.hotkey !== hotkey || !/^\d{4}-\d{2}-\d{2}$/.test(row.day) || !Number.isFinite(Date.parse(row.timestamp)) || row.timestamp.slice(0, 10) !== row.day) throw new Error("Invalid daily basket history.");
    return { day: row.day, timestamp: row.timestamp, twr: row.twr, twr_first_block: row.twr_first_block };
  });
  return { data, hotkey, source: "TaoStats daily basket history", completedDaysOnly: true };
}, ["root-comparison-history-v1"], { revalidate: 3600 });

export async function GET(request: NextRequest) {
  const hotkey = request.nextUrl.searchParams.get("hotkey") || "";
  if (!/^[1-9A-HJ-NP-Za-km-z]{46,50}$/.test(hotkey)) return NextResponse.json({ error: "Invalid validator hotkey." }, { status: 400 });
  try {
    if (!(await getStandaloneValidators()).rows.some(row => row.hotkey === hotkey)) return NextResponse.json({ error: "History comparison is limited to listed parent/standalone validators." }, { status: 404 });
    const day = Math.floor(Date.now() / 86400_000) * 86400;
    return NextResponse.json(await history(hotkey, day), { headers: { "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=600" } });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "History unavailable." }, { status: 503, headers: { "Cache-Control": "no-store" } });
  }
}
