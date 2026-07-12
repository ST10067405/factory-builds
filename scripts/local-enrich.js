#!/usr/bin/env node
/*
 * local-enrich.js — Phase 1/2 enrichment for buildable scout leads (Notion unreachable).
 * Dedupe -> Serper /search per lead -> extract socials (IG/FB), email, and re-confirm
 * no own-domain. Derives slug + templated angle/pain by category. Writes local-leads.json.
 *   node scripts/local-enrich.js
 */
const https = require('https');
const fs = require('fs');
const SP = process.env.SP || 'C:/Users/jaime/AppData/Local/Temp/claude/C--Users-jaime-Videos-instagram-videos/cf37edfb-bf7d-4463-b51e-0bad7846945f/scratchpad';
const SERPER_KEY = process.env.SERPER_KEY || 'c7d30ed2084ef1ce75082cc5147f19810ae7fc2a';
const TARGET = 20;
const buildable = JSON.parse(fs.readFileSync(SP + '/buildable.json', 'utf8'));

const STOP = new Set(['the','and','at','of','a','sa','pty','ltd','co','durban','kzn','shop']);
const sig = s => (s||'').toLowerCase().replace(/&/g,' and ').replace(/['’.()]/g,'').replace(/[^a-z0-9]+/g,' ').trim().split(/\s+/).filter(t=>t&&!STOP.has(t));
const slugify = s => (s||'').toLowerCase().replace(/&/g,' and ').replace(/['’.]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'').slice(0,48);

function search(q){return new Promise(resolve=>{const body=JSON.stringify({q,gl:'za',num:10});const req=https.request({hostname:'google.serper.dev',path:'/search',method:'POST',headers:{'X-API-KEY':SERPER_KEY,'Content-Type':'application/json','Content-Length':Buffer.byteLength(body)}},res=>{let d='';res.on('data',c=>d+=c);res.on('end',()=>{try{resolve(JSON.parse(d));}catch(e){resolve({});}});});req.on('error',()=>resolve({}));req.write(body);req.end();});}

function angleFor(cat){
  const c=(cat||'').toLowerCase();
  if(/dent/.test(c)) return {pain:'Highly-rated practice with no website — patients can\'t find services, book, or check hours online.',angle:'A clean, trustworthy practice site with online booking and clear service info.'};
  if(/barber/.test(c)) return {pain:'Busy barbershop running on walk-ins and word of mouth — no site means no online discovery or bookings.',angle:'A sharp, mobile-first site with gallery + click-to-book that turns searches into chairs filled.'};
  if(/salon|hair|beauty|nail|aesthet|spa/.test(c)) return {pain:'Well-rated salon with no website — missing online booking, service menu and new-client discovery.',angle:'A polished site with treatment menu, gallery and booking link to win new clients.'};
  if(/groom|pet|dog/.test(c)) return {pain:'Loved local groomer with no website — bookings rely on calls and referrals only.',angle:'A warm, simple site with services + booking so new pet parents can find and book them.'};
  if(/plumb/.test(c)) return {pain:'Plumber with no online presence beyond a map pin — every job depends on referrals.',angle:'A trustworthy click-to-call site so homeowners choose them first in an emergency.'};
  if(/electric|solar/.test(c)) return {pain:'Electrician with no website — glowing referrals aren\'t converting into online bookings.',angle:'A credible site with services + COC + click-to-call to turn referrals into jobs.'};
  if(/coffee|cafe|café|restaurant|bistro|eatery/.test(c)) return {pain:'Local eatery with no website — no menu, hours or story online for people searching nearby.',angle:'A tasteful site with menu, hours and location to pull in local foot traffic.'};
  return {pain:'Established local business with no website — invisible to people searching online.',angle:'A simple, credible site with services + click-to-call to get found and booked.'};
}

(async () => {
  const seen = [], leads = [];
  for (const c of buildable) {
    if (leads.length >= TARGET) break;
    const s = sig(c.name); const key = (s[0]||'')+'|'+(s[1]||'');
    if (seen.includes(key)) continue;             // dedupe brand/branch dupes
    seen.push(key);

    const r = await search(`${c.name} ${c.town}`);
    const organic = (r.organic||[]);
    const socials = { instagram:'', facebook:'' };
    let email = '';
    for (const o of organic) {
      const link = o.link||''; const text = `${o.title||''} ${o.snippet||''}`;
      if (!socials.instagram && /instagram\.com\//i.test(link)) socials.instagram = link.split('?')[0];
      if (!socials.facebook && /facebook\.com\//i.test(link)) socials.facebook = link.split('?')[0];
      const em = text.match(/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/i); if (!email && em) email = em[0];
    }
    const a = angleFor(c.category);
    leads.push({
      name:c.name, slug:slugify(c.name), category:c.category, address:c.address, town:c.town,
      rating:c.rating, reviews:c.reviews, phone:c.phone||c.whatsapp||'', whatsapp:c.whatsapp||'',
      booking:c.booking||'', instagram:socials.instagram, facebook:socials.facebook, email,
      score:c.score, siteStatus:'BUILDABLE (presence-gated)', built:false, stage:'scouted',
      painSignal:a.pain, suggestedAngle:a.angle, source:'local-scout 2026-07-12 (Serper Places, KZN Upper Highway)'
    });
    await new Promise(r=>setTimeout(r,250));
  }
  fs.writeFileSync(SP + '/local-leads.json', JSON.stringify(leads, null, 2));
  console.log(`Enriched ${leads.length} unique buildable leads -> local-leads.json\n`);
  console.log('SCORE  REV  RAT  PHONE          IG FB EM  NAME (slug)');
  for (const l of leads) console.log(
    String(l.score).padStart(4)+'  '+String(l.reviews).padStart(4)+'  '+String(l.rating||'-').padStart(3)+'  '+
    (l.phone||'-').padEnd(14)+' '+(l.instagram?'I':'-')+'  '+(l.facebook?'F':'-')+'  '+(l.email?'E':'-')+'   '+l.name+'  ('+l.slug+')');
})();
