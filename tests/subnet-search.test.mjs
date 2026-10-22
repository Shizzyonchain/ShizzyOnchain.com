import assert from 'node:assert/strict';
import test from 'node:test';
import { matchesSubnetQuery } from '../app/lib/subnet-search.ts';

test('subnet numbers and common SN prefixes resolve the exact subnet', () => {
  const row = { netuid: 51, name: 'lium.io', symbol: 'ת' };
  for (const query of ['51', 'SN51', ' sn 51 ', 'Subnet 51', 'SUBNET   51', 'SN#51', '#51', '051']) {
    assert.equal(matchesSubnetQuery(row, query), true, query);
    assert.equal(matchesSubnetQuery({ netuid: 5, name: 'Other 51' }, query), false, query);
  }
  assert.equal(matchesSubnetQuery(row, 'SN510'), false);
  assert.equal(matchesSubnetQuery(row, 'SN0'), false);
});

test('names and symbols remain searchable with case and whitespace normalized', () => {
  assert.equal(matchesSubnetQuery({ netuid: 51, name: 'lium.io' }, '  LIUM  '), true);
  assert.equal(matchesSubnetQuery({ netuid: 65, name: 'True Performance Network' }, 'true   PERFORMANCE'), true);
  assert.equal(matchesSubnetQuery({ netuid: 51, symbol: 'ת' }, 'ת'), true);
  assert.equal(matchesSubnetQuery({ netuid: 51 }, 'not-a-subnet'), false);
  assert.equal(matchesSubnetQuery({ netuid: 51 }, '   '), true);
});
