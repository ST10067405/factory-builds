#!/usr/bin/env node
/*
 * local-assets.js — pull real image assets into each scouted lead's folder.
 * Runs pull-photos.js per lead, drops junk-directory sources, writes a per-folder
 * _assets-manifest.json (source+title) so final Read-vetting happens at build time.
 *   node scripts/local-assets.js
 */
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const SP = process.env.SP || 'C:/Users/jaime/AppData/Local/Temp/claude/C--Users-jaime-Videos-instagram-videos/cf37edfb-bf7d-4463-b51e-0bad7846945f/scratchpad';
const ROOT = path.join(__dirname, '..');
const leads = JSON.parse(fs.readFileSync(SP + '/local-leads.json', 'utf8'));
const JUNK = /snupit|yellowpages|brabys|nicelocal|cylex|best.?of|yelp|tripadvisor|infoisinfo|hellopeter|bbb|directory|procompare|recomed/i;
const simpleCat = c => (c||'').toLowerCase().replace(/[^a-z ]/g,'').split(' ')[0] || '';

const summary = [];
for (const l of leads) {
  const dir = path.join(ROOT, l.slug, 'images');
  fs.mkdirSync(dir, { recursive: true });
  const q = `${l.name} ${l.town} ${simpleCat(l.category)}`.trim();
  let out = '';
  try { out = execFileSync('node', [path.join(__dirname, 'pull-photos.js'), q, l.slug, '6'], { encoding: 'utf8', timeout: 90000 }); }
  catch (e) { out = (e.stdout || '') + ''; }
  // parse manifest lines: "  real_01.jpg  1254x900  [Fresha]  Title..."
  const man = [];
  for (const m of out.matchAll(/(real_\d+\.\w+)\s+(\d+x\d+)\s+\[([^\]]*)\]\s+(.*)/g)) {
    man.push({ file: m[1], dim: m[2], source: m[3].trim(), title: m[4].trim() });
  }
  // drop junk-directory sources
  let dropped = 0;
  const kept = [];
  for (const e of man) {
    if (JUNK.test(e.source) || JUNK.test(e.title)) { try { fs.unlinkSync(path.join(dir, e.file)); dropped++; } catch (_) {} }
    else kept.push(e);
  }
  fs.writeFileSync(path.join(dir, '_assets-manifest.json'), JSON.stringify({ lead: l.name, query: q, pulled: man.length, kept, note: 'UNVETTED scout pool — Read-vet before using in a build (SOP).' }, null, 2));
  summary.push({ slug: l.slug, pulled: man.length, kept: kept.length, dropped });
  process.stdout.write(`${l.slug.padEnd(42)} pulled ${man.length}  kept ${kept.length}  (junk ${dropped})\n`);
}
fs.writeFileSync(SP + '/asset-summary.json', JSON.stringify(summary, null, 2));
const withAssets = summary.filter(s => s.kept > 0).length;
console.log(`\nDONE: ${withAssets}/${summary.length} leads have >=1 asset. (all pools are UNVETTED — Read-vet at build time per SOP)`);
