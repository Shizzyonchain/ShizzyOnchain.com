import "server-only";
import { unstable_cache } from "next/cache";
type Seat = { hotkey: string; netuid: number; active: boolean; validator_permit: boolean; timestamp: string; block_number: number };
export const getRootOperation = unstable_cache(async () => {
  const key = process.env.TAOSTATS_API_KEY;
  if (!key) throw new Error("Root status unavailable");
  const response = await fetch("https://api.taostats.io/v1/subnets/metagraph?netuid=0&limit=256", { headers: { Authorization: key }, next: { revalidate: 1800 }, signal: AbortSignal.timeout(8000) });
  if (!response.ok) throw new Error("Root metagraph unavailable");
  const payload = await response.json();
  const rows = payload.data as Seat[];
  if (!Array.isArray(rows) || !rows.length || payload.pagination?.next_page !== null || rows.some(row => row.netuid !== 0) || new Set(rows.map(row => row.hotkey)).size !== rows.length) throw new Error("Incomplete root metagraph");
  return rows;
}, ["root-current-permits-v1"], { revalidate: 1800 });
