/** Largest peak-to-trough drop in one positive daily-close series. @param {number[]} values */
export function dailyCloseDrawdown(values) {
  let peak = values[0], drawdown = 0;
  for (const value of values) { peak = Math.max(peak, value); drawdown = Math.min(drawdown, value / peak - 1); }
  return drawdown;
}
