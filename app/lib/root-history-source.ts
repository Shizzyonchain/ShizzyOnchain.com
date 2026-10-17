import "server-only";
import { unstable_cache } from "next/cache";
import type { HistoryPoint } from "./root-comparison";
export const getRootHistory = unstable_cache(async (hotkey: string, utcDay: number) => {
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
    return { day: row.day, timestamp: row.timestamp, twr: row.twr, twr_first_block: row.twr_first_block, nav_per_share: row.nav_per_share ?? null };
  });
  return { data, hotkey, source: "TaoStats daily basket history", completedDaysOnly: true };
}, ["root-comparison-history-v2"], { revalidate: 3600 });

export const getRootRecommendationHistory = unstable_cache(async (hotkey: string, utcDay: number, retryWindow = 0) => {
  void retryWindow;
  const key = process.env.TAOSTATS_API_KEY;
  if (!key) throw new Error("Basket history is not configured.");
  const target = new URL("/v1/validators/baskets/history", "https://api.taostats.io");
  Object.entries({ hotkey, timestamp_start: String(utcDay - 31 * 86400), timestamp_end: String(utcDay - 1), limit: "200", page: "1", order_by: "day", order_dir: "asc" }).forEach(([name, value]) => target.searchParams.set(name, value));
  const response = await fetch(target, { headers: { Authorization: key }, cache: "no-store", signal: AbortSignal.timeout(10_000) });
  if (!response.ok) throw new Error(`Required history provider unavailable (${response.status}); retry preparation later.`);
  const payload = await response.json();
  if (!Array.isArray(payload.data) || payload.pagination?.current_page !== 1 || payload.pagination.next_page !== null) throw new Error("Incomplete history source.");
  const data = payload.data.map((row: HistoryPoint & { hotkey: string }) => {
    if (row.hotkey !== hotkey || !/^\d{4}-\d{2}-\d{2}$/.test(row.day) || !Number.isFinite(Date.parse(row.timestamp)) || row.timestamp.slice(0, 10) !== row.day) throw new Error("Invalid history source.");
    return { day: row.day, timestamp: row.timestamp, twr: row.twr, twr_first_block: row.twr_first_block, nav_per_share: row.nav_per_share ?? null };
  }) as HistoryPoint[];
  return { data, lookedUpAt: Date.now() };
}, ["root-completed-history-daily-v2"], { revalidate: 86400 });
