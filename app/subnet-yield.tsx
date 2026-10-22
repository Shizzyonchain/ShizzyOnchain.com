"use client";
import { useSyncExternalStore } from "react";
const subscribe = () => () => {};
const clientSnapshot = () => true;
const serverSnapshot = () => false;
import { formatSubnetYield, subnetYieldContext, type SubnetYieldInput } from "./lib/subnet-yield";
const alpha = (value: number | null) => value === null ? "Unavailable" : `${value.toLocaleString("en-US", { maximumFractionDigits: 6 })} α`;
export function SubnetYield({ row, now, detail = false }: { row: SubnetYieldInput; now: number; detail?: boolean }) {
 const hydrated = useSyncExternalStore(subscribe, clientSnapshot, serverSnapshot);
 const value = subnetYieldContext(row, now);
 const sourceTime = Date.parse(row.time || "");
 const initialAge = Number.isFinite(sourceTime) ? `Snapshot ${new Date(sourceTime).toISOString().slice(11, 19)} UTC` : "Snapshot time unavailable";
 return <div className={`subnet-yield${value.warning || (hydrated && value.delayed) ? " yield-caution" : ""}`}>
  <span className="yield-rate">{formatSubnetYield(value.apy)}</span>
  <small>{value.apr === null ? "APR unavailable" : `${formatSubnetYield(value.apr)} APR`}</small>
  <small>{value.epoch ? "1 epoch · subnet-wide" : "Basis unconfirmed · subnet-wide"}</small>
  <small title={row.time ? `Snapshot: ${row.time}. Reward epoch time is not supplied.` : "Source timestamp is not supplied."}>{hydrated ? value.ageLabel : initialAge}</small>
  {value.warning && <strong className="yield-warning">⚠ {value.warning}</strong>}
  {(detail || value.warning) && <details className="yield-context" onClick={event => event.stopPropagation()} onKeyDown={event => event.stopPropagation()}><summary>Basis &amp; stability</summary>
   <p>{value.epoch ? "A subnet-wide estimate from one latest net reward epoch divided by recent staked alpha. This is not a specific validator’s return or a 7/30-day measured yield." : "The feed has not confirmed the measurement basis. Do not treat this as a measured validator return."}</p>
   {value.epoch && <><p>Latest net epoch dividends: {alpha(value.dividends)}. Recent staked alpha: {alpha(value.stake)} (circulating alpha minus pool alpha). Stake may have changed after the reward epoch.</p><p>Observed epoch rate: {value.epochReturnPct === null ? "unavailable" : formatSubnetYield(value.epochReturnPct)}. Annualization interval: {value.epochBlocks === null ? "unavailable" : `${value.epochBlocks} blocks`}. APR repeats the epoch rate without compounding; APY compounds it, assuming 7,200 blocks/day for 365 days and the same rate every epoch.</p></>}
   <p>{value.extreme ? "Flagged because APY or APR is at least 1,000%. This is a context warning, not a cap or proof of an arithmetic error. " : ""}{value.compoundingUnavailable ? "Compounded APY is unavailable; it has not been replaced with a capped value. " : ""}A small or changing stake denominator and a transient reward epoch can amplify annualization. Repeating one epoch for a year is not a forecast. Net rewards already reflect fees; no second take deduction. Token-price changes are excluded.</p>
   <p>Snapshot: {row.time || "unavailable"}. This timestamps the input snapshot, not the reward epoch. Exact reward-epoch time and a multi-epoch stability history are not supplied.</p>
   {value.apy !== null && Math.abs(value.apy) >= 1000000 && <p>Uncapped APY value: {String(value.apy)}%.</p>}
  </details>}
 </div>;
}
