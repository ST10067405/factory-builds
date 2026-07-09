#!/usr/bin/env node
// Copies each top-level concept-site folder into dist/<random-slug>/ so the
// deployed site has no business-name routes — only unguessable slugs.
// Slugs are persisted in slugs.json so links never change across rebuilds.
"use strict";

const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const { execFileSync } = require("child_process");

const ROOT = path.join(__dirname, "..");
const DIST = path.join(ROOT, "dist");
const SLUGS_PATH = path.join(ROOT, "slugs.json");

const EXCLUDED_DIRS = new Set([
  "scripts",
  "dist",
  ".git",
  ".vercel",
  "node_modules",
  "_template",
  "board",
]);

function loadSlugs() {
  if (fs.existsSync(SLUGS_PATH)) {
    return JSON.parse(fs.readFileSync(SLUGS_PATH, "utf8"));
  }
  return {};
}

function saveSlugs(slugs) {
  fs.writeFileSync(SLUGS_PATH, JSON.stringify(slugs, null, 2) + "\n");
}

function listBuildFolders() {
  return fs
    .readdirSync(ROOT, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && !EXCLUDED_DIRS.has(entry.name) && !entry.name.startsWith("."))
    .map((entry) => entry.name);
}

// Internal design/brief docs live co-located in each client folder but must NEVER
// deploy to the public site (they hold strategy, anti-references, pitch notes).
const SKIP_DEPLOY_FILES = new Set(["PRODUCT.md", "DESIGN.md"]);

function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      if (entry.name.startsWith(".")) continue; // skip nested .claude etc.
      copyDir(srcPath, destPath);
    } else if (!SKIP_DEPLOY_FILES.has(entry.name)) {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

function main() {
  // STRUCTURAL SOP GATE: a non-compliant build cannot deploy. preflight.js exits
  // non-zero on any violation (cross-client duplicate assets, reused journals,
  // missing journal/Comms Bridge, invented data, broken refs), which aborts the
  // Vercel build here. Do not remove or bypass.
  try {
    execFileSync("node", [path.join(__dirname, "preflight.js")], { stdio: "inherit" });
  } catch (e) {
    console.error("\nBuild aborted: preflight SOP gate failed. Fix the violations above before deploying.");
    process.exit(1);
  }

  const folders = listBuildFolders();
  const slugs = loadSlugs();

  let mintedNew = false;
  for (const folder of folders) {
    if (!slugs[folder]) {
      slugs[folder] = crypto.randomBytes(8).toString("hex");
      mintedNew = true;
    }
  }
  if (mintedNew) {
    saveSlugs(slugs);
  }

  fs.rmSync(DIST, { recursive: true, force: true });
  fs.mkdirSync(DIST, { recursive: true });

  for (const folder of folders) {
    const slug = slugs[folder];
    copyDir(path.join(ROOT, folder), path.join(DIST, slug));
    console.log(`${folder} -> /${slug}/`);
  }

  fs.writeFileSync(path.join(DIST, "robots.txt"), "User-agent: *\nDisallow: /\n");

  console.log(`\nBuilt ${folders.length} site(s) into dist/.`);
  if (mintedNew) {
    console.log(
      "New slug(s) were minted in slugs.json — commit this file before deploying."
    );
  }
}

main();
