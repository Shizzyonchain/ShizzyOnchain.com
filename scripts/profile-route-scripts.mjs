// Compare initial HTML script references, not post-interaction chunks or field CWV.
// Usage: node scripts/profile-route-scripts.mjs https://shizzyunchained.com report.json
import { gzipSync } from "node:zlib";
import { writeFileSync } from "node:fs";
const origin = process.argv[2] || "http://localhost:3100";
const assets = new Map();
const report = [];
for (const device of ["desktop", "phone"]) {
 for (const route of ["/", "/partners", "/video", "/university", "/about", "/charts/51", "/validators"]) {
  const started = performance.now();
  const response = await fetch(new URL(route, origin), { headers: { "User-Agent": device === "phone" ? "Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 Version/18.0 Mobile/15E148 Safari/604.1" : "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/130.0.0.0 Safari/537.36" }, signal: AbortSignal.timeout(30000) });
  if (!response.ok) throw new Error(`${route}: ${response.status}`);
  const html = await response.text();
  const htmlMs = Math.round(performance.now() - started);
  const urls = [...new Set([...html.matchAll(/<script[^>]+src="([^" ]+\.js[^" ]*)"/g)].map(match => new URL(match[1], origin).href))];
  const scripts = await Promise.all(urls.map(async url => {
   if (!assets.has(url)) assets.set(url, (async () => { const result = await fetch(url, { signal: AbortSignal.timeout(15000) }); if (!result.ok) throw new Error(`${url}: ${result.status}`); const data = Buffer.from(await result.arrayBuffer()); return { url, decodedBytes: data.length, gzipEstimate: gzipSync(data).length }; })());
   return assets.get(url);
  }));
  report.push({ route, device, status: response.status, htmlMs, decodedBytes: scripts.reduce((sum, item) => sum + item.decodedBytes, 0), gzipEstimate: scripts.reduce((sum, item) => sum + item.gzipEstimate, 0), scripts });
 }
}
if (process.argv[3]) writeFileSync(process.argv[3], JSON.stringify({ origin, measuredAt: new Date().toISOString(), caveat: "Decoded initial script references and locally recompressed gzip estimates. Not browser transfer sizes, CPU timing or field Core Web Vitals. Warm asset reads shared across samples; HTML timing is one observation, not a speed guarantee.", routes: report }, null, 2));
console.table(report.map(({ route, device, status, htmlMs, decodedBytes, gzipEstimate }) => ({ route, device, status, htmlMs, decodedBytes, gzipEstimate })));
