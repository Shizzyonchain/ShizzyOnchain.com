import test from 'node:test';
import assert from 'node:assert/strict';
import { subnetTimeline } from '../app/lib/subnet-timeline.ts';
const item = (headline, summary = headline) => ({ headline, summary, status: 'verified', importance: 'medium', sources: [{ label: 'Primary', url: 'https://example.com/update' }] });
const brief = (date, name, updates = [], ecosystem = []) => ({ date, subnets: [{ netuid: 8, name, updates }], ecosystem });

test('history is newest first, deduplicates unchanged stories and preserves developing revisions', () => {
  const rows = subnetTimeline([brief('2026-10-01', 'Vanta', [item('Launch')]), brief('2026-10-02', 'Vanta', [item('Launch')]), brief('2026-10-03', 'Vanta', [item('Launch', 'Now independently verified')])], 8);
  assert.equal(rows.length, 2);
  assert.deepEqual(rows.map(row => row.date), ['2026-10-03', '2026-10-02']);
});
test('name observations link both archive dates and never claim a verified sale', () => {
  const rows = subnetTimeline([brief('2026-10-01', 'Old team'), brief('2026-10-02', 'New team')], 8);
  assert.equal(rows[0].kind, 'archive-name');
  assert.match(rows[0].summary, /not an independently verified/);
  assert.equal(rows[0].sources.length, 2);
});
test('missing names, generic placeholders and case-only edits do not invent renames', () => {
  assert.equal(subnetTimeline([brief('2026-10-01', 'Vanta'), brief('2026-10-02', 'VANTA')], 8).length, 0);
  assert.equal(subnetTimeline([brief('2026-10-01', 'Old'), brief('2026-10-02', 'Subnet 8'), brief('2026-10-03', 'New')], 8).length, 0);
});
test('network stories require an exact subnet-number mention, not a prefix', () => {
  const rows = subnetTimeline([brief('2026-10-01', 'Vanta', [], [item('SN80 robots'), item('Protocol update', 'SN8 has adopted this change')])], 8);
  assert.equal(rows.length, 1);
  assert.equal(rows[0].headline, 'Protocol update');
  assert.equal(subnetTimeline([brief('2026-10-01', 'Vanta', [item('SN8 update')])], 80).length, 0);
});
