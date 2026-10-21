import { createHash } from "node:crypto";
export function validWalletAddress(address: string) {
  if (!/^5[1-9A-HJ-NP-Za-km-z]{47}$/.test(address)) return false;
  const alphabet = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
  let value = BigInt(0);
  for (const char of address) value = value * BigInt(58) + BigInt(alphabet.indexOf(char));
  const bytes = Buffer.from(value.toString(16).padStart(70, "0"), "hex");
  if (bytes.length !== 35 || bytes[0] !== 42) return false;
  const checksum = createHash("blake2b512").update(Buffer.concat([Buffer.from("SS58PRE"), bytes.subarray(0, 33)])).digest();
  return bytes.subarray(33).equals(checksum.subarray(0, 2));
}
export type WalletActivity = { id: string; extrinsic: string; timestamp: string; action: string; success: boolean | null; amount: string | null; from: string | null; to: string | null };
export function activityRows(data: unknown, kind: "transactions" | "transfers", address: string): WalletActivity[] {
  if (!Array.isArray(data)) throw new Error("Invalid wallet activity");
  return data.map(row => {
    if (!row || typeof row !== "object") throw new Error("Invalid transaction evidence");
    const extrinsic = kind === "transfers" ? row.extrinsic_id : row.id;
    if (typeof row.id !== "string" || !row.id || row.id.length > 128 || !/^\d+-\d+$/.test(extrinsic) || !Number.isFinite(Date.parse(row.timestamp))) throw new Error("Invalid transaction evidence");
    if (kind === "transactions") {
      if (row.signer_address !== address || typeof row.success !== "boolean" || typeof row.pallet !== "string" || typeof row.name !== "string") throw new Error("Wrong wallet transaction");
      return { id: row.id, extrinsic, timestamp: row.timestamp, action: `${row.pallet}.${row.name}`, success: row.success, amount: null, from: null, to: null };
    }
    if ((row.from !== address && row.to !== address) || row.network !== "finney" || typeof row.amount !== "string" || !/^\d+$/.test(row.amount)) throw new Error(`Invalid wallet transfer (network=${String(row.network)}, amountType=${typeof row.amount}, related=${row.from === address || row.to === address})`);
    return { id: row.id, extrinsic, timestamp: row.timestamp, action: row.from === address && row.to === address ? "Self transfer" : row.from === address ? "Sent TAO" : "Received TAO", success: null, amount: row.amount, from: row.from, to: row.to };
  });
}
