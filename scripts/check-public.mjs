/**
 * Fail the build if anything unexpected is sitting in public/.
 *
 * Written 2026-09-06, after a 1.2 GB git worktree was found inside
 * public/images/. Vite copies public/ verbatim into dist/, so a complete
 * checkout of this repository - src, scripts, marketing, docs - was being
 * built into the site and deployed. It was untracked, so it never appeared in
 * git status, and it was only found by grepping the built output for an
 * unrelated phrase.
 *
 * The lesson is the one that keeps recurring here: nothing was checking. This
 * runs before every build and refuses to continue rather than shipping
 * something nobody meant to publish.
 *
 * It is deliberately a denylist of things that must never be served plus a
 * size ceiling, rather than an allowlist of filenames - project photos get
 * added constantly and an allowlist would just get switched off.
 */

import { readdirSync, statSync } from "node:fs";
import { join, extname, basename } from "node:path";

const PUBLIC = "public";

// Names that must never appear anywhere under public/.
const FORBIDDEN_DIRS = new Set([
  ".git", ".claude", "node_modules", ".vercel", ".vscode", ".idea",
  "src", "scripts", "dist", ".next", "coverage",
]);

// Extensions that indicate source or config, not a web asset.
const FORBIDDEN_EXT = new Set([
  ".jsx", ".tsx", ".ts", ".mjs", ".cjs", ".py", ".env",
  ".lock", ".log", ".mbtree", ".bak",
]);

// Specific filenames that would leak config or dependency detail.
const FORBIDDEN_FILES = new Set([
  "package.json", "package-lock.json", "yarn.lock", "pnpm-lock.yaml",
  "vite.config.js", "vercel.json", "tsconfig.json", ".env", ".env.local",
]);

// public/ is mostly project photography and a few videos. Well above what it
// holds today, low enough that a stray checkout or archive trips it.
const MAX_MB = 900;

const problems = [];
const warnings = [];
let bytes = 0;
let files = 0;

function countFiles(dir) {
  let n = 0;
  let entries;
  try {
    entries = readdirSync(dir, { withFileTypes: true });
  } catch {
    return 0;
  }
  for (const e of entries) {
    if (e.isDirectory()) n += countFiles(join(dir, e.name));
    else if (e.isFile()) n += 1;
  }
  return n;
}

function walk(dir, depth = 0) {
  let entries;
  try {
    entries = readdirSync(dir, { withFileTypes: true });
  } catch {
    return; // unreadable (locked on Windows) - nothing to serve from it either
  }
  for (const e of entries) {
    const full = join(dir, e.name);
    if (e.isDirectory()) {
      if (FORBIDDEN_DIRS.has(e.name)) {
        // An empty directory deploys nothing, so it is a warning rather than a
        // failure. This is not a loophole: the moment a file appears inside
        // one, countFiles finds it and the build stops. It exists because a
        // removed worktree can leave a locked, empty husk behind on Windows,
        // and that should not block every deploy.
        const n = countFiles(full);
        if (n === 0) {
          warnings.push(`directory "${full}" is empty but should not exist - delete it when the lock clears`);
        } else {
          problems.push(`directory "${full}" holds ${n} file(s) and must not be inside public/ - it would be deployed`);
        }
        continue; // do not descend; one report is enough
      }
      if (depth > 8) {
        problems.push(`"${full}" is nested unusually deep for a public asset`);
        continue;
      }
      walk(full, depth + 1);
    } else if (e.isFile()) {
      files += 1;
      try {
        bytes += statSync(full).size;
      } catch {
        /* ignore */
      }
      if (FORBIDDEN_FILES.has(e.name)) {
        problems.push(`file "${full}" must not be inside public/ - it would be deployed`);
      } else if (FORBIDDEN_EXT.has(extname(e.name).toLowerCase())) {
        problems.push(`file "${full}" looks like source or config, not a web asset`);
      } else if (basename(e.name).startsWith(".env")) {
        problems.push(`file "${full}" must not be inside public/`);
      }
    }
  }
}

walk(PUBLIC);

const mb = bytes / (1024 * 1024);
if (mb > MAX_MB) {
  problems.push(
    `public/ is ${mb.toFixed(0)} MB across ${files} files, over the ${MAX_MB} MB ceiling. ` +
    `Something large is in there that probably should not be.`
  );
}

if (problems.length) {
  console.error("\npublic/ contains things that must not be deployed:\n");
  for (const p of problems) console.error("  - " + p);
  console.error(
    "\nVite copies public/ verbatim into dist/, so anything above would go live.\n" +
    "Remove it, or add a deliberate exception in scripts/check-public.mjs.\n"
  );
  process.exit(1);
}

for (const w of warnings) console.warn("[check-public] warning: " + w);
console.log(`[check-public] ${files} files, ${mb.toFixed(0)} MB - nothing unexpected.`);
