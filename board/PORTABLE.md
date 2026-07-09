# Running the board on another PC

The board is a plain Node.js server with **zero npm dependencies** — copying the
folder is basically the whole job.

## What to copy

Copy the entire `factory-builds` folder (this repo) to the other PC — e.g. via a
USB drive, a zip, or `git clone` if they have the repo access. The board needs the
sibling site folders to preview and scan, so don't cherry-pick just `board/`.

## Requirements on the target PC

- **Node.js** installed (any recent version — https://nodejs.org). Nothing else;
  no `npm install` step, no other software.

## First run

1. Double-click **`start-board.bat`** at the repo root.
   - It auto-creates `board/board.config.json` from the example on first run.
   - It opens `http://localhost:8105/board/` in the default browser.
2. If that PC has its own copy of the Obsidian vault (SOPs, pricing docs), open
   `board/board.config.json` and set `vaultPath` to where it lives on that machine.
   If there's no vault there, leave it — the board still works fully, the vault-linked
   document chips just show dimmed/"unavailable" instead of opening.

## What's portable vs. per-machine

- **Portable (travels with the repo):** all 28 project cards, live previews, the
  graph, the preflight gate, and all your notes/status/priority/next-actions —
  `board/board-data.json` is a plain file in the repo.
- **Per-machine (not committed):** `board/board.config.json` — gitignored on
  purpose, since the vault lives at a different path (or not at all) on each PC.

## Stopping/restarting

Close the console window `start-board.bat` opened, or run
`node scripts/board-server.js` directly from a terminal in the repo root for more
control (Ctrl+C to stop).
