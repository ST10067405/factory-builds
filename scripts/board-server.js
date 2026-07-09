#!/usr/bin/env node
/*
 * board-server.js — local dashboard/CRM server for the factory mood-board.
 * Zero dependencies. Serves the repo ROOT statically (so /board/, /<slug>/ and
 * images are same-origin and cards can live-preview sites in iframes) and exposes
 * a small API for project state + notes persistence + opening folders.
 *
 *   node scripts/board-server.js          # http://localhost:8105/board/
 *
 * NEVER deploys: the `board/` folder is excluded from build.js and preflight.js.
 */
'use strict';
const http = require('http');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { execFile, execFileSync } = require('child_process');

const ROOT = path.resolve(__dirname, '..');
const BOARD_DIR = path.join(ROOT, 'board');
const DATA_FILE = path.join(BOARD_DIR, 'board-data.json');
const SLUGS = path.join(ROOT, 'slugs.json');
const ACTIVE = path.join(ROOT, 'current-builds.txt');
const PORT = 8105;
const EXCLUDE = new Set(['scripts', 'dist', '.git', '.vercel', 'node_modules', '_template', 'board']);

// ---------- per-machine config (portable) ----------
// board.config.json is gitignored — each machine has its own, pointing at wherever
// its copy of the Obsidian vault lives. Missing/wrong vaultPath degrades gracefully:
// vault-linked documents just fail to open (client gets a "not found" toast); every
// other board feature (all project cards, previews, notes, graph) needs nothing else.
const CONFIG_FILE = path.join(BOARD_DIR, 'board.config.json');
const CONFIG_EXAMPLE = path.join(BOARD_DIR, 'board.config.example.json');
function loadConfig() {
  const f = fs.existsSync(CONFIG_FILE) ? CONFIG_FILE : CONFIG_EXAMPLE;
  try { return JSON.parse(fs.readFileSync(f, 'utf8')); } catch (e) { return {}; }
}
const CONFIG = loadConfig();
const VAULT = CONFIG.vaultPath ? path.resolve(CONFIG.vaultPath) : null;
const VAULT_OK = !!(VAULT && fs.existsSync(VAULT));
if (!fs.existsSync(CONFIG_FILE)) {
  console.log(`(no board.config.json — copy board.config.example.json to board.config.json and set vaultPath for this machine)`);
}
if (VAULT && !VAULT_OK) console.log(`(vaultPath not found on this machine: ${VAULT} — vault-linked documents will show as unavailable)`);

const MIME = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.json': 'application/json',
  '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png', '.webp': 'image/webp', '.svg': 'image/svg+xml',
  '.gif': 'image/gif', '.ico': 'image/x-icon', '.woff2': 'font/woff2', '.txt': 'text/plain' };

// ---------- data helpers ----------
function readJSON(f, fallback) { try { return JSON.parse(fs.readFileSync(f, 'utf8')); } catch (e) { return fallback; } }
function loadData() {
  const d = readJSON(DATA_FILE, null);
  if (d) return d;
  return { projects: {}, documents: [] };
}
function saveData(d) {
  const tmp = DATA_FILE + '.tmp';
  fs.writeFileSync(tmp, JSON.stringify(d, null, 2));
  fs.renameSync(tmp, DATA_FILE);
}
function listBuilds() {
  return fs.readdirSync(ROOT, { withFileTypes: true })
    .filter(e => e.isDirectory() && !EXCLUDE.has(e.name) && !e.name.startsWith('.'))
    .map(e => e.name);
}
function scanFolder(slug) {
  const dir = path.join(ROOT, slug);
  const imgDir = path.join(dir, 'images');
  let imgs = [], real = 0;
  if (fs.existsSync(imgDir)) {
    imgs = fs.readdirSync(imgDir).filter(f => /\.(jpe?g|png|webp|gif|svg)$/i.test(f));
    real = imgs.filter(f => /^real_/i.test(f)).length;
  }
  return {
    hasIndex: fs.existsSync(path.join(dir, 'index.html')),
    hasLearn: fs.existsSync(path.join(dir, 'learn.html')),
    imgCount: imgs.length,
    realCount: real,
    stockCount: imgs.length - real,
  };
}

// ---------- preflight (cached) ----------
let pfCache = { at: 0, result: null };
function preflight() {
  if (Date.now() - pfCache.at < 60000 && pfCache.result) return pfCache.result;
  let pass = true, out = '';
  try { out = execFileSync('node', [path.join(__dirname, 'preflight.js')], { encoding: 'utf8' }); }
  catch (e) { pass = false; out = (e.stdout || '') + (e.stderr || ''); }
  const violations = out.split(/\r?\n/).filter(l => l.trim().startsWith('✗')).map(l => l.replace(/^\s*✗\s*/, ''));
  pfCache = { at: Date.now(), result: { pass, violations, raw: out.trim() } };
  return pfCache.result;
}

// ---------- state ----------
function buildState() {
  const data = loadData();
  const slugs = readJSON(SLUGS, {});
  const activeSet = new Set(
    (fs.existsSync(ACTIVE) ? fs.readFileSync(ACTIVE, 'utf8') : '')
      .split(/\r?\n/).map(s => s.trim()).filter(s => s && !s.startsWith('#'))
  );
  const projects = listBuilds().map(slug => {
    const scan = scanFolder(slug);
    const manual = data.projects[slug] || {};
    return {
      slug,
      title: manual.title || slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
      active: activeSet.has(slug),
      publicSlug: slugs[slug] || null,
      ...scan,
      status: manual.status || (activeSet.has(slug) ? 'gate_passed' : 'built'),
      priority: manual.priority || 'warm',
      notes: manual.notes || '',
      nextAction: manual.nextAction || '',
      caveats: manual.caveats || [],
      notionUrl: manual.notionUrl || '',
      docs: manual.docs || [],
      tags: manual.tags || [],
      sources: manual.sources || [],
      changeNotes: manual.changeNotes || '',
    };
  });
  // Documents store a vault-relative path (portable); resolve to an absolute path
  // here using THIS machine's configured vault, and flag availability for the client.
  const documents = (data.documents || []).map(d => {
    if (d.url) return { ...d, available: true };
    if (d.vaultRel) {
      const abs = VAULT_OK ? path.join(VAULT, d.vaultRel) : null;
      return { ...d, path: abs, available: !!(abs && fs.existsSync(abs)) };
    }
    return { ...d, available: !!(d.path && fs.existsSync(d.path)) }; // legacy absolute-path entries
  });

  return { projects, documents, preflight: preflight(), generatedAt: new Date().toISOString(), vaultOk: VAULT_OK, root: ROOT.replace(/\\/g, '/') };
}

// ---------- safe path check ----------
function insideAllowed(p) {
  const rp = path.resolve(p);
  return rp.startsWith(ROOT) || (VAULT_OK && rp.startsWith(VAULT));
}

// ---------- request handling ----------
function sendJSON(res, code, obj) { const b = JSON.stringify(obj); res.writeHead(code, { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(b) }); res.end(b); }
function body(req) { return new Promise(r => { let d = ''; req.on('data', c => d += c); req.on('end', () => r(d)); }); }

const server = http.createServer(async (req, res) => {
  const u = new URL(req.url, 'http://localhost');
  const p = decodeURIComponent(u.pathname);

  // ----- API -----
  if (p === '/api/state' && req.method === 'GET') {
    return sendJSON(res, 200, buildState());
  }
  if (p.startsWith('/api/project/') && req.method === 'POST') {
    const slug = p.slice('/api/project/'.length);
    if (!listBuilds().includes(slug)) return sendJSON(res, 404, { error: 'unknown slug' });
    let patch; try { patch = JSON.parse(await body(req)); } catch (e) { return sendJSON(res, 400, { error: 'bad json' }); }
    const allowed = ['title', 'status', 'priority', 'notes', 'nextAction', 'caveats', 'notionUrl', 'docs', 'tags', 'sources', 'changeNotes'];
    const data = loadData();
    data.projects[slug] = data.projects[slug] || {};
    for (const k of allowed) if (k in patch) data.projects[slug][k] = patch[k];
    saveData(data);
    return sendJSON(res, 200, { ok: true, slug, saved: data.projects[slug] });
  }
  // list a build's images (for the Review workspace to show current assets)
  if (p.startsWith('/api/images/') && req.method === 'GET') {
    const slug = p.slice('/api/images/'.length);
    if (!listBuilds().includes(slug)) return sendJSON(res, 404, { error: 'unknown slug' });
    const imgDir = path.join(ROOT, slug, 'images');
    const images = fs.existsSync(imgDir)
      ? fs.readdirSync(imgDir).filter(f => /\.(jpe?g|png|webp|gif|svg)$/i.test(f)).sort()
      : [];
    return sendJSON(res, 200, { slug, images });
  }
  // upload an image straight into a build's assets folder (drag-drop / clipboard paste
  // from the Review workspace). Body: { filename?, dataUrl }. Saved as real_added_* so it
  // counts as a real client photo. Cross-client dupes are still caught later by preflight.
  if (p.startsWith('/api/upload/') && req.method === 'POST') {
    const slug = p.slice('/api/upload/'.length);
    if (!listBuilds().includes(slug)) return sendJSON(res, 404, { error: 'unknown slug' });
    let b; try { b = JSON.parse(await body(req)); } catch (e) { return sendJSON(res, 400, { error: 'bad json' }); }
    const m = /^data:image\/(png|jpe?g|webp|gif);base64,(.+)$/i.exec(b.dataUrl || '');
    if (!m) return sendJSON(res, 400, { error: 'expected a base64 image dataUrl' });
    const ext = m[1].toLowerCase() === 'jpeg' ? 'jpg' : m[1].toLowerCase();
    const buf = Buffer.from(m[2], 'base64');
    if (buf.length > 15 * 1024 * 1024) return sendJSON(res, 400, { error: 'image too large (>15MB)' });
    const imgDir = path.join(ROOT, slug, 'images');
    fs.mkdirSync(imgDir, { recursive: true });
    let base = (b.filename || '').replace(/\.[^.]*$/, '').replace(/[^a-z0-9_-]+/gi, '-').replace(/^-+|-+$/g, '').slice(0, 40);
    let name = 'real_added_' + (base || Date.now()) + '.' + ext;
    let i = 1;
    while (fs.existsSync(path.join(imgDir, name))) name = 'real_added_' + (base || Date.now()) + '-' + (i++) + '.' + ext;
    fs.writeFileSync(path.join(imgDir, name), buf);
    return sendJSON(res, 200, { ok: true, slug, filename: name });
  }
  if (p === '/api/open' && req.method === 'POST') {
    let b; try { b = JSON.parse(await body(req)); } catch (e) { return sendJSON(res, 400, { error: 'bad json' }); }
    // Accept {path} (validated), or {slug[, sub]} to open a build folder / its images.
    let target = b.path;
    if (!target && b.slug && listBuilds().includes(b.slug)) {
      target = path.join(ROOT, b.slug, b.sub === 'images' ? 'images' : '');
    }
    if (!target || !insideAllowed(target) || !fs.existsSync(path.resolve(target)))
      return sendJSON(res, 400, { error: 'path not allowed or missing' });
    execFile('explorer.exe', [path.resolve(target).replace(/\//g, '\\')], () => {}); // explorer returns 1 even on success
    return sendJSON(res, 200, { ok: true, opened: target });
  }
  if (p === '/api/preflight/refresh' && req.method === 'POST') { pfCache = { at: 0, result: null }; return sendJSON(res, 200, preflight()); }

  // ----- static (repo root) -----
  let rel = p === '/' ? '/board/index.html' : p;
  if (rel.endsWith('/')) rel += 'index.html';
  const file = path.resolve(ROOT, '.' + rel);
  if (!file.startsWith(ROOT)) { res.writeHead(403); return res.end('forbidden'); }
  fs.readFile(file, (err, buf) => {
    if (err) { res.writeHead(404, { 'Content-Type': 'text/plain' }); return res.end('404 ' + rel); }
    const ext = path.extname(file).toLowerCase();
    const headers = { 'Content-Type': MIME[ext] || 'application/octet-stream' };
    if (rel.startsWith('/board/') || ext === '.html' || ext === '.js') headers['Cache-Control'] = 'no-store';
    res.writeHead(200, headers);
    res.end(buf);
  });
});

server.listen(PORT, () => console.log(`Factory board → http://localhost:${PORT}/board/`));
