import assert from 'node:assert/strict';
import test from 'node:test';
import { packChildIndex, unpackChildIndex } from '../app/lib/child-hotkey-cache.ts';
test('compact storage preserves addresses, u64 proportions, subnet roles and finalized block', () => {
  const parent = '5Parent'.padEnd(48, 'P'), child = '5Child'.padEnd(48, 'C');
  const source = { hotkeys: [child], subnetChildren: { 51: [child] }, subnetParents: { 51: [parent] }, edges: { 51: [{ parent, child, proportion: '18446744073709551615' }] }, inspected: 1, block: 123, blockHash: '0xabc', checkedAt: '2026-10-17T02:00:00Z' };
  assert.deepEqual(unpackChildIndex(packChildIndex(source)), source);
  const many = { ...source, edges: Object.fromEntries(Array.from({ length: 128 }, (_, netuid) => [netuid, Array(100).fill(source.edges[51][0])])) };
  assert.ok(JSON.stringify(packChildIndex(many)).length < JSON.stringify(many).length / 3);
});
test('invalid compact references fail instead of changing validator identities', () => {
  assert.throws(() => unpackChildIndex({ addresses: [], hotkeys: [99], subnetChildren: {}, subnetParents: {}, edges: {}, inspected: 1, block: 1, blockHash: 'x', checkedAt: 'x' }));
});
