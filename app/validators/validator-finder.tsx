"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { rankValidators, type Candidate, type RankingMode } from "../lib/validator-ranking";
import { displayNumber, shortAddress } from "../lib/validator-types";
import styles from "./validators.module.css";

type Result = { candidates: Candidate[]; collectedAt: string; netuid: number; coverage: { permitHolders: number; yieldRows: number; directoryEntries: number } };
const modes: { value: RankingMode; label: string; method: string }[] = [
  { value: "balanced", label: "Balanced", method: "Yield 30% · agreement between windows 25% · participation 25% · update recency 10% · decentralization 10%." },
  { value: "yield", label: "Yield", method: "Yield 60% · agreement 20% · participation 10% · update recency 5% · decentralization 5%." },
  { value: "fees", label: "Low fees", method: "Lower take 35% · participation 20% · yield 15% · agreement 15% · decentralization 10% · update recency 5%. This preference explicitly favors lower fees." },
  { value: "decentralization", label: "Decentralization", method: "Lower subnet stake share 40% · agreement 20% · participation 20% · yield 15% · update recency 5%." },
];
const pct = (value: number | null) => value === null ? "—" : `${displayNumber(value * 100)}%`;

export function ValidatorFinder({ subnets }: { subnets: { netuid: number; name: string }[] }) {
  const [selection, setSelection] = useState("");
  const [mode, setMode] = useState<RankingMode>("balanced");
  const [result, setResult] = useState<Result | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [request, setRequest] = useState<{ netuid: string; id: number } | null>(null);
  const [now, setNow] = useState(0);
  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 60_000);
    return () => window.clearInterval(timer);
  }, []);
  useEffect(() => {
    if (!request) return;
    const controller = new AbortController();
    fetch(`/api/validators/recommendations?netuid=${request.netuid}`, { signal: controller.signal }).then(async response => {
      const payload = await response.json(); if (!response.ok) throw new Error(payload.error || "Recommendation sources unavailable.");
      setResult(payload); setNow(Date.now()); setError("");
    }).catch(reason => { if (!controller.signal.aborted) setError(reason.message); }).finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, [request]);
  const rows = useMemo(() => rankValidators(result?.candidates || [], mode, now), [result, mode, now]);
  const eligible = rows.filter(row => row.score !== null);
  const picked = result ? subnets.find(s => s.netuid === result.netuid) : null;
  const cards = eligible.length >= 2 ? [
    { label: `Top ${modes.find(m => m.value === mode)!.label.toLowerCase()} match`, row: eligible[0] },
    { label: "Strongest conservative yield", row: [...eligible].sort((a, b) => Math.min(b.yield7!, b.yield30!) - Math.min(a.yield7!, a.yield30!) || a.hotkey.localeCompare(b.hotkey))[0] },
    { label: "Lowest take among qualifying validators", row: [...eligible].sort((a, b) => a.take! - b.take! || b.score! - a.score!)[0] },
  ] : [];
  return <section className={styles.finder} aria-labelledby="validator-finder-title"><p className={styles.eyebrow}>SUBNET VALIDATOR MATCH</p><h2 id="validator-finder-title">Find a validator for your subnet</h2><p>Choose a subnet. Compare performance, participation, fees and concentration with the evidence behind every result.</p>
    <form className={styles.controls} onSubmit={event => { event.preventDefault(); if (!selection) return; setLoading(true); setResult(null); setError(""); setRequest({ netuid: selection, id: Date.now() }); }}><label>Subnet<select required value={selection} onChange={event => setSelection(event.target.value)}><option value="">Choose a subnet</option>{subnets.filter(s => s.netuid > 0).sort((a, b) => a.netuid - b.netuid).map(s => <option key={s.netuid} value={s.netuid}>SN{s.netuid} {s.name}</option>)}</select></label><button type="submit" disabled={!selection || loading}>{loading ? "Checking…" : "Find validators →"}</button></form>
    <div className={styles.tabs} role="group" aria-label="Validator ranking preference">{modes.map(item => <button key={item.value} aria-pressed={mode === item.value} onClick={() => setMode(item.value)}>{item.label}</button>)}</div>
    {loading && <p className={styles.notice} role="status">Checking the subnet’s cached validator, activity and yield data. The rest of the page stays available.</p>}
    {error && <p className={styles.notice} role="alert">{error} No winner was selected from incomplete sources. Use Find validators to retry.</p>}
    {result && <><h3>SN{result.netuid} {picked?.name || ""}</h3><p className={styles.source}>{eligible.length} qualifying direct validators out of {result.coverage.permitHolders} permit holders reviewed. TaoStats sources collected {new Date(result.collectedAt).toLocaleString("en-US", { timeZone: "America/New_York" })} Eastern. Rankings check source ages each minute.</p>
    {!cards.length && <p className={styles.notice}>Insufficient comparable data to recommend a winner. {eligible.length === 1 ? "Only one validator meets the evidence requirements." : "No validator meets all the evidence requirements."} Review the exclusions below.</p>}
    <div className={styles.matches}>{cards.map(({ label, row }) => <article className={styles.match} key={label}><span>{label}</span><h3><Link href={`/validators/${row.hotkey}`} prefetch={false}>{row.name === row.hotkey ? shortAddress(row.hotkey) : row.name}</Link></h3><strong>{row.score}/100 <small>{modes.find(m => m.value === mode)!.label} score</small></strong><ul>{row.reasons.map(reason => <li key={reason}>{reason}</li>)}</ul><p className={styles.source}>Same validator may lead more than one category.</p><Link href={`/validators/${row.hotkey}`} prefetch={false}>Explore validator →</Link></article>)}</div>
    <div className={styles.tableWrap} role="region" aria-label="Subnet validator ranking and exclusions" tabIndex={0}><table className={styles.table}><thead><tr>{["Validator", "Score", "7d APY", "30d APY", "Take", "7d participation", "30d participation", "Stake weight share", "Evidence"].map(label => <th scope="col" key={label}>{label}</th>)}</tr></thead><tbody>{rows.map(row => <tr key={row.hotkey}><td><Link href={`/validators/${row.hotkey}`} prefetch={false}>{row.name === row.hotkey ? shortAddress(row.hotkey) : row.name}</Link></td><td>{row.score ?? "Not ranked"}</td><td>{pct(row.yield7)}</td><td>{pct(row.yield30)}</td><td>{pct(row.take)}</td><td>{pct(row.participation7)}</td><td>{pct(row.participation30)}</td><td>{pct(row.stakeShare)}</td><td><details><summary>{row.excluded.length ? "Why excluded" : "View sources"}</summary>{row.excluded.length > 0 && <ul>{row.excluded.map(reason => <li key={reason}>{reason}</li>)}</ul>}<p>Metagraph: {row.timestamps[0] || "Unavailable"}<br />Yield: {row.timestamps[1] || "Unavailable"}<br />Validator directory: {row.timestamps[2] || "Unavailable"}<br />Subnet parameters: {row.timestamps[3] || "Unavailable"}</p></details></td></tr>)}</tbody></table></div></>}
    <details className={styles.method}><summary>How the recommendations work</summary><p>{modes.find(item => item.value === mode)!.method}</p><p>Qualifying validators must have an active direct permit, positive dividends, an update within the subnet’s effective activity cutoff, positive 7d and 30d APY, at least 90% reported participation in both windows, a known fee and stake share, and a hotkey first registered at least 30 days ago. All four required source snapshots must be no more than two hours old and no more than one hour apart. Missing data never earns a favorable score.</p><p>Yield compares the lower of the 7d and 30d measurements within the qualifying group. Agreement compares those two averages; it does not measure daily volatility. Decentralization favors lower stake-weight share among this subnet’s direct permit holders. Fee is shown and breaks score ties; it has no separate balanced/yield/decentralization weight, avoiding an additional fee reward on top of reported yield.</p><p>Coverage is limited to direct permit holders. Validators working through child hotkeys are not evaluated unless their own hotkey meets these requirements. First registration is global hotkey age, not proof of 30 days operating on this subnet. The API does not expose observation counts for the yield windows here, so these are provisional data-based matches—not a full operational or security audit. Historical annualized yield does not guarantee future returns.</p><p>Sources: <a href="https://taostats.io/docs/new/validators/get-validators-yield" target="_blank" rel="noreferrer">Yield</a> · <a href="https://taostats.io/docs/new/subnets/get-subnets-metagraph" target="_blank" rel="noreferrer">Metagraph</a> · <a href="https://taostats.io/docs/new/subnets/get-subnets-hyperparameters" target="_blank" rel="noreferrer">Activity parameters</a>. Shared hourly caches; changing preference scores existing data without another API call.</p></details>
  </section>;
}
