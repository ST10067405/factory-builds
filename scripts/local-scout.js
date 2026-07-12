#!/usr/bin/env node
/*
 * local-scout.js — offline replacement for the n8n Lead Scout (Notion unreachable).
 * Serper /places sweep of KZN Upper Highway niches -> keep businesses with NO website
 * listed -> dedupe vs existing leads + build folders -> score by reviews/rating.
 * Writes scratchpad/candidates.json (ranked). Presence-gating happens next, separately.
 *
 *   node scripts/local-scout.js
 */
const https = require('https');
const fs = require('fs');
const path = require('path');

const SERPER_KEY = process.env.SERPER_KEY || 'c7d30ed2084ef1ce75082cc5147f19810ae7fc2a';
const SP = process.env.SP || 'C:/Users/jaime/AppData/Local/Temp/claude/C--Users-jaime-Videos-instagram-videos/cf37edfb-bf7d-4463-b51e-0bad7846945f/scratchpad';
const ROOT = path.join(__dirname, '..');

const TOWNS = ['Kloof', 'Hillcrest', 'Westville', 'Waterfall', 'Pinetown'];
const NICHES = ['hair salon', 'beauty salon', 'nail salon', 'barber', 'coffee shop',
                'restaurant', 'dentist', 'plumber', 'electrician', 'pet grooming'];

function places(q) {
  return new Promise(resolve => {
    const body = JSON.stringify({ q, gl: 'za', location: 'Durban, South Africa' });
    const req = https.request({ hostname: 'google.serper.dev', path: '/places', method: 'POST',
      headers: { 'X-API-KEY': SERPER_KEY, 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(body) } },
      res => { let d = ''; res.on('data', c => d += c); res.on('end', () => { try { resolve(JSON.parse(d).places || []); } catch (e) { resolve([]); } }); });
    req.on('error', () => resolve([]));
    req.write(body); req.end();
  });
}

const STOP = new Set(['the','and','at','of','a','sa','pty','ltd','co','durban','kzn','shop','the']);
const sig = s => (s||'').toLowerCase().replace(/&/g,' and ').replace(/['’.()]/g,'').replace(/[^a-z0-9]+/g,' ').trim().split(/\s+/).filter(t=>t&&!STOP.has(t));
function sameBiz(a, b){ const x=sig(a),y=sig(b); if(!x.length||!y.length)return false; return x[0]===y[0]&&(x[1]||'')===(y[1]||''); }

(async () => {
  // known names to exclude (existing leads + build folders)
  const known = [];
  try { const ls = JSON.parse(fs.readFileSync(SP + '/ls3.json','utf8')); (ls.leads||[]).forEach(l=>known.push(l.businessName)); } catch(e){}
  const EXC = new Set(['scripts','board','dist','node_modules','_template']);
  fs.readdirSync(ROOT,{withFileTypes:true}).filter(d=>d.isDirectory()&&!EXC.has(d.name)&&!d.name.startsWith('.')).forEach(d=>known.push(d.name.replace(/-/g,' ')));

  const pool = new Map(); // cid -> place
  let q = 0;
  for (const n of NICHES) for (const t of TOWNS) {
    const ps = await places(`${n} ${t}`);
    q++;
    for (const p of ps) { if (p.cid && !pool.has(p.cid)) pool.set(p.cid, p); }
    await new Promise(r => setTimeout(r, 250));
  }
  const all = [...pool.values()];

  // exclude Cape Town "Kloof Street" contamination + national chains
  const CAPE = /kloof st|cape town|western cape|gardens|foreshore|\b800[0-9]\b|\b710[0-9]\b/i;
  const CHAIN = /starbucks|mozambik|lupa|\bkfc\b|nando|steers|wimpy|mugg ?& ?bean|vida e|seattle|col.?cacchio|panarotti|\bspur\b|ocean basket|roman'?s pizza|debonair|mcdonald|burger king|rocomamas|krispy|dros|john dory|fishaways|simply asia|kauai|\bpick n pay|woolworths|checkers|clicks|dis-chem/i;
  const LOCAL = /kloof|hillcrest|westville|waterfall|pinetown|gillitts|assagay|winston park|upper highway|botha|drummond|forest hills|everton|inanda|old main rd|josiah gumede|delcairn|hillcrest centre|the junction/i;

  const cands = all.filter(p => {
    if (p.website || !p.title) return false;
    if (known.some(k => sameBiz(k, p.title))) return false;
    const blob = (p.title||'') + ' ' + (p.address||'');
    if (CAPE.test(blob) || CHAIN.test(p.title)) return false;
    // keep if address is clearly local, or address empty (query was town-scoped)
    if (p.address && !LOCAL.test(p.address)) return false;
    return true;
  });

  function score(p){
    let s = 30;                                    // no website
    s += Math.min(p.ratingCount||0, 200) * 0.20;   // SME sweet-spot (plateaus, doesn't reward chains)
    const r = p.rating||0;
    s += r>=4.7?10 : r>=4.3?6 : r>=4.0?3 : 0;
    return Math.round(s);
  }
  const ranked = cands.map(p=>({
    name:p.title, category:p.category||'', address:p.address||'', town:(p.address||'').split(',').slice(-2)[0]||'',
    rating:p.rating||null, reviews:p.ratingCount||0, phone:p.phoneNumber||'', booking:(p.bookingLinks||[])[0]||'',
    cid:p.cid, score:score(p)
  })).sort((a,b)=>b.score-a.score);

  fs.writeFileSync(SP + '/candidates.json', JSON.stringify(ranked, null, 2));
  console.log(`queries: ${q} | unique places: ${all.length} | no-website & new candidates: ${ranked.length}`);
  console.log('\nTop 30 candidates (pre presence-gate):');
  console.log('SCORE REVIEWS RATING  NAME  — CATEGORY · TOWN');
  ranked.slice(0,30).forEach(c=>console.log(
    String(c.score).padStart(4)+'  '+String(c.reviews).padStart(6)+'  '+String(c.rating||'-').padStart(5)+'   '+c.name+'  — '+c.category+' · '+c.town.trim()));
})();
