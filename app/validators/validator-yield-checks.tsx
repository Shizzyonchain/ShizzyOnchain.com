"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import type { Candidate } from "../lib/validator-ranking";
import { currentYieldCheck, type YieldChecks, type YieldWindow } from "../lib/validator-yield-check";
import { shortAddress } from "../lib/validator-types";
import { ValidatorTableScroll } from "./validator-table-scroll";
import styles from "./validators.module.css";

const percent = (n: number | undefined) => n === undefined || !Number.isFinite(n) ? "—" : `${(n * 100).toFixed(2)}%`;
function WindowCheck({ value }: { value?: YieldWindow }) {
  if (!value) return <>Pending current snapshot</>;
  if (value.status === "unavailable") return <>{value.reason || "Not independently checked"}</>;
  return <><strong>{value.status === "consistent" ? "Within tolerance" : value.status === "basis-review" ? "Annualization differs" : "Review difference"}</strong><p>Node APY {percent(value.chainApy)} · node APR {percent(value.chainApr)} · provider {percent(value.providerApy)}<br />Observed reward growth {percent(value.observedReturn)}</p>{value.status === "basis-review" && <p>The provider figure is closer to simple APR than compounded APY. The calculation method needs confirming before treating these as equivalent.</p>}<details><summary>Measurement details</summary><p>Blocks {value.startBlock}–{value.endBlock}<br />{value.start}–{value.end}<br />APY difference {percent(value.difference)} · tolerance ±{percent(value.tolerance)}</p></details></>;
}
export function ValidatorYieldChecks({ netuid, candidates, now, onChecks }: { netuid: number; candidates: Candidate[]; now: number; onChecks: (value: YieldChecks) => void }) {
  const [checks, setChecks] = useState<YieldChecks | null>(null);
  const [queueFailed, setQueueFailed] = useState(false);
  useEffect(() => {
    const controller = new AbortController();
    const url = `/api/validators/yield-checks?netuid=${netuid}&method=4`;
    let timer: number | undefined;
    let attempts = 0;
    async function read() {
      try {
        const response = await fetch(url, { signal: controller.signal });
        if (!response.ok) throw new Error("Unavailable");
        const payload = await response.json();
        if (!controller.signal.aborted) { setChecks(payload); onChecks(payload); }
      } catch {
        if (!controller.signal.aborted) { const unavailable = { netuid, state: "unavailable" }; setChecks(unavailable); onChecks(unavailable); }
      }
      if (!controller.signal.aborted && ++attempts < 7) timer = window.setTimeout(read, 30000);
    }
    void read();
    // Recommendations render first. This only queues work; the separate worker reads the node.
    void fetch(url, { method: "POST", signal: controller.signal }).then(response => {
      if (!controller.signal.aborted && !response.ok) setQueueFailed(true);
    }).catch(() => { if (!controller.signal.aborted) setQueueFailed(true); });
    return () => { controller.abort(); window.clearTimeout(timer); };
  }, [netuid, onChecks]);
  const byHotkey = new Map((checks?.state === "ready" && checks.result?.methodVersion === 4 ? checks.result.rows : []).map(row => [row.hotkey, row]));
  const rows = candidates.map(row => ({ row, check: currentYieldCheck(byHotkey.get(row.hotkey), row.yieldBlock, row.timestamps[0], now) }));
  const comparable = rows.filter(({ check }) => check && check.seven.status !== "unavailable" && check.thirty.status !== "unavailable");
  const review = comparable.filter(({ check }) => check!.seven.status === "review" || check!.thirty.status === "review").length;
  const basis = comparable.filter(({ check }) => check!.seven.status === "basis-review" || check!.thirty.status === "basis-review").length;
  const consistent = comparable.filter(({ check }) => check!.seven.status === "consistent" && check!.thirty.status === "consistent").length;
  return <section className={styles.yieldChecks} aria-label="Background yield checks"><h3>Background yield checks</h3><p role="status">{comparable.length ? `${consistent} within tolerance · ${basis} annualization differences · ${review} other differences · ${rows.length - comparable.length} not fully checked.` : checks?.state === "ready" ? "Check completed; full comparable history is unavailable for these validators. Review the details below." : checks?.state === "unavailable" || queueFailed ? "Independent chain checks are currently unavailable. Yields remain provider-reported." : "The node check runs separately. Recommendations are ready to use while it checks historical rewards."}</p><details><summary>How APR and APY are calculated</summary><p className={styles.source}>We compare alpha per stake share at the provider’s finalized block and 7,200-block daily checkpoints over 7 and 30 Bittensor days. Fees are already reflected; deposits buy shares rather than counting as earnings. Token-price changes are excluded. Within tolerance means APY differs by no more than 2 percentage points or 10% of provider APY, whichever is larger. Different averaging methods can cause differences; this is a cross-check, not a certification. APR = observed period growth × (365 / days). APY = (1 + observed period growth)^(365 / days) − 1. Both use the same measured window. Recommendations use node APY when at least two complete comparable calculations are available; provider-only comparisons are clearly provisional.</p></details>{checks?.result?.checkedAt && <p className={styles.source}>Last completed check: {checks.result.checkedAt}. Only checks matching the current yield snapshot are shown as current.</p>}<details><summary>View validator checks</summary><ValidatorTableScroll label="Independent validator yield checks"><table className={`${styles.table} ${styles.pinFirst}`}><thead><tr><th scope="col">Validator</th><th scope="col">7-day node check</th><th scope="col">30-day node check</th></tr></thead><tbody>{rows.map(({ row, check }) => <tr key={row.hotkey}><td><Link href={`/validators/${row.hotkey}`} prefetch={false}>{row.name === row.hotkey ? shortAddress(row.hotkey) : row.name}</Link></td><td><WindowCheck value={check?.seven} /></td><td><WindowCheck value={check?.thirty} /></td></tr>)}</tbody></table></ValidatorTableScroll></details></section>;
}
