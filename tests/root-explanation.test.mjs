import assert from 'node:assert/strict';
import test from 'node:test';
import { rankRootMatches } from '../app/lib/root-ranking.ts';
import { explainRootMatch } from '../app/lib/root-explanation.ts';
const now = Date.parse('2026-10-17T10:00:00Z');
const base = { hotkey: 'a', name: 'A', take: .09, totalReturn: .03, drawdown: -.01, volatility: .001, concentration: .05, quoteGap: .01, topFive: .2, snapshot: '2026-10-17T09:50:00Z', identityTimestamp: '2026-10-17T09:50:00Z', operatingTimestamp: '2026-10-17T09:50:00Z', start: '2026-09-16', end: '2026-10-16' };
test('explanations reflect exact weighted contributions and change with preference', () => {
  const other = { ...base, hotkey: 'b', totalReturn: .02, drawdown: -.001, volatility: .0001, concentration: .01, quoteGap: 0 };
  const balanced = rankRootMatches([base, other], 'balanced', now).find(row => row.hotkey === 'a');
  const returns = rankRootMatches([base, other], 'returns', now).find(row => row.hotkey === 'a');
  for (const row of [balanced, returns]) assert.equal(row.score, Math.round(row.factors.reduce((sum, f) => sum + f.points, 0) * 10) / 10);
  assert.match(explainRootMatch(balanced).why[0], /30\.0 of 30/);
  assert.match(explainRootMatch(returns).why[0], /50\.0 of 50/);
  assert.match(explainRootMatch(balanced).watch.join(' '), /1\.00%/);
  assert.match(explainRootMatch(balanced).watch.join(' '), /9\.00%/);
});
test('ties receive half credit and zero observed drawdown is not called protection', () => {
  const rows = rankRootMatches([{ ...base, drawdown: 0 }, { ...base, hotkey: 'b', drawdown: 0 }], 'balanced', now);
  assert.equal(rows[0].score, 50);
  assert.ok(rows[0].factors.every(f => f.percentile === .5));
  assert.match(explainRootMatch(rows[0]).watch[0], /does not establish protection/);
});
