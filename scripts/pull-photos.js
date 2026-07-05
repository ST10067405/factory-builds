#!/usr/bin/env node
/*
 * pull-photos.js — pull a business's REAL photos (GBP / Facebook / Instagram /
 * Fresha) via Serper image search and self-host them, so builds mix real client
 * imagery with stock instead of being stock-only.
 *
 *   node scripts/pull-photos.js "Business Name Town keywords" <slug> [count]
 *
 * Downloads into builds/<slug>/images/real_NN.jpg. ALWAYS Read-vet the results
 * afterwards (Serper returns some off-topic / mislabelled shots) and keep only
 * the good ones for the build. Real photos first, graded stock as fill.
 */
const https = require('https');
const fs = require('fs');
const path = require('path');

const SERPER_KEY = process.env.SERPER_KEY || 'c7d30ed2084ef1ce75082cc5147f19810ae7fc2a';
const [query, slug, countArg] = process.argv.slice(2);
if (!query || !slug) { console.log('usage: node scripts/pull-photos.js "query" <slug> [count]'); process.exit(1); }
const COUNT = parseInt(countArg || '10', 10);
const outDir = path.join(__dirname, '..', slug, 'images');
fs.mkdirSync(outDir, { recursive: true });

function serperImages(q) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify({ q, gl: 'za', num: 30 });
    const req = https.request({ hostname: 'google.serper.dev', path: '/images', method: 'POST', headers: { 'X-API-KEY': SERPER_KEY, 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(body) } },
      res => { let d = ''; res.on('data', c => d += c); res.on('end', () => resolve(JSON.parse(d))); });
    req.on('error', reject); req.write(body); req.end();
  });
}

function download(url, dest, redirects = 3) {
  return new Promise(resolve => {
    let u; try { u = new URL(url); } catch (e) { return resolve(false); }
    const req = https.request({ hostname: u.hostname, path: u.pathname + u.search, method: 'GET', timeout: 15000, headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)', 'Accept': 'image/*' } }, res => {
      if ([301, 302, 303, 307, 308].includes(res.statusCode) && res.headers.location && redirects > 0) { res.resume(); return resolve(download(res.headers.location.startsWith('http') ? res.headers.location : u.origin + res.headers.location, dest, redirects - 1)); }
      if (res.statusCode !== 200) { res.resume(); return resolve(false); }
      const chunks = []; res.on('data', c => chunks.push(c));
      res.on('end', () => { const buf = Buffer.concat(chunks); if (buf.length > 3000 && buf[0] === 0xff && buf[1] === 0xd8) { fs.writeFileSync(dest, buf); resolve(true); } else if (buf.length > 3000 && buf.slice(0, 8).toString('hex').includes('89504e47')) { fs.writeFileSync(dest.replace(/\.jpg$/, '.png'), buf); resolve(true); } else resolve(false); });
    });
    req.on('timeout', () => { req.destroy(); resolve(false); });
    req.on('error', () => resolve(false));
    req.end();
  });
}

(async () => {
  const res = await serperImages(query);
  const imgs = (res.images || []);
  // Prefer real client sources + reasonable size; dedupe by media host+id.
  const GOOD = /(facebook|fbsbx|instagram|fresha|cdninstagram|lookaside)/i;
  const ranked = imgs
    .filter(im => im.imageUrl && (im.imageWidth || 0) >= 500)
    .sort((a, b) => (GOOD.test(b.source || b.imageUrl) - GOOD.test(a.source || a.imageUrl)) || ((b.imageWidth * b.imageHeight) - (a.imageWidth * a.imageHeight)));
  let saved = 0, idx = 0;
  const manifest = [];
  for (const im of ranked) {
    if (saved >= COUNT) break;
    idx++;
    const dest = path.join(outDir, `real_${String(saved + 1).padStart(2, '0')}.jpg`);
    const ok = await download(im.imageUrl, dest);
    if (ok) { saved++; manifest.push({ file: path.basename(dest), source: im.source, title: (im.title || '').slice(0, 60), w: im.imageWidth, h: im.imageHeight }); }
  }
  console.log(`Saved ${saved} real photos to ${slug}/images/`);
  manifest.forEach(m => console.log(`  ${m.file}  ${m.w}x${m.h}  [${m.source}]  ${m.title}`));
  console.log('\nNEXT: Read-vet these (some may be off-topic) and use the good ones + graded stock in the build.');
})();
