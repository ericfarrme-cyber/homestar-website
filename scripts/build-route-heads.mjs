/**
 * Per-route <head> injection (post-build).
 *
 * WHY THIS EXISTS
 * ---------------
 * The site is a client-rendered SPA. Before this script, every URL on the domain
 * served the exact same dist/index.html — identical <title>, and (since the July
 * 2026 fix removed the hardcoded homepage canonical) no <link rel="canonical"> at
 * all. Googlebot's first, pre-JavaScript pass therefore saw byte-identical head
 * signals on every route and grouped real pages together as duplicates.
 *
 * Confirmed in GSC on 2026-08-05:
 *   /kitchen-remodeling-zionsville-in -> "Duplicate without user-selected canonical",
 *   User-declared canonical: None.
 *
 * This script writes one static HTML file per sitemap URL, identical to the built
 * index.html except that it carries that route's OWN self-referencing canonical and
 * og:url. Content still renders via JavaScript exactly as before — the crawler just
 * gets the correct identity on first contact.
 *
 * Vercel resolves the filesystem before applying the SPA rewrite in vercel.json, so
 * dist/<route>/index.html is served directly for /<route>. Unknown routes still fall
 * through the rewrite to the plain index.html, which declares no canonical and lets
 * Google self-canonicalize — the same (safe) behaviour as before this script existed.
 *
 * Deliberately NOT done here: per-route <title>/<meta description> injection. The app
 * sets those at runtime and Google demonstrably renders them (pages rank for their
 * correct queries), so baking in statically-derived titles would risk shipping worse
 * titles than the ones already working. Canonical is the signal that is actually
 * broken, so canonical is what this fixes.
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const dist = join(root, 'dist');
const ORIGIN = 'https://www.thehomestarservice.com';

const indexPath = join(dist, 'index.html');
if (!existsSync(indexPath)) {
  console.error('[route-heads] dist/index.html not found — run vite build first.');
  process.exit(1);
}

const template = readFileSync(indexPath, 'utf8');
const sitemap = readFileSync(join(root, 'public', 'sitemap.xml'), 'utf8');

const locs = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].trim());
if (!locs.length) {
  console.error('[route-heads] no <loc> entries found in public/sitemap.xml');
  process.exit(1);
}

// Sanity: the template must not already carry a hardcoded canonical, or we would
// emit two competing canonical tags per page.
if (/<link[^>]+rel=["']canonical["']/i.test(template)) {
  console.error('[route-heads] dist/index.html already contains a <link rel="canonical">. Aborting to avoid duplicate canonicals.');
  process.exit(1);
}

const escapeAttr = (s) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;');

let written = 0;
let skipped = 0;

for (const loc of locs) {
  let path;
  try {
    path = new URL(loc).pathname;
  } catch {
    console.warn(`[route-heads] skipping unparseable loc: ${loc}`);
    skipped++;
    continue;
  }

  const clean = path.replace(/^\/+/, '').replace(/\/+$/, '');

  // Homepage keeps the plain built index.html, but still gets an explicit canonical.
  const canonical = clean ? `${ORIGIN}/${clean}` : `${ORIGIN}/`;

  // Files already emitted by the build (e.g. privacy-policy.html) must not be clobbered.
  if (clean.includes('.')) {
    skipped++;
    continue;
  }

  let html = template.replace(
    /<title>/i,
    `<link rel="canonical" href="${escapeAttr(canonical)}" />\n    <title>`
  );

  html = html.replace(
    /(<meta\s+property=["']og:url["']\s+content=)["'][^"']*["']/i,
    `$1"${escapeAttr(canonical)}"`
  );

  const outPath = clean ? join(dist, clean, 'index.html') : indexPath;
  mkdirSync(dirname(outPath), { recursive: true });
  writeFileSync(outPath, html, 'utf8');
  written++;
}

console.log(`[route-heads] wrote ${written} per-route HTML files (${skipped} skipped) from ${locs.length} sitemap URLs.`);
