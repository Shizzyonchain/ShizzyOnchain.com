// A large move triggers editorial review, never an automatic causal claim or star rating.
export function validateMarketReview(report, audit) {
  if (report.date < "2026-09-26") return;
  const review = audit?.marketReview;
  if (!review || !Array.isArray(review.rows)) throw new Error(`${report.date}: marketReview snapshot required`);
  if (!Number.isFinite(Date.parse(review.observedAt)) || !review.source) throw new Error('Market review needs timestamp and source');
  const ids = new Set(review.rows.map(row => row.netuid));
  if (ids.size !== review.rows.length || report.subnets.some(s => !ids.has(s.netuid))) throw new Error('Market review must cover every subnet without duplicates');
  for (const row of review.rows) {
    const missing = !Number.isFinite(row.change24hPct) || !Number.isFinite(row.change7dPct);
    const flagged = missing || Math.abs(row.change24hPct) >= 15 || Math.abs(row.change7dPct) >= 75;
    if (!flagged) continue;
    const decision = review.decisions?.find(d => d.netuid === row.netuid);
    if (!decision || !['covered','excluded'].includes(decision.outcome) || decision.reason?.trim().length < 40 || !decision.sources?.length) {
      throw new Error(`SN${row.netuid}: material market move or missing data requires a sourced editorial decision`);
    }
    if (decision.outcome === 'covered' && !report.subnets.find(s => s.netuid === row.netuid)?.updates.length) throw new Error(`SN${row.netuid}: marked covered but no story exists`);
  }
}
