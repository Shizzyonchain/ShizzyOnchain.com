export type SubnetYieldInput = {
 apy?: string | number | null; apr?: string | number | null; yield_basis?: string | null;
 time?: string | null; tempo?: string | number | null; staker_epoch_dividends_alpha?: string | number | null;
 circulating_alpha?: string | number | null; alpha_reserve?: string | number | null;
};
const finite = (value: unknown) => value === null || value === undefined || value === "" || (typeof value !== "number" && typeof value !== "string") || (typeof value === "string" && !value.trim()) || !Number.isFinite(Number(value)) ? null : Number(value);
// Presentation warning in percentage units, not a cap or a change to the calculation.
export const EXTREME_SUBNET_YIELD_PCT = 1000;
export function subnetYieldContext(row: SubnetYieldInput, now: number) {
 const apy = finite(row.apy), apr = finite(row.apr);
 const epoch = row.yield_basis === "latest-epoch-estimate";
 const supply = finite(row.circulating_alpha), reserve = finite(row.alpha_reserve), dividends = finite(row.staker_epoch_dividends_alpha), tempo = finite(row.tempo);
 const stake = supply !== null && reserve !== null && supply - reserve > 0 ? supply - reserve : null;
 const epochReturnPct = epoch && dividends !== null && dividends >= 0 && stake !== null ? dividends / stake * 100 : null;
 const epochBlocks = epoch && tempo !== null && Number.isInteger(tempo) && tempo >= 0 ? tempo + 1 : null;
 const timestamp = Date.parse(row.time || "");
 const ageSeconds = Number.isFinite(timestamp) && timestamp <= now + 60000 ? Math.max(0, Math.floor((now - timestamp) / 1000)) : null;
 const delayed = ageSeconds === null || ageSeconds > 180;
 const extreme = (apy !== null && apy >= EXTREME_SUBNET_YIELD_PCT) || (apr !== null && apr >= EXTREME_SUBNET_YIELD_PCT);
 const compoundingUnavailable = epoch && apy === null && apr !== null && apr > 0;
 const warning = !epoch ? "Basis unconfirmed" : extreme || compoundingUnavailable ? "Potentially unstable" : null;
 const ageLabel = ageSeconds === null ? "Snapshot time unavailable" : `Snapshot ${ageSeconds < 60 ? `${ageSeconds}s` : ageSeconds < 3600 ? `${Math.floor(ageSeconds / 60)}m` : ageSeconds < 86400 ? `${Math.floor(ageSeconds / 3600)}h` : `${Math.floor(ageSeconds / 86400)}d`} old${delayed ? " · delayed" : ""}`;
 return { apy, apr, epoch, stake, dividends, epochReturnPct, epochBlocks, ageSeconds, ageLabel, delayed, extreme, compoundingUnavailable, warning };
}
export function formatSubnetYield(value: number | null) {
 if (value === null) return "Unavailable";
 return `${Math.abs(value) >= 1000000 ? value.toExponential(2) : value.toLocaleString("en-US", { maximumFractionDigits: Math.abs(value) < 1 ? 4 : 2 })}%`;
}
