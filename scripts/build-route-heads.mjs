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
 * index.html except that it carries that route's OWN canonical, og:url, <title>,
 * <meta description> and OG/Twitter title+description.
 *
 * Vercel resolves the filesystem before applying the SPA rewrite in vercel.json, so
 * dist/<route>/index.html is served directly for /<route>. Unknown routes still fall
 * through the rewrite to the plain index.html, which declares no canonical and lets
 * Google self-canonicalize — the same (safe) behaviour as before this script existed.
 *
 * TITLES/DESCRIPTIONS — REVERSED 2026-08-14
 * -----------------------------------------
 * This script previously declined to inject per-route <title>/<meta description>,
 * on the reasoning that "the app sets those at runtime and Google demonstrably
 * renders them, so baking in statically-derived titles would risk shipping worse
 * titles than the ones already working."
 *
 * That reasoning was correct ABOUT GOOGLE and is now insufficient. Verified
 * 2026-08-14: the raw HTML for every route is ~3.7KB with an empty <div id="root">
 * and the GENERIC homepage title + description. Anything that reads raw HTML without
 * executing JavaScript — GPTBot, ClaudeBot, PerplexityBot, CCBot, dataset builders,
 * social unfurls — therefore learns nothing specific about any of our 236 pages.
 *
 * The old objection is answered rather than ignored: titles are derived from
 * App.jsx's OWN exported data (SEO_SOURCE) using the SAME formulas the runtime
 * components use, so the static value equals the rendered value instead of being a
 * guess. Any route this script cannot derive with certainty keeps the generic
 * fallback — never a worse guess — and is reported in the build output so the
 * coverage gap stays visible rather than silent.
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync, rmSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { build as esbuild } from 'esbuild';
import { createElement } from 'react';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const dist = join(root, 'dist');
const ORIGIN = 'https://www.thehomestarservice.com';
const SUFFIX = ' | HomeStar Services & Contracting';

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

/* ── Load the app's own SEO data ──────────────────────────────────────────────
   App.jsx imports only React hooks and has no top-level side effects, so bundling
   it for Node and importing it is safe: the data consts evaluate, the components
   are merely defined. This is what keeps static and runtime metadata identical. */
const tmp = join(root, 'node_modules', '.cache-seo-source.mjs');
let SEO = null;
let AppComponent = null;
const prerenderErrors = [];
try {
  await esbuild({
    entryPoints: [join(root, 'src', 'App.jsx')],
    bundle: true, format: 'esm', platform: 'node',
    // Vite uses the automatic JSX runtime, so App.jsx never imports React itself.
    // Matching that here avoids emitting bare React.createElement calls, which would
    // throw "React is not defined" the moment the module is imported.
    jsx: 'automatic',
    external: ['react', 'react-dom', 'react/jsx-runtime'],
    outfile: tmp, logLevel: 'silent',
  });
  const mod = await import(pathToFileURL(tmp).href);
  SEO = mod.SEO_SOURCE;
  AppComponent = mod.default;
} catch (err) {
  console.warn(`[route-heads] could not load SEO source (${err.message}). Falling back to canonical-only injection.`);
} finally {
  try { rmSync(tmp, { force: true }); } catch {}
}

/* ── Body prerender (SSG) ─────────────────────────────────────────────────────
   The head fix above told crawlers what each page IS. This tells them what each
   page SAYS. Without it the served HTML is a ~4KB shell with an empty
   <div id="root">, so anything that does not execute JavaScript — GPTBot,
   ClaudeBot, PerplexityBot, CCBot, dataset builders — sees no body copy, no FAQ
   answers and, critically, none of the JSON-LD, because every schema block on
   this site is injected by React at runtime rather than sitting in the template.

   This is only possible because resolveRoute() in App.jsx is now pure and
   synchronous. renderToString never runs effects, so while routing lived in a
   useEffect every route would have prerendered as the homepage.

   The client still mounts with createRoot, not hydrateRoot. That is deliberate:
   React discards the prerendered markup and re-renders, which costs a little work
   on first paint but makes a hydration mismatch structurally impossible on a
   6,000-line component tree. Crawlers read the static HTML; users get the same
   app they had before. */
let renderToString = null;
try {
  ({ renderToString } = await import('react-dom/server'));
} catch (err) {
  console.warn(`[route-heads] react-dom/server unavailable (${err.message}); shipping head-only HTML.`);
}

const ROOT_DIV = /<div id="root"><\/div>/;

function prerenderBody(routePath) {
  if (!renderToString || !AppComponent) return null;
  try {
    const markup = renderToString(createElement(AppComponent, { ssrPath: routePath }));
    // A near-empty render means the route resolved to nothing useful; better to ship
    // the shell than to bake in a wrong page.
    if (!markup || markup.length < 2000) return null;
    return markup;
  } catch (err) {
    prerenderErrors.push(`${routePath}: ${err.message}`);
    return null;
  }
}

/* ── Literal-title routes ─────────────────────────────────────────────────────
   A handful of pages (the calculators, the client portal, the designer page) set a
   hardcoded title and description inside their component rather than deriving them
   from data. Rather than copy those strings into this file — which would silently
   drift the moment someone edits the component — read them back out of App.jsx on
   every build. The pattern is: useCanonical("<slug>") followed by a literal
   document.title= and a literal setAttribute("content", …). Anything computed from
   a variable or template simply will not match, so this only ever picks up the
   genuinely static ones. */
const LITERAL_META = (() => {
  const out = {};
  try {
    const src = readFileSync(join(root, 'src', 'App.jsx'), 'utf8');
    const re = /useCanonical\(\s*"([^"]+)"\s*\)/g;
    let m;
    while ((m = re.exec(src))) {
      const slug = m[1];
      const win = src.slice(m.index, m.index + 2500);
      const t = win.match(/document\.title\s*=\s*"((?:[^"\\]|\\.)*)"/);
      const d = win.match(/setAttribute\(\s*"content"\s*,\s*"((?:[^"\\]|\\.)*)"\s*\)/);
      if (t && d) out[slug] = { title: JSON.parse(`"${t[1]}"`), description: JSON.parse(`"${d[1]}"`) };
    }
  } catch { /* leave empty — those routes keep the generic fallback */ }
  return out;
})();

/* ── Route -> {title, description} ────────────────────────────────────────────
   Each branch mirrors the formula in the corresponding App.jsx component. Keep
   them in step; a mismatch here ships a title that disagrees with the page. */
function metaFor(clean) {
  if (LITERAL_META[clean]) return LITERAL_META[clean];
  if (!SEO) return null;
  const { PROJECTS, BLOG, GUIDES, CITIES, SERVICE_PAGES, AUTHORS, NEIGHBORHOODS, SERVICE_SLUG_MAP, SVC_CITY_TPL, SERVICE_CITY_ALIASES, HOOD_SVCS } = SEO;
  const seg = clean.split('/');

  // /projects/<slug>  — App.jsx ProjectPage
  if (seg[0] === 'projects' && seg[1]) {
    const p = (PROJECTS || []).find((x) => x.slug === seg[1]);
    if (p) return { title: p.title + SUFFIX, description: `${p.desc} Schluter Pro Certified. Free estimates. (317) 279-4798` };
  }
  // /blog/<slug>  — App.jsx BlogPost
  if (seg[0] === 'blog' && seg[1]) {
    const post = (BLOG || []).find((x) => x.slug === seg[1]);
    if (post) return { title: post.title + SUFFIX, description: post.excerpt };
  }
  // /guide/<slug>  — App.jsx GuidePage
  if (seg[0] === 'guide' && seg[1]) {
    const g = (GUIDES || {})[seg[1]];
    if (g) return { title: g.title + SUFFIX, description: g.metaDesc };
  }
  // /about/<slug>  — App.jsx AuthorPage
  if (seg[0] === 'about' && seg[1]) {
    const a = (AUTHORS || {})[seg[1]];
    if (a) return { title: `${a.name} — ${a.role}${SUFFIX}`, description: `${a.name}, ${a.role} of HomeStar Services & Contracting. Schluter Pro Certified home remodeling in Hamilton County, Indiana.` };
  }
  if (seg.length === 1) {
    // City hub  — App.jsx CityPage
    const city = (CITIES || {})[clean];
    if (city && city.title) return { title: city.title + SUFFIX, description: city.metaDesc };
    // Service pillar  — App.jsx ServicePage
    const svc = (SERVICE_PAGES || {})[clean];
    if (svc && svc.title) return { title: svc.title + SUFFIX, description: svc.metaDesc };
    // Neighborhood  — App.jsx NeighborhoodPage.
    // The route is not the NEIGHBORHOODS key: App.jsx:2428 builds it as
    // "remodeling-" + hoodKey + "-" + city(lowercased, spaces->dashes) + "-in".
    // Rebuild the same slug per entry and match on that.
    const hood = Object.entries(NEIGHBORHOODS || {}).find(
      ([k, h]) => `remodeling-${k}-${String(h.city).toLowerCase().replace(/ /g, '-')}-in` === clean
    )?.[1];
    if (hood) return { title: `Home Remodeling in ${hood.name}, ${hood.city}, IN${SUFFIX}`, description: `Expert home remodeling in ${hood.name}, ${hood.city}, Indiana. ${String(hood.character).split('.')[0]}. Schluter Pro Certified. Free estimates. (317) 279-4798` };
    // Neighborhood x service  — App.jsx HoodServicePage (line ~5704).
    // Slug is `${svc.slug}-${hoodKey}-${city}-in`. NOTE the title suffix here is the
    // short " | HomeStar", not the full company suffix — matching the component exactly.
    for (const svc of HOOD_SVCS || []) {
      if (!clean.startsWith(svc.slug + '-')) continue;
      const hit = Object.entries(NEIGHBORHOODS || {}).find(
        ([k, h]) => `${svc.slug}-${k}-${String(h.city).toLowerCase().replace(/ /g, '-')}-in` === clean
      );
      if (hit) {
        const h = hit[1];
        return {
          title: `${svc.name} in ${h.name}, ${h.city}, IN | HomeStar`,
          description: `Expert ${svc.name.toLowerCase()} in ${h.name}, ${h.city}, Indiana. Schluter Pro Certified. Licensed plumbers & electricians. 25-year warranty. Free estimates. (317) 279-4798`,
        };
      }
    }

    // Service x city  — App.jsx ServiceCityPage.
    // Mirrors the routing at App.jsx:5907 exactly: the alias gives {s,c}; svcData and
    // cityData key off those directly, and svcKey is the SERVICE_SLUG_MAP key whose
    // VALUE matches alias.s (the map is key->value, not route->pair).
    const m = (SERVICE_CITY_ALIASES || {})[clean];
    if (m) {
      const svcData = (SERVICE_PAGES || {})[m.s];
      const cityData = (CITIES || {})[m.c];
      const svcKey = Object.keys(SERVICE_SLUG_MAP || {}).find((k) => SERVICE_SLUG_MAP[k] === m.s) || m.s;
      const tpl = (SVC_CITY_TPL || {})[svcKey] || (SVC_CITY_TPL || {})['bathroom-remodeling'];
      if (svcData && cityData && tpl && svcData.highlights && svcData.highlights[0]) {
        const pageTitle = `${svcData.service} in ${cityData.city}, IN`;
        return { title: pageTitle + SUFFIX, description: `${tpl.adj} ${svcData.service.toLowerCase()} in ${cityData.city}, Indiana. ${String(svcData.highlights[0].desc).split('.')[0]}. Free estimates. (317) 279-4798` };
      }
    }
  }
  return null;
}

const escapeAttr = (s) => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;');

/* Every replacement below is passed as a FUNCTION, never as a template string.
   String.replace() interprets $1, $&, $` , $' and $$ inside a replacement string
   as substitution patterns. Our descriptions are full of prices — "$15,000",
   "$100,000" — so a literal `$1` in the content was consuming capture group 1 and
   splicing the matched `<meta name="description" content=` back into the middle of
   the description. Returning from a function disables that expansion entirely.
   Do not convert these back to string replacements. */
const attrSub = (value) => (_m, open) => `${open}"${escapeAttr(value)}"`;
const escapeText = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

let written = 0;
let skipped = 0;
let withMeta = 0;
let prerendered = 0;
const noMeta = [];

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

  // CRITICAL: never write a canonical into the root dist/index.html.
  //
  // vercel.json rewrites /(.*) -> /index.html, so that one file is also the fallback
  // served for every URL that has no static file — i.e. every unknown/legacy/junk URL.
  // Baking a homepage canonical into it would make each of those URLs declare itself a
  // duplicate of the homepage, which is exactly the bug removed from index.html in July
  // 2026 (it caused 32 "Alternate page with proper canonical" failures).
  if (!clean) {
    skipped++;
    continue;
  }

  const canonical = `${ORIGIN}/${clean}`;

  // Files already emitted by the build (e.g. privacy-policy.html) must not be clobbered.
  if (clean.includes('.')) {
    skipped++;
    continue;
  }

  let html = template.replace(
    /<title>/i,
    () => `<link rel="canonical" href="${escapeAttr(canonical)}" />\n    <title>`
  );

  html = html.replace(
    /(<meta\s+property=["']og:url["']\s+content=)["'][^"']*["']/i,
    attrSub(canonical)
  );

  const meta = metaFor(clean);
  if (meta && meta.title && meta.description) {
    html = html.replace(/<title>[\s\S]*?<\/title>/i, () => `<title>${escapeText(meta.title)}</title>`);
    html = html.replace(
      /(<meta\s+name=["']description["']\s+content=)["'][^"']*["']/i,
      attrSub(meta.description)
    );
    html = html.replace(
      /(<meta\s+property=["']og:title["']\s+content=)["'][^"']*["']/i,
      attrSub(meta.title)
    );
    html = html.replace(
      /(<meta\s+property=["']og:description["']\s+content=)["'][^"']*["']/i,
      attrSub(meta.description)
    );
    html = html.replace(
      /(<meta\s+name=["']twitter:title["']\s+content=)["'][^"']*["']/i,
      attrSub(meta.title)
    );
    html = html.replace(
      /(<meta\s+name=["']twitter:description["']\s+content=)["'][^"']*["']/i,
      attrSub(meta.description)
    );
    withMeta++;
  } else {
    noMeta.push(clean);
  }

  const body = prerenderBody('/' + clean);
  if (body) {
    // Only the root div is replaced; the head work above is untouched.
    html = html.replace(ROOT_DIV, () => `<div id="root">${body}</div>`);
    prerendered++;
  }

  const outPath = join(dist, clean, 'index.html');
  mkdirSync(dirname(outPath), { recursive: true });
  writeFileSync(outPath, html, 'utf8');
  written++;
}

/* ── Homepage body ────────────────────────────────────────────────────────────
   The loop above deliberately skips the root file, so without this the single most
   important page on the site would be the only one still shipping an empty shell.

   The long-standing rule this respects is specifically about the CANONICAL tag:
   vercel.json rewrites unknown URLs to dist/index.html, so a canonical baked in
   here would make every junk URL declare itself a homepage duplicate. That rule is
   untouched — we inject body markup only, and assert below that no canonical
   appears.

   Injecting the body is safe for the same reason the canonical is not: an unknown
   URL already renders homepage content once JS runs, because resolveRoute() finds
   no match and falls through to the homepage. Prerendering it changes what a
   non-rendering crawler sees to match what a rendering one already saw. */
try {
  const homeBody = prerenderBody('/');
  if (homeBody) {
    let homeHtml = readFileSync(indexPath, 'utf8');
    if (ROOT_DIV.test(homeHtml)) {
      homeHtml = homeHtml.replace(ROOT_DIV, () => `<div id="root">${homeBody}</div>`);
      if (/<link[^>]+rel=["']canonical["']/i.test(homeHtml)) {
        console.error('[route-heads] refusing to write dist/index.html: prerendered body introduced a canonical.');
      } else {
        writeFileSync(indexPath, homeHtml, 'utf8');
        console.log('[route-heads] prerendered the homepage body into dist/index.html (canonical-free, as required).');
      }
    }
  } else {
    console.warn('[route-heads] homepage body prerender produced nothing; index.html left as a shell.');
  }
} catch (err) {
  console.warn(`[route-heads] homepage prerender skipped (${err.message}).`);
}

console.log(`[route-heads] wrote ${written} per-route HTML files (${skipped} skipped) from ${locs.length} sitemap URLs.`);
console.log(`[route-heads] per-route title+description: ${withMeta}/${written} routes.`);
console.log(`[route-heads] prerendered body HTML: ${prerendered}/${written} routes.`);
if (prerenderErrors.length) console.warn(`[route-heads] prerender failed on ${prerenderErrors.length}: ${prerenderErrors.slice(0,5).join(" | ")}`);
if (noMeta.length) {
  // Not a failure: these keep the generic fallback, which is exactly the old behaviour.
  // Logged so the gap stays visible instead of silently persisting.
  console.log(`[route-heads] generic fallback still used on ${noMeta.length}: ${noMeta.slice(0, 12).join(', ')}${noMeta.length > 12 ? ` … +${noMeta.length - 12} more` : ''}`);
}
