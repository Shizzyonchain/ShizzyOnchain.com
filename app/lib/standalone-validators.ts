import "server-only";
import { unstable_cache } from "next/cache";
import { scanChildHotkeys } from "./child-hotkey-storage";
import type { Validator } from "./validator-types";

export const getChildHotkeys = unstable_cache(async () => {
  const endpoint = process.env.SUBTENSOR_HTTP_URL || "https://entrypoint-finney.opentensor.ai";
  return scanChildHotkeys(endpoint);
}, ["finalized-child-hotkeys-v1"], { revalidate: 1800 });

export const getStandaloneValidators = unstable_cache(async () => {
  const key = process.env.TAOSTATS_API_KEY;
  if (!key) throw new Error("Validator data is not configured for this environment.");
  const [index, all] = await Promise.all([getChildHotkeys(), (async () => {
    const rows: Validator[] = [];
    for (let page = 1; page <= 12; page++) {
      const url = new URL("/v1/validators", "https://api.taostats.io");
      Object.entries({ order_by: "rank", order_dir: "asc", limit: "200", page: String(page) }).forEach(([name, value]) => url.searchParams.set(name, value));
      const response = await fetch(url, { headers: { Authorization: key }, next: { revalidate: 3600 }, signal: AbortSignal.timeout(8_000) });
      if (!response.ok) throw new Error("Validator provider unavailable.");
      const payload = await response.json();
      if (!Array.isArray(payload.data) || payload.pagination?.current_page !== page) throw new Error("Invalid validator directory response.");
      rows.push(...payload.data);
      if (payload.pagination.next_page === null) return rows;
      if (payload.pagination.next_page !== page + 1) throw new Error("Incomplete validator directory.");
    }
    throw new Error("Validator directory exceeds bounded coverage.");
  })()]);
  const children = new Set(index.hotkeys);
  return { rows: all.filter(row => !children.has(row.hotkey)), hiddenChildren: all.filter(row => children.has(row.hotkey)).length, childCheck: { block: index.block, checkedAt: index.checkedAt } };
}, ["standalone-validator-directory-v1"], { revalidate: 1800 });
