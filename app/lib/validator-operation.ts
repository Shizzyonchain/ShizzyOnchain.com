export type DelegationEdge = { parent: string; child: string; proportion: string };
export type OperatingNeuron = { hotkey: string; active: boolean; validator_permit: boolean; updated: number; total_alpha_stake: string; dividends: string; timestamp: string };
// ParentKeys uses u64 proportions. A partial or nested path is not sufficient
// evidence for the entire parent. Never substitute a child's APY for its parent.
export function delegatedOperation(hotkey: string, edges: DelegationEdge[], neurons: OperatingNeuron[], cutoff: number) {
  const paths = edges.filter(edge => edge.parent === hotkey);
  if (!paths.length || new Set(paths.map(edge => edge.child)).size !== paths.length) return null;
  let total = BigInt(0);
  try { for (const edge of paths) { const amount = BigInt(edge.proportion); if (amount <= BigInt(0)) return null; total += amount; } } catch { return null; }
  if (total !== BigInt('18446744073709551615')) return null;
  const children = paths.map(edge => neurons.find(row => row.hotkey === edge.child));
  if (!Number.isFinite(cutoff) || cutoff <= 0 || children.some(row => !row || !row.active || !row.validator_permit || !Number.isFinite(row.updated) || row.updated < 0 || row.updated > cutoff || !Number.isFinite(Number(row.dividends)) || Number(row.dividends) <= 0 || edges.some(edge => edge.parent === row.hotkey))) return null;
  const rows = children as OperatingNeuron[];
  if (rows.some(row => !Number.isFinite(Number(row.total_alpha_stake)) || Number(row.total_alpha_stake) < 0)) return null;
  return { children: rows.map(row => row.hotkey), updated: Math.max(...rows.map(row => row.updated)), stake: rows.reduce((sum, row) => sum + Number(row.total_alpha_stake), 0), dividends: Math.min(...rows.map(row => Number(row.dividends))), timestamps: rows.map(row => row.timestamp) };
}
