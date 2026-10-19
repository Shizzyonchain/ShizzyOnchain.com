// Preparation age is separate from evidence age: fetching again never makes old evidence fresh.
export function recommendationNeedsRefresh(snapshot: { preparedAt: string; candidates: { operation?: string; operatorIdentities?: unknown[] }[] }, now: number) {
  const prepared = Date.parse(snapshot.preparedAt);
  return !Number.isFinite(prepared) || prepared > now + 60000 || now - prepared >= 900000 || snapshot.candidates.some(row => row.operation === "delegated" && !row.operatorIdentities);
}
