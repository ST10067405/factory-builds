# HANDOVER PROMPT — Build the Factory Mood-Board / Project CRM

> **STATUS: BUILT (2026-07-05).** The board is implemented and verified working, running at
> `http://localhost:8105/board/`. Files: `scripts/board-server.js` (API + static, port 8105,
> excluded from build.js/preflight.js), `board/index.html` (brand-card CRM), `board/graph.html`
> (force-graph), `board/board-data.json` (persisted notes/status; git-tracked). Start it with
> `node scripts/board-server.js` or preview config `factory-board`. A continuing agent should
> POLISH/EXTEND (not rebuild): e.g. kanban view, Notion per-lead deep-links, board committed to
> git after Jaime approves. The plan below is the original spec, kept for reference.

Paste this whole document to the agent continuing the work. It is self-contained.

---

## Who you're working for

Jaime (and partner Zander) run **Arkatype Digital** — a web-design factory that builds speculative
Tier-0 demo websites for local SMEs (Upper Highway, KZN, South Africa), pitches them with the live
demo, and closes at R2,000–4,000 + a R250–1,000/month retainer. You are the build/ops agent.

## Your immediate task

Build a **mood-board / project CRM dashboard** (like an earlier "Dialcover board") where Jaime can:
- See ALL concept sites as **brand cards** with live previews, and open each site
- **Make notes** on each project (persisted), set status/priority/next-action → use it as a CRM
- Jump to each project's **assets folder** and **linked documents** (Notion lead record, outreach draft, SOPs)
- Open a **graph view** page — a light force-directed graph of projects ↔ documents ↔ brand cards
  (NOT Obsidian's graph, just one clickable page)
- Manage the project pipeline from it

The full build plan is at the bottom. **Plan first was already done — execute the plan.**

## Where everything lives

| Thing | Location |
|---|---|
| Factory builds repo (28 concept sites) | `C:\Users\jaime\_factory_audit\builds` (git: `ST10067405/factory-builds`, main) |
| Per-site shape | `<slug>/index.html` + `<slug>/learn.html` (journal) + `<slug>/images/` |
| Public slugs (customer links) | `slugs.json` (e.g. synergy-hair-kloof → `89c85e8a8872d57e`) |
| Active-standard builds | `current-builds.txt` (5: synergy-hair-kloof, avant-garde-hair, village-pet-parlour, integrity-hair, charlies-hair-salon) |
| Repo rules (READ FIRST) | `CLAUDE.md` in the repo — includes the STRUCTURAL SOP GATE section |
| Vault (SOPs, strategy docs) | `C:\Users\jaime\Desktop\obsidian-vault\` — see `sops/Web Design Process Flow.md`, `sops/Client Management & Retainer Structure.md`, `income-pillars/Web Design & Digital Strategy.md`, `income-pillars/International Rollout Plan.md`, `sops/Side-Hustle Scout — Facebook Segment.md` |
| Notion Leads DB | `8c668bf4-4140-464e-9a66-242df372ce5a` ("Leads — Web Design Prospects") |
| Notion Clients DB | `391fe00d-e722-8191-a62c-e50f91fefe2d` ("Clients — Web Design") |
| Notion token | see memory file `notion-api-token.md` (also used inside repo scripts) |
| Serper API key | inside `scripts/presence-check.js` / `scripts/pull-photos.js` |
| n8n (Railway) | `https://primary-production-1527.up.railway.app` — workflows: `lead_enrichment_stage2` (uZ6DabYTBOc8hQay), `client_uptime_monitor`, `client_invoice_reminder`, `sidehustle_scout` (Mondays 06:00 → Telegram digest). API key: ASK JAIME (JWT, not stored). |
| Local static server | port **8104** serves the builds root (may need restarting — a simple node http server over the repo root) |
| Session reporting | At end of session POST a work report to Architect Console — see memory `feedback-session-reporting.md` (projectId `website-factory`) |

## HARD RULES — violations of these already happened once; they are now machine-enforced

1. **`node scripts/preflight.js` must PASS before you present ANY site or board state to Jaime,
   and it runs automatically inside `scripts/build.js` (deploy aborts on failure). Never bypass.**
   It enforces: no cross-client duplicate images (md5), no reused journal articles across clients,
   no broken image refs, and (for `current-builds.txt` sites) journal + Comms Bridge + Our Work +
   no invented prices + noindex/draft-ribbon/reduced-motion.
2. **Compartmentalisation:** each client folder contains ONLY that client's unique assets. Never
   share an image or journal copy between clients. (A real client photo once ended up on another
   client's site — that's the incident behind the gate.)
3. **No invented facts** on any site: prices stay "R —", unknown hours get the draft marker,
   review quotes must be real Google reviews.
4. **Before building any NEW site:** run `node scripts/presence-check.js "Name" "Town"` —
   `HAS_SITE` means do NOT build (Notion "Has Website" and Google Maps are unreliable).
   Real photos: `node scripts/pull-photos.js "query" <slug> 10`, then **Read-vet every image**
   (Serper mis-attributes photos across businesses; reject anything not clearly this client's).
5. **Windows tooling trap:** passing code through Bash heredocs/inline `node -e` corrupts
   backslashes and non-ASCII on this machine. Write scripts to files with the Write tool, then run
   `node file.js`. (This burned two n8n workflows before it was diagnosed.)
6. **Deploy and outreach-send are HUMAN gates.** Never deploy to Vercel or send outreach yourself.
   Nothing in the current batch is committed/deployed until Jaime reviews.
7. **Subagent orchestration** (Jaime's cost preference): orchestrate from the main session; delegate
   mechanical builds to **Sonnet** subagents with locked, detailed specs (design direction, exact
   data, guardrails, "no browser tools" when parallel); you verify everything yourself afterwards
   (hash checks, render checks, preflight). Note: subagents can hit session usage limits — if they
   fail with a limit message, do the work yourself in the main session.

## Current pipeline state (2026-07-05)

- 5 batch sites built to full standard, **preflight PASS**, reviewed-in-progress by Jaime, NOT
  committed/deployed. Caveats: Synergy has an existing basic site (pitch = rebuild; WhatsApp
  072 469 7969 confirmed); Avant Garde's listed site is dead (verify before outreach); Charlie's has
  an ownership transition (Charlie→Anne — confirm who to pitch); Village Pet Parlour + Avant Garde
  have NO real photos available (stock + on-page disclosure); Village phone is a landline (confirm
  WhatsApp before go-live).
- 23 older builds are grandfathered (not in `current-builds.txt`), don't meet the journal/photo
  standard yet.
- Outreach drafts exist in the Notion Leads DB "Email Draft" field for VELVET. coffee co and
  The Coffee Minista; nothing has ever been SENT (human gate).
- Back half live: Clients DB + n8n uptime monitor + invoice reminder (verified end-to-end).

---

# THE BOARD PLAN (execute this)

## Architecture

- New folder **`board/`** at repo root. It must NEVER deploy publicly (it lists all client slugs).
  → Add `"board"` to `EXCLUDED_DIRS` in `scripts/build.js` AND to `EXCLUDE` in `scripts/preflight.js`.
- **`scripts/board-server.js`** — small node server on **port 8105**, no dependencies:
  - Serves the repo ROOT statically (so `/board/`, `/synergy-hair-kloof/`, images etc. are same-origin
    and cards can live-preview sites in iframes).
  - `GET /api/state` → merged project state:
    - auto-scanned per folder: slug, has index/learn, image count, `real_*` photo count,
      public slug from `slugs.json`, active flag from `current-builds.txt`
    - manual fields from `board/board-data.json`
    - latest preflight result (run `scripts/preflight.js` via child_process, cache ~60s; return
      pass/fail + violation lines)
    - the `documents` list from board-data.json
  - `POST /api/project/<slug>` (JSON body) → merge fields into `board-data.json` (atomic write)
  - `POST /api/open` {path} → open folder in Windows Explorer (`explorer.exe`), but ONLY for paths
    inside the repo or the vault (guard against arbitrary exec)
  - No external calls. Notion is deep-linked, not synced (v2 can add sync).
- **`board/board-data.json`** — git-tracked persistence:
  ```json
  {
    "projects": {
      "<slug>": {
        "title": "", "status": "built|gate_passed|deployed|outreach_sent|replied|won|cold",
        "priority": "hot|warm|cold", "notes": "", "nextAction": "",
        "caveats": [""], "notionUrl": "", "docs": [{"label":"","url":""}], "tags": [""]
      }
    },
    "documents": [
      {"id":"sop-process","label":"Web Design Process Flow (SOP)","path":"C:/Users/jaime/Desktop/obsidian-vault/sops/Web Design Process Flow.md","type":"sop"},
      {"id":"sop-clients","label":"Client Management & Retainer Structure","path":"...","type":"sop"},
      {"id":"doc-pricing","label":"Web Design & Digital Strategy (pricing)","path":"...","type":"doc"},
      {"id":"doc-agreement","label":"Service Agreement (Tier 0) draft","path":"...","type":"doc"},
      {"id":"db-leads","label":"Leads DB (Notion)","url":"https://app.notion.com/p/8c668bf44140464e9a66242df372ce5a","type":"db"},
      {"id":"db-clients","label":"Clients DB (Notion)","url":"https://app.notion.com/p/391fe00de7228191a62ce50f91fefe2d","type":"db"}
    ]
  }
  ```
  **Seed** the 5 active builds with their real statuses (gate_passed), priorities and the caveats
  listed above; seed the 23 legacy builds with status "built".
- **`board/index.html`** — the brand-card board (single file, no framework):
  - Header: factory title, preflight badge (PASS green / FAIL red with violation count → click
    to expand violations), counts by status, search box, status/priority filters.
  - Grid of **brand cards**, one per project folder: lazy live iframe preview (scaled-down,
    `loading=lazy`, only render when scrolled into view — 28 iframes must not load at once),
    title, active/legacy chip, status dropdown (writes via API), priority chip, real-photo count
    ("📷 2 real / 3 stock" style), caveat badges, notes textarea (autosave on blur via API),
    next-action input, and quick links: **Open site** (`/slug/`), **Journal** (`/slug/learn.html`),
    **Assets folder** (POST /api/open), **Notion lead** (notionUrl if set), **Copy public slug URL**.
  - Kanban toggle (optional v1.5): group cards by status columns.
  - Style: dark editorial dashboard, distinct from client sites; keep it fast and dependency-free.
- **`board/graph.html`** — graph view (canvas, vanilla JS force layout, ~150 lines physics):
  - Nodes: projects (colored by status), documents/SOPs, Notion DBs, the `_template`, asset folders
    (collapsed into their project node; toggle to expand).
  - Edges: project→docs it links, all projects→Leads DB, active projects→SOP/process, docs↔docs
    (SOPs reference each other).
  - Click node → open (site / document via /api/open / Notion URL). Drag to rearrange, search to
    highlight. Link back to the board.
- **`.claude/launch.json`** entry (in the working dir Claude uses): name `factory-board`,
  `node scripts/board-server.js`, port 8105 — so it starts with one preview_start.

## Build order (orchestrate; UI pages can be parallel Sonnet subagents)

1. YOU (main session): `board-server.js` + `board-data.json` seed + build.js/preflight exclusions.
   Verify API by curl before delegating UI.
2. Subagent A: `board/index.html` per spec (give it the exact `/api/state` response shape and a
   sample). No browser tools if run in parallel.
3. Subagent B: `board/graph.html` per spec (same state shape).
4. YOU: integrate, render-verify in Chrome (cards load, notes persist across reload, status saves,
   folder-open works, graph clickable), run `node scripts/preflight.js` (must still PASS — board
   excluded), THEN present to Jaime with the URL `http://localhost:8105/board/`.
5. Do NOT commit until Jaime approves the board. When he does: commit board/ + script changes
   (never `dist/`), push to main.

## Definition of done

- `http://localhost:8105/board/` shows all 28 projects as cards; notes/status/next-action persist
  across server restarts; assets folders open in Explorer; Notion links work for seeded projects;
  graph page renders and every node opens its target; preflight still PASSES; nothing deployed;
  Jaime has reviewed and approved.

## After the board (known backlog, don't start without asking)

- Commit/deploy gate for the 5-site batch (Jaime's review pending) + outreach approval
- Retrofit journals/photos to the 23 legacy builds (lazily, before each one's outreach)
- Payfast account (Jaime, human task) · Vercel deploy of factory-builds (human gate)
- Monday side-hustle digest vetting · entity structure decision (blocks international Phase 2)
