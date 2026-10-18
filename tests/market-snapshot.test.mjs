import assert from 'node:assert/strict';
import test from 'node:test';
import { latestSnapshotTime, snapshotIsFresh, persistMarketSnapshot } from '../app/lib/market-snapshot.ts';

test('stale snapshots recover on actual new data, and age out without new data', () => {
  const now = Date.parse('2026-10-18T22:00:00Z');
  const old = latestSnapshotTime([{time:'invalid'}, {time:'2026-10-18T21:55:00Z'}]);
  assert.equal(snapshotIsFresh(old, now), false);
  const fresh = latestSnapshotTime([{time:'2026-10-18T21:55:00Z'}, {time:'2026-10-18T21:59:00Z'}]);
  assert.equal(snapshotIsFresh(fresh, now), true);
  assert.equal(snapshotIsFresh(fresh, now + 180_000), false);
  assert.equal(snapshotIsFresh(latestSnapshotTime([]), now), false);
});

test('full or unavailable browser storage cannot reject a live snapshot', () => {
  const rows = [{time:'2026-10-18T21:59:00Z', netuid:58}];
  for (const storage of [
    () => { throw new Error('SecurityError'); },
    () => ({setItem() { throw new Error('QuotaExceededError'); }}),
  ]) assert.equal(persistMarketSnapshot(rows, storage), false);
  let stored;
  assert.equal(persistMarketSnapshot(rows, () => ({setItem(key, value) { stored={key, value}; }})), true);
  assert.equal(stored.key, 'shizzy:screener');
  assert.deepEqual(JSON.parse(stored.value).data, rows);
});
