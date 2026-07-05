#!/usr/bin/env node
/*
 * presence-check.js — web-presence gate for the Arkatype web-design factory.
 *
 * WHY: Google Maps' "has website" flag and snippet-level enrichment miss real
 * websites and WhatsApp numbers that live on a business's own site / FB / IG
 * posts. This gate does a deeper Serper pass + live-domain verification so we
 * never build a Tier-0 "you have no website" demo for a business that already
 * has a working site.
 *
 * USAGE
 *   Single lead (run this BEFORE every build):
 *     node scripts/presence-check.js "Synergy Hair" "Kloof"
 *   Batch re-check the Notion Leads DB (report only):
 *     node scripts/presence-check.js --batch
 *   Batch + write corrections back to Notion (Has Website / Website / note):
 *     node scripts/presence-check.js --batch --fix
 *
 * Exit code for single mode: 0 = BUILDABLE (no live site), 3 = HAS_SITE (skip).
 */

const https = require('https');

const SERPER_KEY = process.env.SERPER_KEY || 'c7d30ed2084ef1ce75082cc5147f19810ae7fc2a';
const NOTION_TOKEN = process.env.NOTION_TOKEN || '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';
const LEADS_DB = '8c668bf4-4140-464e-9a66-242df372ce5a';

// Domains that are never a small business's OWN marketing site.
const DENY = /(facebook|instagram|fresha|waze|google|gmail|googlemail|cylex|yelp|tripadvisor|tiktok|booksy|yellowpages|snupit|hellopeter|nicelocal|infoisinfo|linktr|pets24|puppify|ultimatepetcare|jiltons|za\.live|wa\.me|maps\.app|maptons|goo\.gl|bing|apple|destinali|brabys|mapquest|evendo|recomed|procompare|appliancerepair|restaurantguru|petbacker|trustedhousesitters)/i;

function httpsJson(opts, bodyObj) {
  return new Promise((resolve, reject) => {
    const body = bodyObj ? JSON.stringify(bodyObj) : null;
    const req = https.request(opts, res => {
      let d = ''; res.on('data', c => d += c);
      res.on('end', () => { try { resolve({ status: res.statusCode, json: d ? JSON.parse(d) : null }); } catch (e) { resolve({ status: res.statusCode, json: null, raw: d }); } });
    });
    req.on('error', reject);
    if (body) req.write(body);
    req.end();
  });
}

// GET a URL, follow one redirect, short timeout; return {status, title}
function probe(url, redirectsLeft = 2) {
  return new Promise(resolve => {
    let u;
    try { u = new URL(url); } catch (e) { return resolve({ status: 0, title: '' }); }
    const req = https.request({ hostname: u.hostname, path: u.pathname + u.search, method: 'GET', timeout: 10000, headers: { 'User-Agent': 'Mozilla/5.0' } }, res => {
      if ([301, 302, 303, 307, 308].includes(res.statusCode) && res.headers.location && redirectsLeft > 0) {
        res.resume();
        const next = res.headers.location.startsWith('http') ? res.headers.location : u.origin + res.headers.location;
        return resolve(probe(next, redirectsLeft - 1));
      }
      let d = '';
      res.on('data', c => { if (d.length < 4000) d += c; });
      res.on('end', () => { const m = d.match(/<title[^>]*>([^<]*)<\/title>/i); resolve({ status: res.statusCode, title: (m ? m[1] : '').trim().slice(0, 80) }); });
    });
    req.on('timeout', () => { req.destroy(); resolve({ status: 0, title: '' }); });
    req.on('error', () => resolve({ status: 0, title: '' }));
    req.end();
  });
}

// Distinctive name tokens (drop only articles/conjunctions, keep content words like "hair").
function nameTokens(name) {
  const stop = new Set(['the', 'and', 'at', 'of', 'a', 'in', 'on', 'sa']);
  return name.toLowerCase().replace(/&/g, ' ').replace(/[^a-z0-9 ]/g, '').split(/\s+/).filter(w => w.length > 1 && !stop.has(w));
}

// Generic business-category words — a bigram made of ONLY these is not distinctive
// ("hair"+"salon" -> "hairsalon" matches any salon directory). A distinctive bigram
// needs at least one brand word.
const GENERIC = new Set(['hair', 'salon', 'beauty', 'coffee', 'cafe', 'shop', 'store', 'studio', 'co', 'company', 'spa', 'pet', 'pets', 'parlour', 'parlor', 'dental', 'dentist', 'dentistry', 'barber', 'barbers', 'barbershop', 'nails', 'nail', 'restaurant', 'bar', 'grill', 'bistro', 'kitchen', 'eatery', 'services', 'service', 'group', 'clinic', 'vet', 'vets', 'veterinary', 'aesthetics', 'wellness', 'plumbing', 'plumber', 'plumbers', 'electrical', 'design', 'designs']);

// Match strings = distinctive consecutive-token bigrams + full compact. A domain is a
// CONFIDENT match only if its alnum root contains one — so "synergyhair" matches
// "Synergy Hair", but "villagevet" does NOT match "Village Pet" (no shared pair) and
// "heyhairsalons" does NOT match "Charlie's Hair Salon" (only the all-generic pair
// "hairsalon" overlaps, which is skipped).
function nameMatchStrings(name) {
  const t = nameTokens(name);
  const out = new Set();
  if (t.length >= 2) {
    for (let i = 0; i < t.length - 1; i++) {
      const a = t[i], b = t[i + 1];
      if (!(GENERIC.has(a) && GENERIC.has(b))) out.add(a + b); // skip all-generic pairs
    }
    out.add(t.join('')); // full compact is specific enough to keep
  } else if (t.length === 1 && t[0].length >= 6 && !GENERIC.has(t[0])) out.add(t[0]);
  return [...out];
}
function domainMatchesName(domain, matchStrings) {
  const root = domain.split('.').slice(0, -1).join('').replace(/[^a-z0-9]/g, '');
  return matchStrings.some(m => root.includes(m));
}

async function checkPresence(name, town) {
  const q = `${name} ${town}`;
  const res = await httpsJson({
    hostname: 'google.serper.dev', path: '/search', method: 'POST',
    headers: { 'X-API-KEY': SERPER_KEY, 'Content-Type': 'application/json' }
  }, { q, gl: 'za', num: 10 });
  const organic = (res.json && res.json.organic) || [];

  // Collect candidate own-domains from links + snippet text
  const cands = new Set();
  const whats = new Set();
  for (const o of organic) {
    const link = o.link || '';
    const text = `${o.title || ''} ${o.snippet || ''}`;
    try { const h = new URL(link).hostname.replace(/^www\./, ''); if (/\.(co\.za|com|net|shop|africa)$/.test(h) && !DENY.test(h)) cands.add(h); } catch (e) {}
    const dm = text.match(/\b([a-z0-9][a-z0-9-]{1,40}\.(?:co\.za|com|shop|africa))\b/ig);
    if (dm) dm.forEach(d => { const dl = d.toLowerCase(); if (!DENY.test(dl)) cands.add(dl); });
    const wm = text.match(/whats\s?app[^0-9]{0,18}((?:\+?27|0)[\s-]?[0-9]{2}[\s-]?[0-9]{3}[\s-]?[0-9]{4})/i);
    if (wm) whats.add(wm[1].replace(/[\s-]/g, ''));
  }

  const matchStrings = nameMatchStrings(name);
  const sites = [];
  for (const domain of cands) {
    const matchesName = domainMatchesName(domain, matchStrings);
    const p = await probe('https://' + domain);
    if (p.status >= 200 && p.status < 400) {
      sites.push({ domain, status: p.status, title: p.title, matchesName });
    }
  }
  // Confident hit = a live name-matched domain that is ALSO geo-plausibly SA:
  // a .co.za/.africa domain, or a .com whose page title mentions the town.
  // (Stops US/foreign sites that merely share a generic name, e.g. "Elite Barbers".)
  const townKey = (town || '').toLowerCase().split(/[\s,]/)[0];
  const isZA = d => /\.(co\.za|africa|durban|joburg|capetown)$/.test(d);
  sites.forEach(s => { s.confident = s.matchesName && (isZA(s.domain) || (townKey && (s.title || '').toLowerCase().includes(townKey))); });
  const matched = sites.filter(s => s.matchesName);
  const verdict = matched.some(s => s.confident) ? 'HAS_SITE' : (matched.length ? 'POSSIBLE_SITE' : 'BUILDABLE');
  return { name, town, verdict, sites: matched, whatsapp: [...whats] };
}

async function notionQueryWebDesign() {
  const results = [];
  let cursor;
  do {
    const body = { filter: { property: 'Pipeline', select: { equals: 'Web Design' } }, page_size: 100 };
    if (cursor) body.start_cursor = cursor;
    const r = await httpsJson({ hostname: 'api.notion.com', path: `/v1/databases/${LEADS_DB}/query`, method: 'POST', headers: { Authorization: `Bearer ${NOTION_TOKEN}`, 'Notion-Version': '2022-06-28', 'Content-Type': 'application/json' } }, body);
    (r.json.results || []).forEach(p => results.push(p));
    cursor = r.json.has_more ? r.json.next_cursor : null;
  } while (cursor);
  return results;
}

async function notionSetSite(pageId, domain, note) {
  await httpsJson({ hostname: 'api.notion.com', path: `/v1/pages/${pageId}`, method: 'PATCH', headers: { Authorization: `Bearer ${NOTION_TOKEN}`, 'Notion-Version': '2022-06-28', 'Content-Type': 'application/json' } },
    { properties: { 'Has Website': { checkbox: true }, 'Website': { url: 'https://' + domain }, 'Notes': { rich_text: [{ text: { content: note } }] } } });
}

(async () => {
  const args = process.argv.slice(2);
  if (args[0] === '--batch') {
    const fix = args.includes('--fix');
    const leads = await notionQueryWebDesign();
    console.log(`Checking ${leads.length} Web Design leads...\n`);
    let hasSite = 0, buildable = 0, possible = 0;
    for (const p of leads) {
      const name = (p.properties['Business Name']?.title?.[0]?.plain_text) || '';
      if (!name) continue;
      const town = (p.properties['Location']?.rich_text?.[0]?.plain_text) || 'KZN';
      const alreadyFlagged = p.properties['Has Website']?.checkbox;
      const r = await checkPresence(name, town);
      const tag = r.verdict === 'HAS_SITE' ? 'HAS SITE ' : r.verdict === 'POSSIBLE_SITE' ? 'POSSIBLE ' : 'buildable';
      const siteStr = r.sites.length ? ' -> ' + r.sites.map(s => s.domain + (s.confident ? '' : '?')).join(', ') : '';
      console.log(`[${tag}] ${name.padEnd(34)}${siteStr}`);
      if (r.verdict === 'HAS_SITE') hasSite++; else if (r.verdict === 'POSSIBLE_SITE') possible++; else buildable++;
      if (fix && r.verdict === 'HAS_SITE' && !alreadyFlagged) {
        const existingNote = p.properties['Notes']?.rich_text?.[0]?.plain_text || '';
        await notionSetSite(p.id, r.sites.find(s => s.confident).domain, (existingNote + ' | presence-check: existing site found, reclassify as SEO/GEO or rebuild').trim());
        console.log(`         ^ Notion updated (Has Website=true)`);
      }
      await new Promise(res => setTimeout(res, 250));
    }
    console.log(`\nDONE: ${buildable} buildable, ${possible} possible-site (review), ${hasSite} have sites${fix ? ' (Notion updated for confirmed)' : ' (run with --fix to update Notion)'}`);
    return;
  }

  // single mode
  const [name, town] = args;
  if (!name) { console.log('usage: node presence-check.js "Business Name" "Town"  |  --batch [--fix]'); process.exit(1); }
  const r = await checkPresence(name, town || 'KZN');
  console.log(JSON.stringify(r, null, 2));
  console.log(`\nVERDICT: ${r.verdict}`);
  if (r.whatsapp.length) console.log(`WhatsApp found: ${r.whatsapp.join(', ')}`);
  process.exit(r.verdict === 'HAS_SITE' ? 3 : 0);
})();
