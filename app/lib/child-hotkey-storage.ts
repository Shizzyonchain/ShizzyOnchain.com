import { createHash } from "node:crypto";

// SubtensorModule.ParentKeys: Blake2_128Concat(AccountId32), Identity(u16)
// -> SCALE Vec<(u64 proportion, AccountId32 parent)>.
// https://github.com/opentensor/subtensor/blob/main/pallets/subtensor/src/lib.rs
export const parentKeysPrefix = "0x658faa385070e074c85bf6b568cf0555de41ae13ae40a9d3c5fd9b3bdea86fe2";
const alphabet = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
export function ss58(account: Buffer) {
  const body = Buffer.concat([Buffer.from([42]), account]);
  const checksum = createHash("blake2b512").update(Buffer.concat([Buffer.from("SS58PRE"), body])).digest().subarray(0, 2);
  const bytes = Buffer.concat([body, checksum]);
  let value = BigInt(`0x${bytes.toString("hex")}`), encoded = "";
  while (value) { encoded = alphabet[Number(value % BigInt(58))] + encoded; value /= BigInt(58); }
  return encoded;
}
export function decodeChildStorage(key: string, value: string | null): { hotkey: string; netuid: number; isChild: boolean; parents: string[]; delegations: { parent: string; proportion: string }[] } {
  if (!key.startsWith(parentKeysPrefix) || key.length !== 166 || !value || !/^0x(?:[\da-f]{2})+$/i.test(value)) throw new Error("Unexpected ParentKeys storage shape");
  const bytes = Buffer.from(value.slice(2), "hex"), mode = bytes[0] & 3;
  const offset = mode === 0 ? 1 : mode === 1 ? 2 : mode === 2 ? 4 : 0;
  if (!offset || bytes.length < offset) throw new Error("Unexpected parent vector encoding");
  const length = mode === 0 ? bytes[0] >> 2 : mode === 1 ? bytes.readUInt16LE(0) >> 2 : bytes.readUInt32LE(0) >>> 2;
  if (length > 4096 || bytes.length !== offset + length * 40) throw new Error("Unexpected parent vector length");
  let isChild = false;
  const parents: string[] = [];
  const delegations: { parent: string; proportion: string }[] = [];
  for (let i = 0; i < length; i++) if (bytes.readBigUInt64LE(offset + i * 40) > BigInt(0)) { isChild = true; const parent = ss58(bytes.subarray(offset + i * 40 + 8, offset + i * 40 + 40)); parents.push(parent); delegations.push({ parent, proportion: bytes.readBigUInt64LE(offset + i * 40).toString() }); }
  return { hotkey: ss58(Buffer.from(key.slice(98, 162), "hex")), netuid: Buffer.from(key.slice(162), "hex").readUInt16LE(0), isChild, parents, delegations };
}

export async function scanChildHotkeys(endpoint: string) {
  let id = 0;
  const signal = AbortSignal.timeout(20_000);
  async function rpc<T>(method: string, params: unknown[]): Promise<T> {
    const response = await fetch(endpoint, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ jsonrpc: "2.0", id: ++id, method, params }), signal, cache: "no-store" });
    if (!response.ok) throw new Error("Child-hotkey chain check unavailable");
    const payload = await response.json();
    if (payload.error || payload.result === undefined) throw new Error("Child-hotkey chain check failed");
    return payload.result as T;
  }
  const hash = await rpc<string>("chain_getFinalizedHead", []);
  const header = await rpc<{ number: string }>("chain_getHeader", [hash]);
  let start = parentKeysPrefix, inspected = 0;
  const children = new Set<string>();
  const parents = new Set<string>();
  const subnetChildren: Record<string, string[]> = {};
  const subnetParents: Record<string, string[]> = {};
  const edges: Record<string, { parent: string; child: string; proportion: string }[]> = {};
  while (true) {
    const keys = await rpc<string[]>("state_getKeysPaged", [parentKeysPrefix, 1000, start, hash]);
    if (!keys.length) break;
    if (keys[keys.length - 1] <= start || new Set(keys).size !== keys.length) throw new Error("ParentKeys pagination did not advance");
    const groups = await rpc<{ changes: [string, string | null][] }[]>("state_queryStorageAt", [keys, hash]);
    const changes = groups.flatMap(group => group.changes);
    if (changes.length !== keys.length || new Set(changes.map(([key]) => key)).size !== keys.length || changes.some(([key]) => !keys.includes(key))) throw new Error("Incomplete ParentKeys page");
    for (const [key, value] of changes) {
      const row = decodeChildStorage(key, value);
      if (row.isChild) { children.add(row.hotkey); (subnetChildren[row.netuid] ||= []).push(row.hotkey); }
      for (const edge of row.delegations) (edges[row.netuid] ||= []).push({ ...edge, child: row.hotkey });
      for (const parent of row.parents) { parents.add(parent); (subnetParents[row.netuid] ||= []).push(parent); }
    }
    inspected += keys.length;
    if (inspected > 50_000) throw new Error("ParentKeys scan exceeded its bound");
    start = keys[keys.length - 1];
  }
  if (!inspected) throw new Error("ParentKeys schema could not be verified");
  return { hotkeys: [...children].filter(hotkey => !parents.has(hotkey)).sort(), subnetChildren, subnetParents, edges, inspected, block: Number.parseInt(header.number, 16), blockHash: hash, checkedAt: new Date().toISOString() };
}
