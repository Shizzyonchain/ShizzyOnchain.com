import test from 'node:test';
import assert from 'node:assert/strict';
import { chartPaths, chartPageTitle, siteOrigin, validatorMetadataName } from '../app/lib/seo.ts';

test('chart discovery covers TAO and exactly the 128 subnet routes on the primary host', () => {
  assert.equal(siteOrigin, 'https://shizzyunchained.com');
  assert.equal(chartPaths.length, 129);
  assert.equal(new Set(chartPaths).size, 129);
  assert.ok(chartPaths.includes('/charts/tao'));
  assert.ok(chartPaths.includes('/charts/1'));
  assert.ok(chartPaths.includes('/charts/128'));
  assert.ok(!chartPaths.includes('/charts/0'));
  assert.ok(!chartPaths.includes('/charts/129'));
});

test('chart titles preserve the exact available subnet name without guessing missing identity', () => {
  assert.equal(chartPageTitle(51, ' lium.io '), 'SN51 lium.io Chart');
  assert.equal(chartPageTitle(113, 'Unknown'), 'SN113 Unknown Chart');
  assert.equal(chartPageTitle(113, null), 'SN113 Subnet Chart');
  assert.equal(chartPageTitle('tao'), 'Bittensor TAO Chart');
});

test('metadata names bind to the exact hotkey and original source time', () => {
  const now = Date.now(), time = new Date(now - 60_000).toISOString();
  const names = { operator: { name: 'qBitTensorLabs', observedAt: time }, parent: { name: 'Tatsu', observedAt: time } };
  assert.equal(validatorMetadataName(names, 'operator', now), 'qBitTensorLabs');
  assert.equal(validatorMetadataName(names, 'different', now), null);
  assert.equal(validatorMetadataName(names, 'operator', now + 7200_000), null);
  assert.equal(validatorMetadataName({ operator: { name: 'Tatsu', observedAt: new Date(now + 86400_000).toISOString() } }, 'operator', now), null);
  assert.equal(validatorMetadataName({ operator: { name: 'operator', observedAt: time } }, 'operator', now), null);
  assert.equal(validatorMetadataName(null, 'operator', now), null);
});
