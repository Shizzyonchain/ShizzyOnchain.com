"use client";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { rankRootMatches, type RootMatch, type RootMode } from "../../lib/root-ranking";
import { displayNumber } from "../../lib/validator-types";
import styles from "../validators.module.css";
type Result = { matches: RootMatch[]; excluded: { name: string; reason: string }[]; reviewed: string[]; totalBaskets: number; collectedAt: string };
const modes: { value: RootMode; label: string; weights: string }[] = [
  { value: "balanced", label: "Balanced", weights: "Returns 30% · smaller capital drawdown 20% · lower volatility 15% · lower concentration 20% · smaller liquidity quote gap 15%." },
  { value: "risk", label: "Lower historical risk", weights: "Returns 10% · smaller capital drawdown 30% · lower volatility 20% · lower concentration 25% · smaller liquidity quote gap 15%." },
  { value: "returns", label: "Returns-focused", weights: "Returns 50% · smaller capital drawdown 15% · lower volatility 10% · lower concentration 15% · smaller liquidity quote gap 10%." },
];
const pct = (value: number) => `${displayNumber(value * 100)}%`;
export function RootRecommendations() {
  const [mode, setMode] = useState<RootMode>("balanced");
  const [result, setResult] = useState<Result | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [request, setRequest] = useState(0);
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => { const timer = window.setInterval(() => setNow(Date.now()), 60_000); return () => window.clearInterval(timer); }, []);
  useEffect(() => {
    if (!request) return;
    const controller = new AbortController();
    fetch("/api/validators/root/recommendations", { signal: controller.signal }).then(async response => {
      const payload = await response.json(); if (!response.ok) throw new Error(payload.error || "Root recommendations unavailable.");
      setResult(payload); setNow(Date.now()); setError("");
    }).catch(reason => { if (!controller.signal.aborted) setError(reason.message); }).finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, [request]);
  const ranked = useMemo(() => rankRootMatches(result?.matches || [], mode, now), [result, mode, now]);
  return <section className={styles.basketPanel} aria-labelledby="root-recommend-title"><p className={styles.eyebrow}>RETURNS · DOWNSIDE · HOLDINGS</p><h2 id="root-recommend-title">Recommended root validators</h2><p>Provisional matches within eight of the largest named baskets with reported root stake. Compare rewards with capital downside, concentration and liquidity—not yield alone.</p><div className={styles.tabs} role="group" aria-label="Root recommendation preference">{modes.map(item => <button key={item.value} aria-pressed={mode === item.value} onClick={() => setMode(item.value)}>{item.label}</button>)}</div><button disabled={loading} onClick={() => { setLoading(true); setError(""); setResult(null); setRequest(value => value + 1); }}>{loading ? "Checking cached history…" : "Find root recommendations"}</button><p className={styles.source}>Loads separately on request. Shared hourly cache; switching preferences recalculates existing data without further history requests.</p>
    {loading && <p role="status">Checking daily history and basket exposure. The directory and comparison tools remain available.</p>}{error && <p className={styles.notice} role="alert">{error}</p>}
    {result && <><p className={styles.source}>{result.reviewed.length} baskets reviewed from {result.totalBaskets} available baskets · {ranked.length} meet the current evidence checks. This is a bounded comparison, not a ranking of every root staking option.</p>{ranked.length < 2 ? <p className={styles.notice}>Insufficient fresh, comparable evidence to recommend a winner. Missing history, fund resets or stale snapshots prevent a match.</p> : <div className={styles.matches}>{ranked.slice(0, 3).map((row, index) => <article key={row.hotkey} className={styles.match}><span>{index === 0 ? "Top provisional match" : `Alternative ${index}`} · {modes.find(item => item.value === mode)!.label}</span><h3><Link href={`/validators/${row.hotkey}`} prefetch={false}>{row.name}</Link></h3><strong>{row.score}/100 <small>relative match score</small></strong><ul><li>30-day staker total return: {pct(row.totalReturn)}</li><li>Worst capital daily-close drop: {pct(row.drawdown)}</li><li>Daily capital volatility: {pct(row.volatility)}</li><li>Top-five holdings: {pct(row.topFive)}</li><li>Spot-to-realizable quote gap: {pct(row.quoteGap)}</li><li>Current take: {pct(row.take)} · not deducted again</li></ul><p className={styles.source}>History {row.start}–{row.end} UTC · 31 daily closes. Basket {row.snapshot}; fee/root stake {row.identityTimestamp}.</p><Link href={`/validators/${row.hotkey}`} prefetch={false}>Review validator →</Link></article>)}</div>}<details className={styles.method}><summary>Coverage and exclusions</summary><p>Reviewed: {result.reviewed.join(" · ")}</p>{result.excluded.map(row => <p key={row.name}>{row.name}: {row.reason}</p>)}{result.matches.length > ranked.length && <p>Additional results failed freshness or numeric validity checks. They cannot receive a recommendation.</p>}</details></>}
    <details className={styles.method}><summary>How these recommendations work</summary><p>{modes.find(item => item.value === mode)!.weights}</p><p>All candidates need the same 30-day range ending yesterday UTC: 31 consecutive completed daily observations with a consistent fund-life identifier, valid staker total return and positive basket share prices. Basket and fee/root-stake snapshots must be no more than two hours old. At least two qualifying candidates are required.</p><p>Return uses the staker total-return accumulator. Capital drawdown and daily-return standard deviation use realizable value per basket share, so accrued rewards cannot hide losses in the underlying basket. These daily-close measures miss intraday moves.</p><p>Holdings concentration uses the sum of squared allocation shares, rather than simply counting tokens. Liquidity compares whole-basket realizable value with its spot mark; it is not an individual exit-fee estimate. Each factor is ranked relative to the qualifying group; tied factors receive equal credit. A high score is not an absolute safety grade.</p><p>The research universe is the eight largest named, non-child-only baskets by realizable NAV with positive reported root stake and a known take. Size selects coverage only; it earns no score. This does not independently verify a current root seat, operator security, service quality or insurance. Historical outcomes do not establish future returns or future risk.</p><a href="https://taostats.io/docs/new/validators/get-validators-baskets-history" target="_blank" rel="noreferrer">TaoStats history methodology ↗</a></details>
  </section>;
}
