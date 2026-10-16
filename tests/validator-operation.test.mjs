import assert from 'node:assert/strict';
import test from 'node:test';
import { delegatedOperation } from '../app/lib/validator-operation.ts';
const edge = { parent: 'parent', child: 'operator', proportion: '18446744073709551615' };
const neuron = { hotkey: 'operator', active: true, validator_permit: true, updated: 4, total_alpha_stake: '100', dividends: '0.1', timestamp: '2026-10-16T16:00:00Z' };
test('a fully delegated parent gets operating evidence, never an inherited yield', () => {
  const result = delegatedOperation('parent', [edge], [neuron], 500);
  assert.deepEqual(result.children, ['operator']);
  assert.equal(result.updated, 4);
  assert.equal(result.yield7, undefined);
});
test('partial, duplicate, nested, missing and inactive paths cannot qualify', () => {
  for (const [edges, neurons] of [
    [[{ ...edge, proportion: '1' }], [neuron]],
    [[edge, edge], [neuron]],
    [[edge, { parent: 'operator', child: 'next', proportion: edge.proportion }], [neuron]],
    [[edge], []],
    [[edge], [{ ...neuron, active: false }]],
    [[edge], [{ ...neuron, validator_permit: false }]],
    [[edge], [{ ...neuron, updated: 501 }]],
  ]) assert.equal(delegatedOperation('parent', edges, neurons, 500), null);
});
