type SearchableSubnet = { netuid: number; name?: string | null; symbol?: string | null };

export function matchesSubnetQuery(row: SearchableSubnet, query: string) {
  const normalized = query.trim().toLowerCase().replace(/\s+/g, " ");
  if (!normalized) return true;
  const subnet = /^(?:(?:sn|subnet)\s*)?#?\s*(\d+)$/.exec(normalized);
  if (subnet) return row.netuid === Number(subnet[1]);
  return `${row.name || ""} ${row.symbol || ""}`.toLowerCase().replace(/\s+/g, " ").includes(normalized);
}
