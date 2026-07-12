#!/usr/bin/env node
/*
 * local-gate.js — presence-gate scout candidates. Runs presence-check.js on each
 * candidate in score order, keeps only BUILDABLE (no live site), stops at TARGET.
 *   node scripts/local-gate.js [target]
 */
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const SP = process.env.SP || 'C:/Users/jaime/AppData/Local/Temp/claude/C--Users-jaime-Videos-instagram-videos/cf37edfb-bf7d-4463-b51e-0bad7846945f/scratchpad';
const TARGET = parseInt(process.argv[2] || '22', 10);
const MAXCHECK = 70;
const cands = JSON.parse(fs.readFileSync(SP + '/candidates.json', 'utf8'));
const LOCAL = /(Kloof|Hillcrest|Westville|Waterfall|Pinetown|Gillitts|Assagay|Winston Park|Forest Hills|Everton|Drummond|Botha)/i;

// established food/hospitality (200+ reviews) almost always has a site the feed missed
// -> presence-check false-negatives cluster here. Skip; keep service SMEs + small food.
const FOOD = /restaurant|cafe|café|coffee|\bbar\b|\bpub\b|pizz|bistro|eatery|grill|thai|italian|portuguese|steak|tavern|\bdeli\b|osteria|tea (garden|room)|burger|sushi|asian|mexican|american|irish/i;
const isEstablishedFood = c => FOOD.test((c.category||'') + ' ' + (c.name||'')) && (c.reviews||0) > 150;

const buildable = [], hasSite = [], possible = [], skipped = [];
let checked = 0;
for (const c of cands) {
  if (buildable.length >= TARGET || checked >= MAXCHECK) break;
  if (isEstablishedFood(c)) { skipped.push(c.name); continue; }
  const town = ((c.address||'').match(LOCAL) || [])[1] || (c.town && c.town.trim()) || 'Durban';
  checked++;
  let out = '';
  try { out = execFileSync('node', [path.join(__dirname, 'presence-check.js'), c.name, town], { encoding: 'utf8', timeout: 45000 }); }
  catch (e) { out = (e.stdout || '') + ''; }
  const verdict = (out.match(/VERDICT:\s*([A-Z_]+)/) || [])[1] || 'ERR';
  const wa = (out.match(/WhatsApp found:\s*([0-9, ]+)/) || [])[1] || '';
  const dom = (out.match(/"domain":\s*"([^"]+)"/) || [])[1] || '';
  const rec = { ...c, town, verdict, whatsapp: wa.trim(), foundDomain: dom };
  if (verdict === 'BUILDABLE') buildable.push(rec);
  else if (verdict === 'HAS_SITE') hasSite.push(rec);
  else possible.push(rec);
  process.stdout.write(`[${checked}] ${verdict.padEnd(13)} ${String(c.score).padStart(3)}  ${c.name}${dom?' -> '+dom:''}\n`);
}
fs.writeFileSync(SP + '/buildable.json', JSON.stringify(buildable, null, 2));
fs.writeFileSync(SP + '/gate-hassite.json', JSON.stringify(hasSite, null, 2));
console.log(`\nchecked ${checked}: BUILDABLE ${buildable.length} | HAS_SITE ${hasSite.length} | POSSIBLE/other ${possible.length}`);
console.log(`Saved ${buildable.length} buildable leads -> buildable.json`);
