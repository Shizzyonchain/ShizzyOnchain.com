"use client";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { rankRootMatches, rootMatchExclusions, type RootMatch, type RootMode } from "../../lib/root-ranking";
import { explainRootMatch } from "../../lib/root-explanation";
import { displayNumber } from "../../lib/validator-types";
import { ValidatorColumn, ValidatorTableHelp } from "../validator-table-help";
import { RecommendationLoading } from "../recommendation-loading";
import { ValidatorTableScroll } from "../validator-table-scroll";
import styles from "../validators.module.css";
type Result = { historyRollover?: boolean; historyEnd?: string; matches: RootMatch[]; excluded: { hotkey: string; name: string; reason: string }[]; reviewed: string[]; totalBaskets: number; collectedAt: string; preparedAt: string; historyCandidates: number; hiddenChildren: number };
const modes: { value: RootMode; label: string; weights: string }[] = [
  { value: "balanced", label: "Balanced", weights: "Returns 30% · smaller capital drawdown 20% · lower volatility 15% · lower concentration 20% · smaller liquidity quote gap 15%." },
  { value: "risk", label: "Lower historical risk", weights: "Returns 10% · smaller capital drawdown 30% · lower volatility 20% · lower concentration 25% · smaller liquidity quote gap 15%." },
  { value: "returns", label: "Returns-focused", weights: "Returns 50% · smaller capital drawdown 15% · lower volatility 10% · lower concentration 15% · smaller liquidity quote gap 10%." },
];
const pct = (value: number) => `${displayNumber(value * 100)}%`;
export function RootRecommendations({ onCompare, compareReady }: { onCompare: (keys: string[]) => void; compareReady: boolean }) {
  const [picks, setPicks] = useState<string[]>([]);
  const [mode, setMode] = useState<RootMode>("balanced");
  const [result, setResult] = useState<Result | null>(null);
  const [error, setError] = useState("");
  const [preparing, setPreparing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [request, setRequest] = useState(0);
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => { const timer = window.setInterval(() => setNow(Date.now()), 60_000); return () => window.clearInterval(timer); }, []);
  useEffect(() => {
    if (!request) return;
    let stopped = false;
    let active: AbortController | null = null;
    const read = async () => {
      if (stopped || active || document.hidden) return;
      const controller = new AbortController();
      active = controller;
      const timeout = window.setTimeout(() => controller.abort(), 20_000);
      try {
        const response = await fetch("/api/validators/root/recommendations", { signal: controller.signal });
        const payload = await response.json();
        if (stopped) return;
        if (response.status === 202 && payload.preparing) {
          setPreparing(true); setError(""); return;
        }
        if (!response.ok) throw new Error(payload.error || "Root recommendations unavailable.");
        setResult(payload); setNow(Date.now()); setPreparing(false); setError("");
      } catch (reason) {
        if (!stopped) setError(reason instanceof Error && reason.name !== "AbortError" ? reason.message : "The refresh timed out. Retrying automatically.");
      } finally {
        window.clearTimeout(timeout); active = null;
        if (!stopped) setLoading(false);
      }
    };
    void read();
    const timer = window.setInterval(read, 60_000);
    const resume = () => { if (!document.hidden) { setNow(Date.now()); void read(); } };
    document.addEventListener("visibilitychange", resume);
    return () => { stopped = true; window.clearInterval(timer); active?.abort(); document.removeEventListener("visibilitychange", resume); };
  }, [request]);
  const ranked = useMemo(() => rankRootMatches(result?.matches || [], mode, now), [result, mode, now]);
  const exclusions = useMemo(() => (result?.matches || []).flatMap(row => { const reasons = rootMatchExclusions(row, now); return reasons.length ? [{ ...row, reason: reasons.join("; ") }] : []; }), [result, now]);
  const selected = ranked.filter(row => picks.includes(row.hotkey));
  const select = (hotkey: string) => setPicks(previous => previous.includes(hotkey) ? previous.filter(key => key !== hotkey) : [...previous.filter(key => ranked.some(row => row.hotkey === key)), hotkey].slice(0, 2));
  const pickButton = (row: RootMatch) => <button type="button" aria-pressed={selected.some(item => item.hotkey === row.hotkey)} aria-label={`${selected.some(item => item.hotkey === row.hotkey) ? "Remove" : "Select"} ${row.name} ${selected.some(item => item.hotkey === row.hotkey) ? "from" : "for"} comparison`} disabled={!picks.includes(row.hotkey) && selected.length === 2} onClick={() => select(row.hotkey)}>{selected.some(item => item.hotkey === row.hotkey) ? "Selected ✓" : "Select to compare"}</button>;
  return <section className={styles.basketPanel} aria-labelledby="root-recommend-title"><p className={styles.eyebrow}>RETURNS · DOWNSIDE · HOLDINGS</p><h2 id="root-recommend-title">Recommended root validators</h2><p>Every basket in the root directory is assessed, without a size or display-name cutoff. Compare rewards with capital downside, concentration and liquidity—not yield alone.</p><div className={styles.tabs} role="group" aria-label="Root recommendation preference">{modes.map(item => <button key={item.value} aria-pressed={mode === item.value} onClick={() => setMode(item.value)}>{item.label}</button>)}</div><button disabled={loading} onClick={() => { setLoading(true); setError(""); setPreparing(false); setRequest(value => value + 1); }}>{loading ? "Loading prepared results…" : "Find root recommendations"}</button><p className={styles.source}>History is prepared by a scheduled background job. Opening recommendations reads prepared results; it never starts a history scan. Holdings and permits retain their own freshness checks. Results refresh automatically each minute while this page is visible. Switching preferences makes no additional requests.</p>
    {loading && !result && <RecommendationLoading root />}{preparing && <p className={styles.notice} role="status">Calculating updated recommendations in the background. We’ll check again automatically within a minute. Any previous results below retain their own freshness checks.</p>}{error && <p className={styles.notice} role="alert">{error}</p>}
    {result && <>{result.historyRollover && <p className={styles.notice}>The new UTC day’s history is being prepared. This comparison uses the complete window ending {result.historyEnd} UTC, with current permits and holdings. It expires after the two-hour rollover allowance.</p>}<p className={styles.source}>{result.reviewed.length} baskets reviewed from {result.totalBaskets} available baskets · {ranked.length} meet the current evidence checks. {result.historyCandidates} needed history checks; others have explicit exclusions. {result.hiddenChildren} child-only baskets remain excluded from the directory. History prepared {result.preparedAt}.</p>{ranked.length >= 2 && <div className={styles.comparisonPick} role="group" aria-label="Recommended validator comparison"><div><strong>Compare recommendations · {selected.length}/2 selected</strong><p role="status">{selected.length ? selected.map(row => row.name).join(" + ") : "Select two validators from the cards or the full ranking."}{selected.length === 2 ? " Remove a pick to choose another." : ""}</p></div><button disabled={selected.length !== 2 || !compareReady} onClick={() => onCompare(selected.map(row => row.hotkey))}>Compare selected validators →</button>{selected.length > 0 && <button onClick={() => setPicks([])}>Clear selection</button>}{!compareReady && <p>Waiting for the basket directory before comparing.</p>}</div>}{ranked.length < 2 ? <p className={styles.notice}>Insufficient fresh, comparable evidence to recommend a winner. Missing history, fund resets or stale snapshots prevent a match.</p> : <div className={styles.matches}>{ranked.slice(0, 3).map((row, index) => <article key={row.hotkey} className={`${styles.match} ${styles.rootMatch}`}><span>{index === 0 ? "Top provisional match" : `Alternative ${index}`} · {modes.find(item => item.value === mode)!.label}</span><h3><Link href={`/validators/${row.hotkey}`} prefetch={false}>{row.name}</Link></h3>{pickButton(row)}<strong>{row.score}/100 <small>relative match score</small></strong><ul><li>30-day staker total return: {pct(row.totalReturn)}</li><li>Worst capital daily-close drop: {pct(row.drawdown)}</li><li>Current take: {pct(row.take)} · included in past returns</li></ul><details className={styles.rootMatchDetails}><summary>Why it ranks here · risks & evidence</summary><ul><li>Daily capital volatility: {pct(row.volatility)}</li><li>Top-five holdings: {pct(row.topFive)}</li><li>Spot-to-realizable quote gap: {pct(row.quoteGap)}</li></ul><RootExplanation row={row} /><p className={styles.source}>History {row.start}–{row.end} UTC · 31 daily closes. Basket {row.snapshot}; fee/root stake {row.identityTimestamp}. Active root permit {row.operatingTimestamp}.</p></details><Link href={`/validators/${row.hotkey}`} prefetch={false}>Review validator →</Link></article>)}</div>}<details className={styles.method}><summary>All {ranked.length} qualifying validators, ranked</summary><ValidatorTableHelp><ValidatorTableScroll className={styles.tableWrap} label="Complete root recommendation ranking"><table className={`${styles.table} ${styles.pinFirst} ${styles.rootRankingCards}`}><thead><tr>{["Validator", "Compare", "Score", "30d staker return", "Capital drawdown", "Capital volatility", "Top five holdings", "Quote gap", "Take", "Why & watch"].map(label => <ValidatorColumn key={label} label={label} />)}</tr></thead><tbody>{ranked.map((row, index) => <tr key={row.hotkey}><td data-label="Validator"><Link href={`/validators/${row.hotkey}`} prefetch={false}>#{index + 1} {row.name}</Link></td><td data-label="Compare">{pickButton(row)}</td><td data-label="Match score">{row.score}</td><td data-label="30d staker return">{pct(row.totalReturn)}</td><td data-label="Capital drawdown">{pct(row.drawdown)}</td><td data-label="Capital volatility">{pct(row.volatility)}</td><td data-label="Top-five holdings">{pct(row.topFive)}</td><td data-label="Quote gap">{pct(row.quoteGap)}</td><td data-label="Take">{pct(row.take)}</td><td data-label="Why & watch" className={styles.explanationCell}><details><summary>View explanation</summary><RootExplanation row={row} /></details></td></tr>)}</tbody></table></ValidatorTableScroll></ValidatorTableHelp></details><details className={styles.method}><summary>Coverage and exclusions</summary><p>Reviewed: {result.reviewed.join(" · ")}</p>{result.excluded.map(row => <p key={row.hotkey}>{row.name}: {row.reason}</p>)}{exclusions.map(row => <p key={row.hotkey}>{row.name}: {row.reason}. Automatically checking for updated evidence.</p>)}</details></>}
    <details className={styles.method}><summary>How these recommendations work</summary><p>{modes.find(item => item.value === mode)!.weights}</p><p>All candidates need the same completed 30-day range, normally ending yesterday UTC: 31 consecutive completed daily observations with a consistent fund-life identifier, valid staker total return and positive basket share prices. An active root permit must be confirmed. Metagraph, basket and fee/root-stake snapshots must be no more than two hours old. At least two qualifying candidates are required.</p><p>Return uses the staker total-return accumulator. Capital drawdown and daily-return standard deviation use realizable value per basket share, so accrued rewards cannot hide losses in the underlying basket. These daily-close measures miss intraday moves.</p><p>Holdings concentration uses the sum of squared allocation shares, rather than simply counting tokens. Liquidity compares whole-basket realizable value with its spot mark; it is not an individual exit-fee estimate. Each factor is ranked relative to the qualifying group; tied factors receive equal credit. A high score is not an absolute safety grade.</p><p>The universe is every basket returned by the root directory, preserving its child-only exclusion. A name, large NAV or top-eight position is not required. Positive reported root stake, a positive realizable basket value and a valid take are required before history lookup. Empty, historical or incomplete records remain accounted for in the exclusions. Completed history is prepared every 15 minutes and cached separately from refreshed holdings and fees. During the first two hours of a new UTC day, the prior complete window can be shown with an explicit date while the new daily close is prepared. Missing preparation returns immediately rather than making visitors wait for a scan. Current root permits are checked against the dated SN0 metagraph. This does not independently verify operator security, service quality or insurance. Historical outcomes do not establish future returns or future risk.</p><a href="https://taostats.io/docs/new/validators/get-validators-baskets-history" target="_blank" rel="noreferrer">TaoStats history methodology ↗</a></details>
  </section>;
}

function RootExplanation({ row }: { row: ReturnType<typeof rankRootMatches>[number] }) {
  const explanation = explainRootMatch(row);
  return <div className={styles.rootExplanation}><h4>Why it ranks here</h4><p>Largest score contributions relative to the qualifying group. These change with your selected preference.</p><ul>{explanation.why.map(text => <li key={text}>{text}</li>)}</ul><h4>What to watch</h4><ul>{explanation.watch.map(text => <li key={text}>{text}</li>)}</ul></div>;
}
