"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { directorySnapshotTimes, displayNumber, numeric, rao, shortAddress, type Validator, type ValidatorResult } from "../lib/validator-types";
import { ValidatorTableScroll } from "./validator-table-scroll";
import styles from "./validators.module.css";

import { ValidatorColumn, ValidatorTableHelp } from "./validator-table-help";

const orderOptions = [["rank", "Overall rank"], ["root_stake", "Root stake"], ["global_alpha_stake_as_tao", "Alpha stake (TAO)"], ["global_nominators", "Nominators"], ["active_subnets", "Subnet coverage"], ["take", "Lowest take"]];
export function ValidatorExplorer() {
  const [result, setResult] = useState<(ValidatorResult<Validator> & { directoryTotal?: number }) | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [order, setOrder] = useState("rank");
  const [search, setSearch] = useState("");
  const [mobileLimit, setMobileLimit] = useState(20);
  const [submittedSearch, setSubmittedSearch] = useState("");
  const [attempt, setAttempt] = useState(0);
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const controller = new AbortController();
    let reading = false;
    const read = async () => {
      if (reading || document.hidden) return;
      reading = true;
      try {
        const response = await fetch(`/api/validators?page=${page}&order=${order}&search=${encodeURIComponent(submittedSearch)}`, { signal: controller.signal });
        const payload = await response.json();
        if (!response.ok) throw new Error(payload.error || "Validator data unavailable.");
        if (!controller.signal.aborted) { setResult(payload); setError(""); setNow(Date.now()); }
      } catch (reason) { if (!controller.signal.aborted) setError(reason instanceof Error ? reason.message : "Validator data unavailable."); }
      finally { reading = false; if (!controller.signal.aborted) { setLoading(false); setNow(Date.now()); } }
    };
    void read();
    const timer = window.setInterval(read, 60000);
    return () => { controller.abort(); window.clearInterval(timer); };
  }, [page, order, attempt, submittedSearch]);
  const rows = result?.data || [];
  const sourceTimes = directorySnapshotTimes(rows, now);
  function changePage(value: number) { setMobileLimit(20); setLoading(true); setResult(null); setPage(value); }
  return <section aria-label="Validator directory"><h2 className={styles.directoryHeading}>Validator directory</h2><p className={styles.mobileOnly}>Take is the validator reward fee. Choose a subnet above to compare yield after take, or open a validator for full stake details.</p><form className={styles.controls} onSubmit={event => { event.preventDefault(); setMobileLimit(20); setLoading(true); setResult(null); setPage(1); setSubmittedSearch(search.trim()); setAttempt(value => value + 1); }}><label>Search all validators<input value={search} onChange={event => setSearch(event.target.value)} placeholder="Name, hotkey or owner" /></label><button type="submit">Search directory</button><label>Sort validators<select value={order} onChange={event => { setMobileLimit(20); setLoading(true); setResult(null); setPage(1); setOrder(event.target.value); }}>{orderOptions.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label></form>
    <div className={styles.stats}><div><span>Directory entries</span><strong>{displayNumber(result?.pagination.total_items, 0)}</strong><small>{submittedSearch ? `Matches across ${result?.directoryTotal || "all"} listed validators` : "Parent/standalone hotkeys only"}</small></div><div><span>Loaded records</span><strong>{displayNumber(result?.data.length, 0)}</strong><small>Child-only hotkeys excluded</small></div><div><span>Oldest source snapshot</span><strong className={styles.date}>{sourceTimes.oldest !== null ? new Date(sourceTimes.oldest).toLocaleString("en-US", { timeZone: "UTC", hour12: false }) + " UTC" : "—"}</strong><small>Checks for updated cached data each minute</small></div></div>
    {sourceTimes.stale > 0 && <p className={styles.notice} role="status">{sourceTimes.stale} loaded records have stale, missing or future source times. Their figures are historical or unverified; a page refresh does not reset source age.</p>}
    {sourceTimes.oldest !== null && sourceTimes.newest !== sourceTimes.oldest && <p className={styles.source}>Source range: {new Date(sourceTimes.oldest).toISOString()} to {new Date(sourceTimes.newest!).toISOString()}. The newest row does not establish freshness for the rest.</p>}
    {error && <div role="alert" className={styles.notice}>{error} <button onClick={() => { setLoading(true); setAttempt(value => value + 1); }}>Retry</button></div>}
    {loading && <p role="status" className={styles.notice}>Loading validator snapshot…</p>}
    {!loading && result && <><ValidatorTableHelp><ValidatorTableScroll className={styles.tableWrap} label="Scroll validator comparison table"><table className={`${styles.table} ${styles.pinSecond} ${styles.directoryCards}`}><thead><tr>{["Rank", "Validator", "Take", "Root stake τ", "Alpha value τ", "Weighted stake τ", "24h weighted Δ τ", "Dominance", "Nominators", "Subnets"].map(label => <ValidatorColumn key={label} label={label} />)}</tr></thead><tbody>{rows.map((row, index) => <tr key={row.hotkey} className={index >= mobileLimit ? styles.mobileExtra : undefined}><td data-label="Rank">{row.rank}</td><td data-label="Validator"><Link href={`/validators/${row.hotkey}`} prefetch={false}>{row.name || shortAddress(row.hotkey)}</Link><small>{shortAddress(row.hotkey)}</small></td><td data-label="Take">{numeric(row.take) === null ? "—" : `${displayNumber(Number(row.take) * 100)}%`}</td><td data-label="Root stake (TAO)">{displayNumber(rao(row.root_stake))}</td><td data-label="Alpha value (TAO)">{displayNumber(rao(row.global_alpha_stake_as_tao))}</td><td data-label="Weighted stake (TAO)">{displayNumber(rao(row.global_weighted_stake))}</td><td data-label="24h weighted change (TAO)" className={numeric(row.global_weighted_stake_24_hr_change) === null ? "" : Number(row.global_weighted_stake_24_hr_change) > 0 ? styles.gain : Number(row.global_weighted_stake_24_hr_change) < 0 ? styles.loss : ""}>{displayNumber(rao(row.global_weighted_stake_24_hr_change))}</td><td data-label="Dominance">{displayNumber(row.dominance)}%</td><td data-label="Nominators">{displayNumber(row.global_nominators, 0)}</td><td data-label="Subnets">{displayNumber(row.active_subnets, 0)}</td></tr>)}</tbody></table></ValidatorTableScroll></ValidatorTableHelp>{rows.length > mobileLimit && <button type="button" className={styles.mobileMore} onClick={() => setMobileLimit(value => value + 20)}>Show 20 more validators ({Math.min(mobileLimit, rows.length)}/{rows.length})</button>}{!rows.length && <p className={styles.notice}>No matching validators in the directory. Try a different name or paste a full hotkey below.</p>}<div className={styles.pagination}><button disabled={!result.pagination.prev_page} onClick={() => changePage(result.pagination.prev_page!)}>← Previous</button><span>Page {result.pagination.current_page} of {result.pagination.total_pages}</span><button disabled={!result.pagination.next_page} onClick={() => changePage(result.pagination.next_page!)}>Next →</button></div></>}
    <HotkeyLookup />
  </section>;
}
function HotkeyLookup() {
  const [address, setAddress] = useState("");
  const valid = /^[1-9A-HJ-NP-Za-km-z]{46,50}$/.test(address.trim());
  return <div className={styles.lookup}><label>Open any validator by hotkey<input value={address} onChange={event => setAddress(event.target.value)} placeholder="Paste the full SS58 hotkey" /></label>{valid ? <Link href={`/validators/${address.trim()}`} prefetch={false}>Open validator →</Link> : <span>Enter a full hotkey to open its profile.</span>}</div>;
}
