#!/usr/bin/env node
// Copies each top-level concept-site folder into dist/<random-slug>/ so the
// deployed site has no business-name routes — only unguessable slugs.
// Slugs are persisted in slugs.json so links never change across rebuilds.
"use strict";

const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

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

function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

function main() {
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
