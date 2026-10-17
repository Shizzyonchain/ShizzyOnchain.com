import type { rootHistoryMetrics } from "./root-ranking";
export type PreparedHistory = { day: number; metrics: Record<string, ReturnType<typeof rootHistoryMetrics>>; exclusions: Record<string, string>; preparedAt: string };
export function selectPreparedHistory(current: PreparedHistory | null, previous: PreparedHistory | null, hotkeys: string[], now: number) {
  const day = Math.floor(now / 86400_000) * 86400;
  const complete = (scan: PreparedHistory | null) => !!scan && hotkeys.every(key => Object.hasOwn(scan.metrics, key) || Object.hasOwn(scan.exclusions, key));
  if (current?.day === day && complete(current)) return { scan: current, rollover: false };
  // Keep the explicitly dated prior window available during the midnight refresh.
  // Do not silently reuse old history indefinitely, or mix completed-day windows.
  if (now / 1000 - day < 7200 && previous?.day === day - 86400 && complete(previous)) return { scan: previous, rollover: true };
  return null;
}
