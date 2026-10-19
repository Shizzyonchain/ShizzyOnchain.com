"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { rankValidators, type Candidate, type RankedCandidate, type RankingMode } from "../lib/validator-ranking";
import { displayNumber, shortAddress } from "../lib/validator-types";
import { ValidatorTableScroll } from "./validator-table-scroll";
import { RecommendationLoading } from "./recommendation-loading";
import { ValidatorYieldChecks } from "./validator-yield-checks";
import { yieldCandidates, type YieldChecks } from "../lib/validator-yield-check";
import styles from "./validators.module.css";

import { ValidatorColumn, ValidatorTableHelp } from "./validator-table-help";

type Result = { candidates: Candidate[]; collectedAt: string; netuid: number; coverage: { permitHolders: number; yieldRows: number; directoryEntries: number; hiddenChildren?: number } };
const modes: { value: RankingMode; label: string; method: string }[] = [
  { value: "balanced", label: "Balanced", method: "Yield 30% · agreement between windows 25% · participation 25% · update recency 10% · decentralization 10%." },
  { value: "yield", label: "Yield", method: "Yield 60% · agreement 20% · participation 10% · update recency 5% · decentralization 5%." },
  { value: "fees", label: "Low fees", method: "Lower take 35% · participation 20% · yield 15% · agreement 15% · decentralization 10% · update recency 5%. This preference explicitly favors lower fees." },
  { value: "decentralization", label: "Decentralization", method: "Lower subnet stake share 40% · agreement 20% · participation 20% · yield 15% · update recency 5%." },
];
const pct = (value: number | null) => value === null ? "—" : `${displayNumber(value * 100)}%`;
function YieldValue({ row, days }: { row: Candidate; days: 7 | 30 }) {
  const value = days === 7 ? row.yield7 : row.yield30;
  const apr = days === 7 ? row.apr7 : row.apr30;
  return row.yieldBasis === "chain-net" ? <>{pct(value)} APY<small>{pct(apr ?? null)} APR</small></> : value === null ? <>—</> : <>{pct(value)} reported<small>Compounding method unconfirmed</small></>;
}

function MobileValidatorResults({ rows }: { rows: RankedCandidate[] }) {
  const qualifying = rows.filter(row => row.score !== null);
  const excluded = rows.filter(row => row.score === null);
  const renderRow = (row: RankedCandidate, index: number) => <article className={styles.phoneResult} key={row.hotkey}>
    <div className={styles.phoneResultHeading}><Link href={`/validators/${row.hotkey}`} prefetch={false}>{row.name === row.hotkey ? shortAddress(row.hotkey) : row.name}</Link><span>{row.score === null ? "Not ranked" : `#${index + 1} · ${row.score}/100`}</span></div>
    <dl className={styles.phoneResultNumbers}><div><dt>30d net annualized</dt><dd><YieldValue row={row} days={30} /></dd></div><div><dt>Validator take</dt><dd>{pct(row.take)}</dd></div></dl>
    <details className={styles.phoneResultDetails}><summary>{row.score === null ? "Why not ranked" : "Why it ranks · details"}</summary>
      <ul>{(row.excluded.length ? row.excluded : row.reasons).map(reason => <li key={reason}>{reason}</li>)}</ul>
      <dl><div><dt>7d net annualized</dt><dd><YieldValue row={row} days={7} /></dd></div><div><dt>7d / 30d participation</dt><dd>{pct(row.participation7)} / {pct(row.participation30)}</dd></div><div><dt>Subnet stake share</dt><dd>{pct(row.stakeShare)}</dd></div><div><dt>Operating path</dt><dd>{row.operation || "direct"}</dd></div></dl>
      <p className={styles.source}>Source snapshots (UTC): {row.timestamps.join(" · ") || "Unavailable"}</p>
      <Link href={`/validators/${row.hotkey}`} prefetch={false}>Full validator profile →</Link>
    </details>
  </article>;
  return <div className={styles.phoneResults}><p className={styles.phoneResultsCaption}>{qualifying.length} qualifying · {rows.length} reviewed. Annualized historical rates, after take.</p>
    {qualifying.map(renderRow)}
    {excluded.length > 0 && <details className={styles.phoneExcluded}><summary>{excluded.length} validators not ranked · see why</summary>{excluded.map(renderRow)}</details>}
  </div>;
}

export function ValidatorFinder({ subnets }: { subnets: { netuid: number; name: string }[] }) {
  const [selection, setSelection] = useState("");
  const [mode, setMode] = useState<RankingMode>("balanced");
  const [result, setResult] = useState<Result | null>(null);
  const [yieldChecks, setYieldChecks] = useState<YieldChecks | null>(null);
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
    let timer: ReturnType<typeof setTimeout> | undefined;
    let attempts = 0;
    const read = async () => {
      try {
        const response = await fetch(`/api/validators/recommendations?netuid=${request.netuid}`, { signal: controller.signal });
        const payload = await response.json();
        if (controller.signal.aborted) return;
        if (response.status === 202) {
          if (++attempts >= 24) throw new Error("This subnet is still being prepared in the background. Please try again shortly.");
          timer = setTimeout(read, 5000);
          return;
        }
        if (!response.ok) throw new Error(payload.error || "Recommendation sources unavailable.");
        setResult(payload); setNow(Date.now()); setError(""); setLoading(false);
      } catch (reason) {
        if (!controller.signal.aborted) { setError(reason instanceof Error ? reason.message : "Recommendations unavailable."); setLoading(false); }
      }
    };
    void read();
    return () => { controller.abort(); clearTimeout(timer); };
  }, [request]);
  const yieldData = useMemo(() => yieldCandidates(result?.candidates || [], yieldChecks, result?.netuid, now), [result, yieldChecks, now]);
  const rows = useMemo(() => rankValidators(yieldData.candidates, mode, now), [yieldData, mode, now]);
  const eligible = rows.filter(row => row.score !== null);
  const picked = result ? subnets.find(s => s.netuid === result.netuid) : null;
  const cards = eligible.length >= 2 ? [
    { label: `Top ${modes.find(m => m.value === mode)!.label.toLowerCase()} match`, row: eligible[0] },
    { label: "Strongest conservative net yield", row: [...eligible].sort((a, b) => Math.min(b.yield7!, b.yield30!) - Math.min(a.yield7!, a.yield30!) || a.hotkey.localeCompare(b.hotkey))[0] },
    { label: "Lowest take among qualifying validators", row: [...eligible].sort((a, b) => a.take! - b.take! || b.score! - a.score!)[0] },
  ] : [];
  return <section className={styles.finder} aria-labelledby="validator-finder-title"><p className={styles.eyebrow}>SUBNET VALIDATOR MATCH</p><h2 id="validator-finder-title">Find a validator for your subnet</h2><p>Choose a subnet. Compare performance, participation, fees and concentration with the evidence behind every result.</p>
    <form className={styles.controls} onSubmit={event => { event.preventDefault(); if (!selection) return; setLoading(true); setResult(null); setError(""); setRequest({ netuid: selection, id: Date.now() }); }}><label>Subnet<select aria-label="Subnet" required value={selection} onChange={event => setSelection(event.target.value)}><option value="">Choose a subnet</option>{subnets.filter(s => s.netuid > 0).sort((a, b) => a.netuid - b.netuid).map(s => <option key={s.netuid} value={s.netuid}>SN{s.netuid} {s.name}</option>)}</select></label><button type="submit" disabled={!selection || loading}>{loading ? "Calculating…" : "Find validators →"}</button></form>
    <div className={styles.tabs} role="group" aria-label="Validator ranking preference">{modes.map(item => <button key={item.value} aria-pressed={mode === item.value} onClick={() => setMode(item.value)}>{item.label}</button>)}</div>
    {loading && <RecommendationLoading />}
    {error && <p className={styles.notice} role="alert">{error} No winner was selected from incomplete sources. Use Find validators to retry.</p>}
    {result && <><p className={styles.source}>Yield figures are net of validator take. Recommendations compare what nominators earned after reward fees, with no second fee deduction.</p><h3>SN{result.netuid} {picked?.name || ""}</h3><details className={styles.evidenceDetails}><summary>Data quality &amp; background yield checks</summary><p className={styles.notice}>Direct validators and parents with a fully verified delegation path are reviewed. Partial, nested or unverified paths remain excluded. Scores measure the published factors; operator security, service quality and insurance claims have not been independently verified.</p><p className={styles.source}>{eligible.length} qualifying validators out of {result.candidates.length} parent/standalone candidates reviewed; {result.coverage.hiddenChildren || 0} child-only hotkeys excluded. TaoStats sources collected {new Date(result.collectedAt).toLocaleString("en-US", { timeZone: "America/New_York" })} Eastern. Rankings check source ages each minute.</p>
    <p className={styles.notice}>{yieldData.source === "chain" ? "Yield and scores now use node-calculated net APY for the same 7/30-day windows. APR is shown alongside it. Rows without complete current chain history cannot rank; provider rates are never mixed into this comparison." : "Provisional provider-rate comparison. TaoStats calls these fields APY, but its compounding and averaging method has not been independently established. They are shown as reported rates until comparable node calculations are ready."}</p>
    {result && <ValidatorYieldChecks key={result.netuid} netuid={result.netuid} candidates={result.candidates} now={now} onChecks={setYieldChecks} />}
    </details>{!cards.length && <p className={styles.notice}>Insufficient comparable data to recommend a winner. {eligible.length === 1 ? "Only one validator meets the evidence requirements." : "No validator meets all the evidence requirements."} Review the exclusions below.</p>}
    <MobileValidatorResults rows={rows} /><div className={styles.desktopFinderResults}><div className={styles.matches}>{cards.map(({ label, row }) => <article className={styles.match} key={label}><span>{label}</span><p className={styles.source}>Provisional match · {row.operation === "delegated" ? "verified delegated path" : "direct validator evidence"}</p><h3><Link href={`/validators/${row.hotkey}`} prefetch={false}>{row.name === row.hotkey ? shortAddress(row.hotkey) : row.name}</Link></h3><strong>{row.score}/100 <small>{modes.find(m => m.value === mode)!.label} score</small></strong><dl className={styles.mobileMatchFacts}><div><dt>30d net yield</dt><dd><YieldValue row={row} days={30} /></dd></div><div><dt>Take</dt><dd>{pct(row.take)}</dd></div></dl><details className={styles.cardDetails}><summary>Why this match</summary><ul>{row.reasons.map(reason => <li key={reason}>{reason}</li>)}</ul></details><p className={styles.source}>Same validator may lead more than one category.</p><Link href={`/validators/${row.hotkey}`} prefetch={false}>Explore validator →</Link></article>)}</div>
    <ValidatorTableHelp><ValidatorTableScroll className={styles.tableWrap} label="Subnet validator ranking and exclusions"><table className={`${styles.table} ${styles.pinFirst} ${styles.finderCards}`}><thead><tr>{["Validator", "Operating path", "Score", "7d net yield", "30d net yield", "Take", "7d participation", "30d participation", "Stake weight share", "Evidence"].map(label => <ValidatorColumn key={label} label={label} />)}</tr></thead><tbody>{rows.map(row => <tr key={row.hotkey}><td data-label="Validator"><Link href={`/validators/${row.hotkey}`} prefetch={false}>{row.name === row.hotkey ? shortAddress(row.hotkey) : row.name}</Link></td><td data-label="Operating path">{row.operation || "Direct"}</td><td data-label="Match score">{row.score ?? "Not ranked"}</td><td data-label="7d net yield"><YieldValue row={row} days={7} /></td><td data-label="30d net yield"><YieldValue row={row} days={30} /></td><td data-label="Take">{pct(row.take)}</td><td data-label="7d participation">{pct(row.participation7)}</td><td data-label="30d participation">{pct(row.participation30)}</td><td data-label="Stake share">{pct(row.stakeShare)}</td><td data-label="Evidence"><details><summary>{row.excluded.length ? "Why excluded" : "View sources"}</summary>{row.excluded.length > 0 && <ul>{row.excluded.map(reason => <li key={reason}>{reason}</li>)}</ul>}<p>Yield: {row.timestamps[0] || "Unavailable"}<br />Directory: {row.timestamps[1] || "Unavailable"}<br />Parameters: {row.timestamps[2] || "Unavailable"}</p><p>Operating evidence: {row.timestamps.slice(3).join(" · ") || "Unavailable"}</p>{row.operators?.map(hotkey => <p className={styles.address} key={hotkey}>Operating hotkey: {hotkey}</p>)}</details></td></tr>)}</tbody></table></ValidatorTableScroll></ValidatorTableHelp></div></>}
    <details className={styles.method}><summary>How the recommendations work</summary><p>{modes.find(item => item.value === mode)!.method}</p><p>Qualifying validators must have an active direct permit or a fully verified delegated path, positive dividends, an update within the subnet’s effective activity cutoff, positive comparable 7d and 30d net annualized yield with a known after-take basis, at least 90% reported participation in both windows, a known fee and stake share, and a hotkey first registered at least 30 days ago. All required source snapshots must be no more than two hours old and no more than one hour apart. Missing data never earns a favorable score.</p><p>Node APY compounds the measured alpha-per-share reward growth to one year. Node APR multiplies that same period return by 365 divided by its Bittensor-day length, with no additional compounding. Both are already net of reward fees. Provider fallback figures retain their original values and are explicitly labelled reported rates; their precise annualization method is unconfirmed. We do not deduct the displayed current take a second time. A recent fee change may not yet be fully reflected in a historical average. Yield compares the lower of the 7d and 30d measurements within the qualifying group. Agreement compares those two averages; it does not measure daily volatility. Decentralization favors lower stake-weight share among this subnet’s direct permit holders. Fee is shown and breaks score ties; it has no separate balanced/yield/decentralization weight, avoiding an additional fee reward on top of reported yield.</p><p>Child-only hotkeys are excluded using finalized chain ParentKeys relationships. A hotkey that delegates onward is retained as a parent; receiving delegated stake alone does not turn that parent brand into a child-only entry. Parents without a direct permit can qualify when finalized chain proportions delegate 100% to active, dividend-earning direct children with recent weight updates. Partial and nested paths are excluded. The parent must have its own net yield and participation records; child yield is never substituted. Concentration conservatively counts the operating children’s full stake weight, which can overstate the parent’s share when children serve several parents. First registration is global hotkey age, not proof of 30 days operating on this subnet. The API does not expose observation counts for the yield windows here, so these are provisional data-based matches—not a full operational or security audit. Historical annualized yield does not guarantee future returns.</p><p>Sources: <a href="https://taostats.io/docs/concepts/staking/some-of-the-math-behind-taostats" target="_blank" rel="noreferrer">Nominator return calculation</a> · <a href="https://taostats.io/docs/new/validators/get-validators-yield" target="_blank" rel="noreferrer">Yield</a> · <a href="https://taostats.io/docs/new/subnets/get-subnets-metagraph" target="_blank" rel="noreferrer">Metagraph</a> · <a href="https://taostats.io/docs/new/subnets/get-subnets-hyperparameters" target="_blank" rel="noreferrer">Activity parameters</a>. Shared hourly caches; changing preference scores existing data without another API call.</p></details>
  </section>;
}
