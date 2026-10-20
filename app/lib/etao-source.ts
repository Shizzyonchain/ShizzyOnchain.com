import "server-only";
import { getCache } from "@vercel/functions";
import seed from "../data/etao.json";
import { decodeEmission, emissionPrefix, type EmissionObservation } from "./etao";
export type EtaoSnapshot = Omit<typeof seed, "weights" | "observations" | "names"> & { weights: Record<string, string[]>; names: Record<string, string>; observations: EmissionObservation[] };
const cache = () => getCache({ namespace: "shizzy-etao-v1" });
export async function getEtaoSnapshot(): Promise<EtaoSnapshot> {
  try {
    const cached = await cache().get("snapshot") as EtaoSnapshot | null;
    if (!cached) return seed;
    const latest = cached.block > seed.block ? cached : seed;
    const changes = [...new Map([...cached.changes, ...seed.changes].map(row => [`${row.block}-${row.extrinsic}`, row])).values()];
    // Daily reviewed history takes precedence over an older cached manifest.
    return { ...latest, changes, names: { ...cached.names, ...seed.names }, observations: cached.observations.filter(row => !seed.changes.some(change => change.netuid === row.netuid && change.block > row.fromBlock && change.block <= row.toBlock && JSON.stringify(change.after) === JSON.stringify(row.after))) };
  }
  catch { return seed; }
}
export async function getEtaoPageData() { const data = await getEtaoSnapshot(); return { data, stale: Date.now() - Date.parse(data.checkedAt) > 30 * 60_000 }; }
export async function refreshEtao() {
  const previous = await getEtaoSnapshot();
  const endpoint = process.env.ETAO_RPC_URL || "wss://archive.chain.opentensor.ai:443";
  // One read-only connection; no signer or wallet access.
  const socket = new WebSocket(endpoint);
  const pending = new Map<number, { resolve: (v: unknown) => void; reject: (e: Error) => void }>();
  let id = 0;
  const fail = () => { for (const request of pending.values()) request.reject(new Error("Chain connection unavailable")); pending.clear(); };
  socket.addEventListener("message", event => {
    const message = JSON.parse(String(event.data)); const request = pending.get(message.id);
    if (!request) return; pending.delete(message.id);
    if (message.error) request.reject(new Error("Chain read rejected")); else request.resolve(message.result);
  });
  socket.addEventListener("error", fail); socket.addEventListener("close", fail);
  const timeout = setTimeout(() => { fail(); socket.close(); }, 45_000);
  try {
    await new Promise<void>((resolve, reject) => { socket.addEventListener("open", () => resolve(), { once: true }); socket.addEventListener("error", () => reject(new Error("Chain connection failed")), { once: true }); socket.addEventListener("close", () => reject(new Error("Chain connection closed")), { once: true }); });
    const rpc = <T,>(method: string, params: unknown[]) => new Promise<T>((resolve, reject) => { const key = ++id; pending.set(key, { resolve: value => resolve(value as T), reject }); socket.send(JSON.stringify({ jsonrpc: "2.0", id: key, method, params })); });
    const hash = await rpc<string>("chain_getFinalizedHead", []);
    const [header, runtime] = await Promise.all([rpc<{ number: string }>("chain_getHeader", [hash]), rpc<{ specVersion: number }>("state_getRuntimeVersion", [hash])]);
    const block = parseInt(header.number, 16);
    if (block < previous.block || runtime.specVersion < 481) throw new Error("Chain snapshot is behind the verified baseline");
    let start = emissionPrefix; const keys: string[] = [];
    for (;;) {
      const page = await rpc<string[]>("state_getKeysPaged", [emissionPrefix, 256, start, hash]);
      keys.push(...page); if (page.length < 256) break; start = page.at(-1)!;
      if (keys.length > 65536) throw new Error("Invalid subnet count");
    }
    if (!keys.length) throw new Error("Missing emission storage");
    const groups = await rpc<{ changes: [string, string | null][] }[]>("state_queryStorageAt", [keys, hash]);
    const weights: Record<string, string[]> = {};
    for (const [key, value] of groups.flatMap(group => group.changes)) {
      if (!value || !key.startsWith(emissionPrefix) || key.length !== emissionPrefix.length + 4) throw new Error("Incomplete emission snapshot");
      weights[String(Buffer.from(key.slice(emissionPrefix.length), "hex").readUInt16LE())] = decodeEmission(value);
    }
    if (Object.keys(weights).length !== keys.length) throw new Error("Incomplete emission snapshot");
    const checkedAt = new Date().toISOString();
    const observations = [...previous.observations];
    for (const netuid of new Set([...Object.keys(previous.weights), ...Object.keys(weights)])) {
      if (JSON.stringify(previous.weights[netuid]) !== JSON.stringify(weights[netuid])) observations.push({ netuid: Number(netuid), before: previous.weights[netuid] || null, after: weights[netuid] || null, fromBlock: previous.block, toBlock: block, detectedAt: checkedAt });
    }
    // This cache supplements the checked-in audit; it is not a permanent event archive.
    const snapshot: EtaoSnapshot = { ...previous, block, hash, runtime: runtime.specVersion, checkedAt, weights, observations: observations.slice(-1000), source: process.env.ETAO_RPC_URL ? "Configured chain RPC" : "Opentensor archive RPC" };
    await cache().set("snapshot", snapshot, { ttl: 30 * 86400 });
    return { block, subnets: keys.length, observations: observations.length, checkedAt };
  } finally { clearTimeout(timeout); socket.close(); }
}
