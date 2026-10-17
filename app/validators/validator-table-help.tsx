"use client";

import { createContext, useContext, useId, useState, type ReactNode } from "react";
import styles from "./validators.module.css";

const explanations: [string[], string][] = [
  [["Why & watch"], "Open this validator’s explanation to see its largest weighted score contributions for your selected preference, plus measured capital downside, relative weaknesses, holdings exposure and current fees. These use the loaded data and do not verify operator security or predict future outcomes."],
  [["Operating path"], "Direct means this hotkey operates with its own permit. Delegated means 100% of its chain delegation is to verified active direct children; its own net yield is still required. Unverified paths cannot rank."],
  [["Permit"], "The source reports whether this hotkey holds a validator permit on this subnet. A parent can operate through child permits instead. A permit alone does not establish service quality."],
  [["Active flag"], "The metagraph activity flag at the dated snapshot. Stale data is labelled explicitly. This is not independent server uptime monitoring."],
  [["Weight update age"], "Blocks since the hotkey last updated weights, as reported by the metagraph. Compare against the subnet activity cutoff in the finder; root and alpha activity rules differ."],
  [["Capital drawdown"], "Largest peak-to-trough daily-close decline in realizable value per basket share during the common completed 30-day window. Intraday losses are not captured."],
  [["Capital volatility"], "Standard deviation of daily changes in realizable basket value per share. Lower historical volatility does not guarantee lower future risk."],
  [["Top five holdings"], "Share of realizable basket NAV concentrated in its five largest holdings."],
  [["Quote gap"], "Difference between the basket spot mark and whole-fund realizable value, divided by spot value. This is not your personal exit fee."],
  [["Basket value τ", "Realizable value τ"], "Estimated TAO obtainable from selling the basket holdings at the source snapshot, accounting for liquidity and fees. This is the whole fund’s NAV, not your root principal or personal claim amount. Quotes change with the pools."],
  [["Spot value τ"], "Alpha amount multiplied by its spot price, expressed in TAO. This display mark does not account for the price impact of selling a holding. Realizable value is the basis used for basket allocations here."],
  [["7d staker return", "30d staker return"], "TaoStats’ historical basket staker total return over the stated period, combining accrued income and changes in value. This is a period return, not APY. A dash means the source lacks comparable observations within the same fund life. It is not a guaranteed personal wallet return."],
  [["7d capital return"], "Change in realizable basket value per share over seven days. This tracks capital performance, separately from staker total return which includes accrual. It is not annualized; negative values are possible. Missing history stays unavailable."],
  [["Holdings"], "Open the validator’s actual escrowed root reward basket positions from the same snapshot. These are separate from personal wallet holdings and ordinary delegated subnet stake. Opening them makes no additional data request."],
  [["Alpha held"], "Native units held in the root basket: alpha on each subnet, or TAO for the SN0 cash slot. Alpha quantities from different subnets are different tokens."],
  [["Basket allocation"], "This holding’s realizable TAO value divided by the whole basket’s realizable NAV. This is current value exposure at the snapshot, not a target weight or evidence of a new trade."],
  [["Rank"], "The validator’s position in TaoStats’ overall leaderboard. This is a provider ranking, not our recommendation score or a security rating."],
  [["Validator"], "The validator’s on-chain identity or shortened hotkey address. Select its name to open the detailed profile. Different hotkeys can share the same name."],
  [["Take"], "The validator’s reward fee, shown as a percentage. For example, 9% take means a 9% validator cut of the applicable rewards—not 9% of your deposited stake. Subnet and child-hotkey arrangements can affect the final reward split."],
  [["Root stake τ", "Root τ"], "TAO delegated to this validator on root (SN0), before protocol weighting. τ means TAO."],
  [["Alpha value τ", "Alpha value τ"], "The validator’s subnet alpha stake valued in TAO at the source snapshot. This value can change because alpha prices move, even without deposits or withdrawals."],
  [["Weighted stake τ", "Weighted τ"], "Protocol-weighted stake across root and alpha. Root TAO is weighted before being combined with alpha value. This measures stake weight, not withdrawable TAO or a wallet balance."],
  [["24h weighted Δ τ"], "Change in protocol-weighted stake over the provider’s 24-hour comparison period, expressed in TAO. Green means higher and red means lower. Price movements and weighting can contribute, so this is not simply net deposits or profit."],
  [["Dominance"], "The validator’s percentage share of the provider’s network stake-weight measure. This describes concentration, not the validator’s yield or a percentage of all TAO supply."],
  [["Nominators"], "The number of delegating accounts reported by TaoStats for this validator. Accounts are not necessarily separate people."],
  [["Subnets"], "The number of active subnets reported for this validator at the snapshot. More subnet coverage does not automatically mean better performance on your chosen subnet."],
  [["Subnet"], "The subnet number and current name. SN0 is root; other subnet positions hold their own alpha token."],
  [["Stake"], "The hotkey’s stake on this subnet, shown in native units: TAO (τ) on root, alpha (α) on other subnets. Alpha amounts from different subnets cannot be compared as if they were the same token."],
  [["1h APY", "1d APY", "7d APY", "30d APY", "1h net APY", "1d net APY", "7d net APY", "30d net APY"], "Nominator yield after the reward fees applied during the measured window, including applicable child-hotkey splits. Take is already reflected and is not deducted again. A recent fee change may not yet be fully reflected in the historical average. Historical annualized compounded yield calculated from the window in the heading: 1 hour, 1 day, 7 days or 30 days. It is not the return earned within that window, a token-price change or a promise of future returns. Compare the same subnet and window."],
  [["7d participation", "30d participation"], "The provider’s reported participation in reward epochs over the stated window. For example, 100% means full reported epoch participation. It is not a measurement of server uptime; a dash means unavailable."],
  [["Emission share"], "The subnet’s share of network TAO allocation from our Finney-backed market feed. This is a subnet-wide figure, not this validator’s personal rewards or fee. Its source time is shown separately from the yield snapshot."],
  [["Snapshot UTC"], "The time of the source’s original data snapshot, displayed in Coordinated Universal Time (UTC). Cached figures are not a live feed; different source snapshots may have different times."],
  [["Block"], "The Bittensor block height associated with this historical snapshot. It identifies the chain state behind the figures on that row."],
  [["Score"], "Our provisional 0–100 match score for the selected preference, calculated only for qualifying validators. It combines the published method’s factors; it is not a safety rating or guaranteed return. Not ranked means an evidence requirement was not met."],
  [["Stake weight share"], "This direct hotkey’s share, or the delegated parent’s conservative full operating-child share, of total stake weight among the selected subnet’s direct permit holders in the metagraph snapshot. Lower concentration receives more weight in Decentralization mode. This differs from network-wide dominance."],
  [["Evidence"], "Open this row’s details to see source timestamps or the exact reasons it was excluded. Missing or stale evidence prevents a recommendation rather than being treated as a favorable value."],
];
const help = new Map(explanations.flatMap(([labels, text]) => labels.map(label => [label.toLowerCase(), text] as const)));
const HelpId = createContext<string | undefined>(undefined);

export function ValidatorColumn({ label }: { label: string }) {
  const helpId = useContext(HelpId);
  return <th scope="col"><button type="button" className={styles.columnButton} aria-label={`Explain ${label}`} aria-describedby={helpId}>{label}</button></th>;
}

export function ValidatorTableHelp({ children }: { children: ReactNode }) {
  const id = useId();
  const [label, setLabel] = useState("Column guide");
  function explain(target: EventTarget) {
    if (!(target instanceof Element)) return;
    const cell = target.closest<HTMLTableCellElement>("th,td");
    if (!cell) return;
    const heading = cell.closest("table")?.querySelector("thead tr")?.children[cell.cellIndex];
    const next = heading?.textContent?.trim();
    if (next && help.has(next.toLowerCase())) setLabel(next);
  }
  return <HelpId.Provider value={id}><div onPointerOver={event => explain(event.target)} onFocus={event => explain(event.target)} onClick={event => explain(event.target)}>
    <div id={id} className={styles.columnHelp} role="status" aria-live="polite" aria-atomic="true"><strong>{label}</strong><p>{help.get(label.toLowerCase()) || "Hover over a heading or value to see its meaning here. You can also tap a heading or select it with the keyboard."}</p></div>
    {children}
  </div></HelpId.Provider>;
}
