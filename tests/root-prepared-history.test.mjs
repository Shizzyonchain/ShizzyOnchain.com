import assert from 'node:assert/strict';
import test from 'node:test';
import { selectPreparedHistory } from '../app/lib/root-prepared-history.ts';
const now = Date.parse('2026-10-16T00:30:00Z'), day = Math.floor(now / 86400000) * 86400;
const scan = { day, metrics: { a: {} }, exclusions: { b: 'Too little history' }, preparedAt: '2026-10-16T00:01:00Z' };
test('cold preparation and missing candidates return immediately without partial rankings', () => {
  assert.equal(selectPreparedHistory(null, null, ['a'], now), null);
  assert.equal(selectPreparedHistory(scan, null, ['a', 'b', 'new-validator'], now), null);
  assert.equal(selectPreparedHistory(scan, null, ['a', 'b'], now).rollover, false);
});
test('only an explicitly dated complete previous window gets a bounded midnight allowance', () => {
  const previous = { ...scan, day: day - 86400 };
  assert.equal(selectPreparedHistory(null, previous, ['a', 'b'], now).rollover, true);
  assert.equal(selectPreparedHistory(null, previous, ['a'], now + 2 * 3600000), null);
  assert.equal(selectPreparedHistory(null, { ...previous, day: day - 2 * 86400 }, ['a'], now), null);
  assert.equal(selectPreparedHistory(null, previous, ['new-validator'], now), null);
});
test('current completed preparation takes precedence over the rollover copy', () => {
  const selected = selectPreparedHistory(scan, { ...scan, day: day - 86400 }, ['a'], now);
  assert.equal(selected.scan.day, day);
  assert.equal(selected.rollover, false);
});
