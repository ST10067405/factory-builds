#!/usr/bin/env node
/*
 * preflight.js — STRUCTURAL SOP GATE for the Arkatype web-design factory.
 *
 * Not a checklist you can forget — a hard gate. It runs:
 *   - automatically as the first step of scripts/build.js (the Vercel buildCommand),
 *     so a non-compliant site CANNOT deploy; and
 *   - manually (`node scripts/preflight.js`) BEFORE any site is presented for review.
 * Exits non-zero on any violation. Do not bypass.
 *
 * SCOPE:
 *   - UNIVERSAL (every build, always): no cross-client duplicate images, no reused
 *     journal articles across clients, no broken image refs. These are the
 *     compartmentalisation invariants that must never break at scale.
 *   - ACTIVE STANDARD (builds listed in current-builds.txt): must ALSO have a unique
 *     journal, Comms Bridge, Our Work section, real-photo discipline, no invented
 *     prices, no unfilled tokens, noindex + draft ribbon + reduced-motion.
 *   Legacy builds predating the standard are grandfathered until added to the manifest.
 *
 *   node scripts/preflight.js            # full gate
 *   node scripts/preflight.js <slug>     # focus content report on one active build
 */
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const ROOT = path.join(__dirname, '..');
const EXCLUDE = new Set(['scripts', 'dist', '.git', '.vercel', 'node_modules', '_template', 'board']);
const focus = process.argv[2];

const manifestPath = path.join(ROOT, 'current-builds.txt');
const active = fs.existsSync(manifestPath)
  ? new Set(fs.readFileSync(manifestPath, 'utf8').split(/\r?\n/).map(s => s.trim()).filter(Boolean).filter(s => !s.startsWith('#')))
  : null; // null => treat all as active

const clients = fs.readdirSync(ROOT, { withFileTypes: true })
  .filter(e => e.isDirectory() && !EXCLUDE.has(e.name) && !e.name.startsWith('.'))
  .map(e => e.name);

const isActive = slug => active === null ? true : active.has(slug);

const fails = [];
const fail = m => fails.push(m);
const imgHashes = {};      // md5 -> [slug/images/file]
const journalTitles = {};  // article title -> Set(slug)

function stripCode(html) {
  return html.replace(/<style[\s\S]*?<\/style>/gi, '').replace(/<script[\s\S]*?<\/script>/gi, '');
}

for (const slug of clients) {
  const dir = path.join(ROOT, slug);
  const idx = path.join(dir, 'index.html');
  const learn = path.join(dir, 'learn.html');
  const imgDir = path.join(dir, 'images');
  if (!fs.existsSync(idx)) { if (isActive(slug)) fail(`${slug}: missing index.html`); continue; }

  // ---- image hashes (UNIVERSAL cross-client dedupe) ----
  if (fs.existsSync(imgDir)) {
    for (const f of fs.readdirSync(imgDir)) {
      if (!/\.(jpe?g|png|webp|gif|svg)$/i.test(f)) continue;
      const h = crypto.createHash('md5').update(fs.readFileSync(path.join(imgDir, f))).digest('hex');
      (imgHashes[h] = imgHashes[h] || []).push(`${slug}/images/${f}`);
    }
  }

  // ---- broken refs (UNIVERSAL) + collect journal titles (UNIVERSAL) ----
  for (const page of ['index.html', 'learn.html']) {
    const p = path.join(dir, page);
    if (!fs.existsSync(p)) continue;
    const html = fs.readFileSync(p, 'utf8');
    for (const r of new Set([...html.matchAll(/images\/([a-zA-Z0-9_.-]+\.(?:jpe?g|png|webp|gif|svg))/gi)].map(m => m[1]))) {
      if (!fs.existsSync(path.join(imgDir, r))) fail(`${slug}/${page}: broken image ref -> images/${r}`);
    }
    if (page === 'learn.html') {
      for (const t of new Set([...html.matchAll(/title:\s*['"]([^'"]{4,})['"]/g)].map(m => m[1].trim().toLowerCase()))) {
        (journalTitles[t] = journalTitles[t] || new Set()).add(slug);
      }
    }
  }

  // ---- ACTIVE-STANDARD per-build content checks ----
  if (!isActive(slug)) continue;
  if (focus && focus !== slug) continue;

  if (!fs.existsSync(learn)) fail(`${slug}: missing learn.html (journal REQUIRED)`);

  for (const page of ['index.html', 'learn.html']) {
    const p = path.join(dir, page);
    if (!fs.existsSync(p)) continue;
    const html = fs.readFileSync(p, 'utf8');
    const body = stripCode(html);
    if (html.includes('{{')) fail(`${slug}/${page}: unfilled {{TOKEN}} placeholders`);
    if (/\bR\s?\d{2,}/.test(body)) fail(`${slug}/${page}: looks like an invented price (only "R —" allowed)`);
    if (!/name=["']robots["'][^>]*noindex/i.test(html)) fail(`${slug}/${page}: missing noindex meta`);
    if (!/Concept draft/i.test(html)) fail(`${slug}/${page}: missing draft ribbon`);
    if (!/prefers-reduced-motion/i.test(html)) fail(`${slug}/${page}: missing reduced-motion guard`);
  }

  const ih = fs.existsSync(idx) ? fs.readFileSync(idx, 'utf8') : '';
  if (!/wa\.me\//.test(ih)) fail(`${slug}/index.html: missing WhatsApp click-to-chat`);
  if (!/output=embed/.test(ih)) fail(`${slug}/index.html: missing Google Maps embed`);
  if (!/chatToggle/.test(ih)) fail(`${slug}/index.html: missing Q&A chat`);
  if (!/href=["']learn\.html["']/.test(ih)) fail(`${slug}/index.html: Journal not linked`);
  if (!/id=["']work["']/.test(ih)) fail(`${slug}/index.html: missing "Our Work" section`);

  if (fs.existsSync(learn)) {
    const lh = fs.readFileSync(learn, 'utf8');
    if (!/FAQPage/.test(lh)) fail(`${slug}/learn.html: missing FAQPage JSON-LD`);
    if (!/amodal/.test(lh)) fail(`${slug}/learn.html: missing article modal`);
    const n = [...lh.matchAll(/title:\s*['"][^'"]{4,}['"]/g)].length;
    if (n < 6) fail(`${slug}/learn.html: journal needs >=6 articles (found ${n})`);
  }
}

// ---- UNIVERSAL cross-client checks ----
for (const [h, files] of Object.entries(imgHashes)) {
  if (new Set(files.map(f => f.split('/')[0])).size > 1)
    fail(`CROSS-CLIENT DUPLICATE IMAGE (each client needs its OWN assets):\n      ${files.join('\n      ')}`);
}
for (const [title, slugs] of Object.entries(journalTitles)) {
  if (slugs.size > 1) fail(`REUSED JOURNAL ARTICLE "${title}" in: ${[...slugs].join(', ')} (journals must be unique per client)`);
}

const scope = active ? `${[...active].length} active builds (of ${clients.length})` : `${clients.length} builds`;
console.log(`preflight — ${scope}\n`);
if (fails.length === 0) {
  console.log('PASS ✓  Compartmentalised assets, unique journals, Comms Bridge, real-photo discipline, no invented data. Safe to present / deploy.');
  process.exit(0);
}
console.log(`FAIL ✗  ${fails.length} SOP violation(s) — DO NOT present or deploy until fixed:\n`);
fails.forEach(f => console.log('  ✗ ' + f));
process.exit(1);
