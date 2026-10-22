import { readFile, readdir, mkdir } from 'node:fs/promises';
import sharp from 'sharp';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';

const root = fileURLToPath(new URL('../', import.meta.url));
const cards = JSON.parse(await readFile(join(root, 'app/data/social-previews.json'), 'utf8'));
for (const name of await readdir(join(root, 'content/subnet-news'))) {
  if (!/^\d{4}-\d{2}-\d{2}\.json$/.test(name)) continue;
  const brief = JSON.parse(await readFile(join(root, 'content/subnet-news', name), 'utf8'));
  cards[`/subnet-news/${brief.date}`] = { title: brief.title, section: 'DAILY BITTENSOR NEWS', brand: 'shizzy' };
}
for (const asset of ['tao', ...Array.from({ length: 128 }, (_, i) => String(i + 1))]) {
  cards[`/charts/${asset}`] = { title: asset === 'tao' ? 'Bittensor TAO Chart' : `SN${asset} Subnet Chart`, section: 'PRICES · CHARTS · SUBNET RESEARCH', brand: 'shizzy' };
}
const logos = {};
for (const [brand, filename] of Object.entries({ shizzy: 'shizzy-unchained-logo.png', heads: 'tao-heads-logo.png' })) {
  logos[brand] = await sharp(join(root, 'public', filename)).resize(brand === 'heads' ? 340 : 420, brand === 'heads' ? 340 : 210, { fit: 'contain', background: '#000' }).png().toBuffer();
}
const escape = text => text.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
const wrap = (text, limit) => {
  const lines = [''];
  for (const word of text.split(/\s+/)) {
    if ((lines.at(-1) + ' ' + word).trim().length > limit) lines.push(word);
    else lines[lines.length - 1] = (lines.at(-1) + ' ' + word).trim();
  }
  return lines;
};
const dir = join(root, 'public/social/cards');
await mkdir(dir, { recursive: true });
for (const [path, card] of Object.entries(cards)) {
  const heads = card.brand === 'heads';
  const lines = wrap(card.title, heads ? 20 : 35);
  if (lines.length > 3) throw new Error(`Social card title is too long: ${path}`);
  const x = heads ? 465 : 70, titleY = heads ? 300 : 405;
  const text = `<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg"><g font-family="DejaVu Sans,Arial,sans-serif"><text x="${x}" y="${titleY - 60}" fill="#aaa" font-size="${heads ? 18 : 21}" letter-spacing="2">${escape(card.section)}</text>${lines.map((line, index) => `<text x="${x}" y="${titleY + index * 65}" fill="#fff" font-size="54" font-weight="700">${escape(line)}</text>`).join('')}<text x="70" y="590" fill="#888" font-size="22">shizzyunchained.com</text></g></svg>`;
  const key = path === '/' ? 'home' : path.slice(1).replaceAll('/', '--');
  await sharp({ create: { width: 1200, height: 630, channels: 3, background: '#000' } }).composite([
    { input: logos[card.brand], left: 70, top: heads ? 135 : 70 },
    { input: Buffer.from(text), left: 0, top: 0 },
  ]).png().toFile(join(dir, `${key}.png`));
}
console.log(`Generated ${Object.keys(cards).length} black branded social cards.`);
