import type { scanChildHotkeys } from "./child-hotkey-storage";
type Index = Awaited<ReturnType<typeof scanChildHotkeys>>;
export function packChildIndex(index: Index) {
  const addresses: string[] = [], positions = new Map<string, number>();
  const intern = (key: string) => { const found = positions.get(key); if (found !== undefined) return found; const id = addresses.length; addresses.push(key); positions.set(key, id); return id; };
  const lists = (rows: Record<string, string[]>) => Object.fromEntries(Object.entries(rows).map(([subnet, keys]) => [subnet, [...new Set(keys)].map(intern)]));
  const { hotkeys, subnetChildren, subnetParents, edges, ...metadata } = index;
  return { ...metadata, addresses, hotkeys: hotkeys.map(intern), subnetChildren: lists(subnetChildren), subnetParents: lists(subnetParents), edges: Object.fromEntries(Object.entries(edges).map(([subnet, rows]) => [subnet, rows.map(row => [intern(row.parent), intern(row.child), row.proportion] as [number, number, string])])) };
}
export function unpackChildIndex(packed: ReturnType<typeof packChildIndex>): Index {
  const { addresses, hotkeys, subnetChildren, subnetParents, edges, ...metadata } = packed;
  const address = (id: number) => { if (!Number.isInteger(id) || !addresses[id]) throw new Error("Invalid chain cache reference"); return addresses[id]; };
  const lists = (rows: Record<string, number[]>) => Object.fromEntries(Object.entries(rows).map(([subnet, keys]) => [subnet, keys.map(address)]));
  return { ...metadata, hotkeys: hotkeys.map(address), subnetChildren: lists(subnetChildren), subnetParents: lists(subnetParents), edges: Object.fromEntries(Object.entries(edges).map(([subnet, rows]) => [subnet, rows.map(([parent, child, proportion]) => ({ parent: address(parent), child: address(child), proportion }))])) };
}
