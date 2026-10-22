import type { WalletActivity } from "./wallet-activity";

// Raw rao comparison preserves the exact 5 TAO boundary without float rounding.
export function visibleWalletActivity(rows: WalletActivity[], kind: "transfers" | "transactions") {
  if (kind === "transactions") return rows;
  return rows.filter(row => row.amount !== null && /^\d+$/.test(row.amount) && BigInt(row.amount) >= BigInt(5_000_000_000));
}

