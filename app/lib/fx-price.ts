export type TaoQuote = { usd: number; updatedAt: number; source: string; stale?: boolean };
export function quoteUsable(value: TaoQuote | null, now = Date.now()) {
  return !!value && Number.isFinite(value.usd) && value.usd > 0 && Number.isFinite(value.updatedAt) && value.updatedAt * 1000 <= now + 60_000 && now - value.updatedAt * 1000 <= 15 * 60_000;
}
export function quoteFresh(value: TaoQuote | null, now = Date.now()) {
  return quoteUsable(value, now) && !value?.stale && now - value!.updatedAt * 1000 <= 180_000;
}
