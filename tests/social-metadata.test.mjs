import test from 'node:test';
import assert from 'node:assert/strict';
import { withSocialMetadata, socialCardPath } from '../app/lib/social-metadata.ts';

test('leaf social previews replace inherited titles, descriptions and images together', () => {
  const metadata = withSocialMetadata({ title: 'SN51 Subnet Chart', description: 'SN51 price research', openGraph: { title: 'Old homepage', images: ['/old.svg'] }, twitter: { title: 'Old homepage' } }, '/charts/51');
  for (const channel of [metadata.openGraph, metadata.twitter]) {
    assert.equal(channel.title, 'SN51 Subnet Chart');
    assert.equal(channel.description, 'SN51 price research');
    assert.equal(channel.images[0].url, '/social/cards/charts--51.png');
    assert.equal(channel.images[0].width, 1200);
    assert.equal(channel.images[0].height, 630);
  }
  assert.equal(metadata.openGraph.url, '/charts/51');
  assert.equal(metadata.twitter.card, 'summary_large_image');
});

test('news editions retain their date and article time with a distinct card', () => {
  const data = withSocialMetadata({ title: 'Subnet News — October 21, 2026', description: 'Daily report' }, '/subnet-news/2026-10-21', { article: true, publishedTime: '2026-10-21T14:44:42Z' });
  assert.equal(data.openGraph.type, 'article');
  assert.equal(data.openGraph.publishedTime, '2026-10-21T14:44:42Z');
  assert.notEqual(data.openGraph.images[0].url, socialCardPath('/subnet-news/2026-10-20'));
});

test('University and TAO Heads use their own black branded artwork', () => {
  const university = withSocialMetadata({ title: 'Shiz University' }, '/university');
  assert.equal(university.openGraph.images[0].url, '/social/shiz-university-black-v1.jpg');
  assert.match(university.openGraph.images[0].alt, /Shiz University logo/);
  const heads = withSocialMetadata({ title: 'Unchained TAO Heads' }, '/tao-heads');
  assert.equal(heads.openGraph.images[0].url, '/social/cards/tao-heads.png');
  assert.match(heads.openGraph.images[0].alt, /Unchained TAO Heads logo/);
  const profile = withSocialMetadata({ title: 'Validator ABC' }, '/validators/ABC', { imagePath: '/social/cards/validators--profile.png' });
  assert.equal(profile.openGraph.images[0].url, '/social/cards/validators--profile.png');
});
