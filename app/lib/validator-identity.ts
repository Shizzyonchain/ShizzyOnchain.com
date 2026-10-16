export type FamilyRow = { hotkey: string; netuid: number; timestamp: string; parents: { hotkey: string; proportion: string }[] };
export type NamedValidator = { hotkey: string; name: string | null; timestamp: string };
export type ParentIdentity = { hotkey: string; name: string | null; subnets: number[] };
export type ResolvedIdentity = { label: string | null; parents: ParentIdentity[]; observedAt: string | null };

export function resolveParentIdentity(hotkey: string, netuid: number | null, family: FamilyRow[], directory: NamedValidator[], now: number): ResolvedIdentity {
  const fresh = (time: string) => Number.isFinite(Date.parse(time)) && now - Date.parse(time) <= 2 * 3600_000 && Date.parse(time) <= now + 60_000;
  const names = new Map(directory.filter(v => fresh(v.timestamp) && v.name?.trim() && v.name !== v.hotkey).map(v => [v.hotkey, v.name!.trim()]));
  const parents = new Map<string, ParentIdentity>();
  let observedAt: string | null = null;
  for (const row of family) {
    if (row.hotkey !== hotkey || (netuid !== null && row.netuid !== netuid) || !fresh(row.timestamp) || !Array.isArray(row.parents)) continue;
    for (const parent of row.parents) {
      if (parent.hotkey === hotkey || !Number.isFinite(Number(parent.proportion)) || Number(parent.proportion) <= 0) continue;
      const resolved = parents.get(parent.hotkey) || { hotkey: parent.hotkey, name: names.get(parent.hotkey) || null, subnets: [] };
      if (!resolved.subnets.includes(row.netuid)) resolved.subnets.push(row.netuid);
      parents.set(parent.hotkey, resolved);
      const named = directory.find(v => v.hotkey === parent.hotkey && fresh(v.timestamp) && v.name?.trim());
      const evidenceTimes = [row.timestamp, ...(named ? [named.timestamp] : [])];
      for (const time of evidenceTimes) if (!observedAt || time < observedAt) observedAt = time;
    }
  }
  const list = [...parents.values()].sort((a, b) => a.hotkey.localeCompare(b.hotkey));
  return { label: list.length === 1 && list[0].name ? `${list[0].name} · child hotkey` : list.length > 1 ? `Child hotkey · ${list.length} parents` : list.length === 1 ? "Child hotkey · unnamed parent" : null, parents: list, observedAt };
}
