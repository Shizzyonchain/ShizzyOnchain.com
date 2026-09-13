export const liquidationExplanation = "Estimated deregistration payout compared with the current alpha price. +20% means the estimate is 20% above market; −20% means 20% below. Applies only if the subnet is deregistered. Ordinary sales use market price and incur price impact.";

export function liquidationPercent(value: string | number | null | undefined): string {
  if (value == null || value === "" || !Number.isFinite(Number(value))) return "—";
  const n = Number(value);
  return `${n > 0 ? "+" : ""}${n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}%`;
}

export function compareLiquidation(a: string | number | null | undefined, b: string | number | null | undefined, direction: "asc" | "desc") {
  const missingA = a == null || a === "" || !Number.isFinite(Number(a));
  const missingB = b == null || b === "" || !Number.isFinite(Number(b));
  if (missingA || missingB) return Number(missingA) - Number(missingB);
  return direction === "desc" ? Number(b) - Number(a) : Number(a) - Number(b);
}
