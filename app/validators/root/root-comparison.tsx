"use client";

import { useEffect, useMemo, useState } from "react";
import { basketOverlap, compareHistory, type HistoryPoint, type Performance } from "../../lib/root-comparison";
import { displayNumber, shortAddress } from "../../lib/validator-types";
import type { NamedRootBasket } from "../../lib/root-baskets";
import styles from "../validators.module.css";

type Loaded = { baskets: NamedRootBasket[]; histories: HistoryPoint[][] };
const name = (basket: NamedRootBasket) => basket.name || shortAddress(basket.hotkey);
const pct = (value: number) => `${displayNumber(value * 100)}%`;

export function RootComparison({ baskets, subnets, initialHotkey = "" }: { initialHotkey?: string; baskets: NamedRootBasket[]; subnets: { netuid: number; name: string }[] }) {
  const options = baskets.filter(basket => basket.root_stake !== null && Number(basket.nav_tao) >= 10_000_000);
  const [selected, setSelected] = useState<string[]>([initialHotkey, "", ""]);
  const [period, setPeriod] = useState("30");
  const [request, setRequest] = useState<{ keys: string[]; id: number } | null>(null);
  const [loaded, setLoaded] = useState<Loaded | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (!request) return;
    const controller = new AbortController();
    Promise.all(request.keys.map(async hotkey => {
      const response = await fetch(`/api/validators/root/history?hotkey=${hotkey}`, { signal: controller.signal });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || "Basket history unavailable.");
      return payload.data as HistoryPoint[];
    })).then(histories => { setLoaded({ histories, baskets: request.keys.map(hotkey => baskets.find(basket => basket.hotkey === hotkey)!) }); }).catch(reason => { if (!controller.signal.aborted) setError(reason.message); }).finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, [request, baskets]);
  const calculated = useMemo(() => {
    if (!loaded) return null;
    try {
      const lastSharedEnd = Math.min(...loaded.histories.map(history => Math.max(...history.map(point => Date.parse(point.day)))));
      const cutoff = lastSharedEnd - Number(period) * 86400_000;
      return { performance: compareHistory(loaded.histories.map(history => history.filter(point => Date.parse(point.day) >= cutoff))), error: "" };
    } catch (reason) { return { performance: null, error: reason instanceof Error ? reason.message : "Comparison unavailable." }; }
  }, [loaded, period]);
  const pairs = loaded ? loaded.baskets.flatMap((a, index) => loaded.baskets.slice(index + 1).map(b => ({ a, b, data: basketOverlap(a, b) }))) : [];
  const labels = new Map(subnets.map(subnet => [subnet.netuid, subnet.name]));
  return <section className={styles.basketPanel} aria-labelledby="root-compare-title"><p className={styles.eyebrow}>COMPARE THE EXPOSURE AND THE RIDE</p><h2 id="root-compare-title">Compare root baskets</h2><p>Choose two or three listed validators. Compare daily staker total returns, historical declines and how much subnet exposure they share.</p><form onSubmit={event => {
    event.preventDefault(); const keys = selected.filter(Boolean);
    if (keys.length < 2 || new Set(keys).size !== keys.length) { setError("Choose at least two different validators."); return; }
    setLoading(true); setLoaded(null); setError(""); setRequest({ keys, id: Date.now() });
  }}><div className={styles.compareControls}>{selected.map((value, index) => <label key={index}>Validator {index + 1}{index === 2 ? " (optional)" : ""}<select required={index < 2} value={value} onChange={event => setSelected(old => old.map((key, i) => i === index ? event.target.value : key))}><option value="">Choose validator</option>{options.map(basket => <option key={basket.hotkey} value={basket.hotkey}>{name(basket)} · {shortAddress(basket.hotkey)}</option>)}</select></label>)}</div><button disabled={loading} type="submit">{loading ? "Loading daily history…" : "Compare baskets"}</button></form><div className={styles.tabs} role="group" aria-label="Basket comparison period">{["30", "90"].map(days => <button key={days} aria-pressed={period === days} onClick={() => setPeriod(days)}>{days} days</button>)}</div><p className={styles.source}>History loads on request from a shared hourly cache. Period changes reuse loaded history. Only completed UTC days are included. Missing or reset fund history is not joined into a fabricated return.</p>
    {loading && <p role="status">Loading comparable daily observations. The rest of the page stays available.</p>}{error && <p className={styles.notice} role="alert">{error}</p>}
    {calculated?.error && <p className={styles.notice} role="status">{calculated.error} Current basket overlap is still shown below.</p>}
    {loaded && calculated?.performance && <PerformanceChart performance={calculated.performance} baskets={loaded.baskets} />}
    {loaded && <><h3>Current basket overlap</h3><p>Overlap sums the smaller allocation to each shared subnet, including TAO cash: 100% means identical value allocations; 0% means no shared exposure. It does not measure return correlation or operator independence.</p><div className={styles.tableWrap} role="region" aria-label="Basket overlap comparison" tabIndex={0}><table className={`${styles.table} ${styles.holdingsTable} ${styles.pinFirst}`}><thead><tr><th>Basket pair</th><th>Weighted overlap</th><th>Largest shared exposures</th></tr></thead><tbody>{pairs.map(({ a, b, data }) => <tr key={`${a.hotkey}-${b.hotkey}`}><td>{name(a)} / {name(b)}</td><td>{data ? pct(data.overlap) : "Unavailable: different blocks or empty basket"}</td><td>{data?.shared.slice(0, 3).map(holding => `SN${holding.netuid} ${holding.netuid === 0 ? "TAO cash" : labels.get(holding.netuid) || "Subnet"} (${pct(holding.share)})`).join(" · ") || "—"}</td></tr>)}</tbody></table></div><p className={styles.source}>Overlap uses the current basket snapshot, separately from the historical chart: {loaded.baskets.map(basket => `${name(basket)}: ${basket.timestamp}, block ${basket.block_number}`).join(" · ")}</p></>}
    <p className={styles.source}><a href="https://taostats.io/docs/new/validators/get-validators-baskets-history" target="_blank" rel="noreferrer">Source and method: TaoStats daily basket history</a>. Total return includes accrual and valuation changes. Take is not deducted again. These are basket observations, not personalized profit or guaranteed returns.</p>
  </section>;
}

function PerformanceChart({ performance, baskets }: { performance: Performance; baskets: NamedRootBasket[] }) {
  const all = performance.series.flatMap(series => series.values);
  const minimum = Math.min(...all), maximum = Math.max(...all), padding = Math.max((maximum - minimum) * .1, .02);
  const low = minimum - padding, high = maximum + padding;
  const strokes = ["#fff", "#aaa", "#ddd"], dashes = ["", "8 5", "2 4"];
  const start = performance.days[0], end = performance.days.at(-1)!;
  return <><h3>Staker total return · start index 100</h3><p>Shared observations: {start} to {end} UTC · {performance.days.length} daily closes. Returns cover this actual shared range, which can be shorter than the selected window.</p><svg className={styles.performanceChart} viewBox="0 0 800 300" role="img" aria-labelledby="basket-chart-title basket-chart-description"><title id="basket-chart-title">Root basket historical total-return comparison</title><desc id="basket-chart-description">All series start at 100 on {start}. Exact period returns and daily-close drawdowns are in the table below.</desc>{[0, .5, 1].map(fraction => <g key={fraction}><line x1="60" x2="780" y1={25 + fraction * 230} y2={25 + fraction * 230} stroke="#333" /><text x="4" y={29 + fraction * 230} fill="#bbb" fontSize="12">{(high - fraction * (high - low)).toFixed(2)}</text></g>)}{performance.series.map((series, i) => <polyline key={baskets[i].hotkey} points={series.values.map((value, index) => `${60 + index / (series.values.length - 1) * 720},${25 + (high - value) / (high - low) * 230}`).join(" ")} fill="none" stroke={strokes[i]} strokeWidth="2.5" strokeDasharray={dashes[i]} />)}<text x="60" y="285" fill="#bbb" fontSize="12">{start}</text><text x="780" y="285" textAnchor="end" fill="#bbb" fontSize="12">{end}</text></svg><div className={styles.chartLegend}>{baskets.map((basket, i) => <span key={basket.hotkey}><svg width="32" height="12" aria-hidden="true"><line x1="0" x2="32" y1="6" y2="6" stroke={strokes[i]} strokeWidth="2.5" strokeDasharray={dashes[i]} /></svg>{name(basket)}</span>)}</div><div className={styles.tableWrap} role="region" aria-label="Historical basket performance values" tabIndex={0}><table className={`${styles.table} ${styles.holdingsTable} ${styles.pinFirst}`}><thead><tr><th>Validator</th><th>Shared-period total return</th><th>Worst daily-close drawdown</th><th>Daily observations</th></tr></thead><tbody>{performance.series.map((series, i) => <tr key={baskets[i].hotkey}><td>{name(baskets[i])}</td><td>{pct(series.totalReturn)}</td><td>{pct(series.drawdown)}</td><td>{performance.days.length}</td></tr>)}</tbody></table></div><p className={styles.source}>Drawdown is the largest decline from an earlier daily-close peak within this range. Intraday drops are not captured. No smoothing or annualization; only shared consecutive days within each basket’s current fund life.</p></>;
}
