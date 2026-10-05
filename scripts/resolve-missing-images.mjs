#!/usr/bin/env node
// Finds REAL images for hosted URLs that could not be downloaded, using the NASA Image Library
// API and the Wikimedia Commons API, and saves them where localize-assets.mjs expects them.
//
//   node scripts/resolve-missing-images.mjs
//   node scripts/localize-assets.mjs --write        <- run this afterwards to rewrite src/
//
// Needs internet. It prints the picture it matched for every URL: LOOK at each one.
// Anything it cannot match confidently is skipped (delete that image or add it by hand).
import { readdirSync, readFileSync, writeFileSync, mkdirSync, existsSync, statSync } from 'node:fs';
import { resolve, join, extname, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const outDir = join(root, 'public/assets/objects');
const UA = 'StarBound-SpaceApps/1.0 (student project; contact: ashriamahmud46@gmail.com)';
const headers = { 'User-Agent': UA, Accept: 'application/json,image/*' };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// ---- same URL discovery and naming as localize-assets.mjs (keep in sync) ----
const IMG_EXT = new Set(['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg']);
const EMBED_HOSTS = ['sketchfab.com', 'youtube.com', 'youtube-nocookie.com', 'youtu.be', 'fonts.googleapis.com', 'fonts.gstatic.com'];
const IMAGE_HOSTS = ['images-assets.nasa.gov', 'assets.science.nasa.gov'];
function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (/\.(tsx?|css|html)$/.test(name)) out.push(p);
  }
  return out;
}
function isImageUrl(u) {
  let url;
  try { url = new URL(u); } catch { return false; }
  if (EMBED_HOSTS.some((h) => url.hostname === h || url.hostname.endsWith('.' + h))) return false;
  if (url.pathname.includes('/embed')) return false;
  return IMG_EXT.has(extname(url.pathname).toLowerCase()) || IMAGE_HOSTS.includes(url.hostname);
}
function localName(u) {
  const url = new URL(u);
  const base = decodeURIComponent(url.pathname.split('/').pop() || 'image').replace(/\.[^.]+$/, '').replace(/[^a-zA-Z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 48) || 'image';
  const ext = (extname(url.pathname) || '.jpg').toLowerCase();
  return `${base}-${createHash('sha1').update(u).digest('hex').slice(0, 8)}${ext}`;
}

// ---- helpers (exported for tests) ----
export function wikiNameFromUrl(u) {
  const p = new URL(u).pathname.split('/');
  const file = p.includes('thumb') ? p[p.length - 2] : p[p.length - 1];
  return decodeURIComponent(file).replace(/\.[^.]+$/, '').replace(/_/g, ' ').trim();
}
export function words(s) {
  return s.toLowerCase().replace(/[^a-z0-9 ]+/g, ' ').split(/\s+/).filter((w) => w.length > 1 && !/^\d+px$/.test(w));
}
export function overlap(query, title) {
  const q = words(query);
  const t = new Set(words(title));
  if (q.length === 0) return 0;
  return q.filter((w) => t.has(w)).length / q.length;
}
const stripHtml = (s = '') => s.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();

async function getJson(url) {
  for (let i = 0; i < 4; i++) {
    const res = await fetch(url, { headers, redirect: 'follow' });
    if (res.status === 429) { await sleep(5000 * (i + 1)); continue; }
    if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
    return res.json();
  }
  throw new Error(`rate limited: ${url}`);
}
async function getImage(url) {
  for (let i = 0; i < 4; i++) {
    const res = await fetch(url, { headers: { 'User-Agent': UA }, redirect: 'follow' });
    if (res.status === 429) { await sleep(5000 * (i + 1)); continue; }
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const type = res.headers.get('content-type') || '';
    if (!type.startsWith('image/')) throw new Error(`not an image (${type})`);
    return Buffer.from(await res.arrayBuffer());
  }
  throw new Error('rate limited');
}

// ---- NASA Image Library ----
async function resolveNasa(u, forcedId) {
  const m = new URL(u).pathname.match(/\/image\/([^/]+)\//);
  const nasaId = forcedId ?? m?.[1];
  if (!nasaId) throw new Error('cannot read NASA id from URL');
  let hrefs = [];
  try {
    const data = await getJson(`https://images-api.nasa.gov/asset/${encodeURIComponent(nasaId)}`);
    hrefs = (data.collection?.items ?? []).map((i) => i.href);
  } catch { /* fall through to search */ }
  let pick = ['~large.jpg', '~medium.jpg', '~orig.jpg', '~small.jpg'].map((s) => hrefs.find((h) => h.includes(s))).find(Boolean);
  let title = nasaId, credit = 'NASA';
  if (!pick) {
    const s = await getJson(`https://images-api.nasa.gov/search?q=${encodeURIComponent(nasaId)}&media_type=image`);
    const item = (s.collection?.items ?? []).find((i) => i.data?.[0]?.nasa_id === nasaId) ?? s.collection?.items?.[0];
    if (!item) throw new Error('no result in NASA Image Library');
    const d = item.data[0];
    title = d.title; credit = d.photographer || d.secondary_creator || d.center || 'NASA';
    pick = item.links?.[0]?.href;
  } else {
    try {
      const s = await getJson(`https://images-api.nasa.gov/search?nasa_id=${encodeURIComponent(nasaId)}`);
      const d = s.collection?.items?.[0]?.data?.[0];
      if (d) { title = d.title; credit = d.photographer || d.secondary_creator || d.center || 'NASA'; }
    } catch { /* title is optional */ }
  }
  if (!pick) throw new Error('no downloadable file listed');
  return { downloadUrl: pick.replace(/^http:/, 'https:'), matched: title, credit: `NASA (${credit})`, page: `https://images.nasa.gov/details/${nasaId}` };
}

// ---- Wikimedia Commons ----
async function commonsQuery(params) {
  const q = new URLSearchParams({ action: 'query', format: 'json', prop: 'imageinfo', iiprop: 'url|extmetadata', iiurlwidth: '960', ...params });
  const data = await getJson(`https://commons.wikimedia.org/w/api.php?${q}`);
  return Object.values(data.query?.pages ?? {}).filter((p) => p.imageinfo?.length);
}
async function resolveWiki(u) {
  const name = wikiNameFromUrl(u);
  // 1) exact file name, 2) search by the words in the name
  let pages = await commonsQuery({ titles: `File:${name.replace(/ /g, '_')}${extname(new URL(u).pathname)}` });
  let how = 'exact name';
  if (pages.length === 0) {
    pages = await commonsQuery({ generator: 'search', gsrsearch: name, gsrnamespace: '6', gsrlimit: '8' });
    how = 'search';
  }
  const scored = pages
    .map((p) => ({ p, score: overlap(name, p.title.replace(/^File:/, '')) }))
    .filter((x) => /^image\/(jpeg|png|gif|webp)/.test(x.p.imageinfo[0].mime ?? 'image/jpeg') || true)
    .sort((a, b) => b.score - a.score);
  const best = scored[0];
  if (!best || best.score < 0.6) throw new Error(`no confident match on Commons (best: ${best ? `"${best.p.title}" ${Math.round(best.score * 100)}%` : 'none'})`);
  const info = best.p.imageinfo[0];
  const md = info.extmetadata ?? {};
  const credit = `${stripHtml(md.Artist?.value) || 'Unknown author'}, ${stripHtml(md.LicenseShortName?.value) || 'licence: check page'} (Wikimedia Commons)`;
  return { downloadUrl: info.thumburl || info.url, matched: `${best.p.title} [${how}, ${Math.round(best.score * 100)}% match]`, credit, page: info.descriptionurl };
}

// Wikimedia names that do not exist on Commons, but whose NASA PIA number is in the file name or
// in the app's own captions. Resolved through the NASA Image Library instead.
const NASA_OVERRIDE = {
  Opportunity_blueberries: 'PIA05634',
  Jezero_delta_Perseverance_PIA25328: 'PIA25328',
  PIA02864_Pioneer_10_s_First_Direct_Look_at_Jupiter: 'PIA02864',
};
function overrideId(u) {
  const file = decodeURIComponent(new URL(u).pathname.split('/').filter(Boolean).slice(-1)[0]).replace(/\.[^.]+$/, '').replace(/^\d+px-/, '');
  return NASA_OVERRIDE[file];
}

// ---- main ----
async function main() {
  const files = [...walk(join(root, 'src')), join(root, 'index.html')];
  const urls = new Set();
  for (const f of files) {
    for (const m of readFileSync(f, 'utf8').matchAll(/https?:\/\/[^\s'"`)<>\\]+/g)) {
      const u = m[0].replace(/[.,;]+$/, '');
      if (!u.includes('$') && isImageUrl(u)) urls.add(u);
    }
  }
  mkdirSync(outDir, { recursive: true });
  const manifestPath = join(outDir, 'manifest.json');
  const manifest = existsSync(manifestPath) ? JSON.parse(readFileSync(manifestPath, 'utf8')) : {};
  let done = 0, skipped = 0, failed = 0;

  for (const u of urls) {
    const dest = join(outDir, localName(u));
    if (existsSync(dest)) continue;
    const host = new URL(u).hostname;
    try {
      let r;
      if (host === 'upload.wikimedia.org' && overrideId(u)) r = await resolveNasa(u, overrideId(u));
      else if (host === 'upload.wikimedia.org') r = await resolveWiki(u);
      else if (host === 'images-assets.nasa.gov') r = await resolveNasa(u);
      else { console.log(`SKIP   ${host}  ${u.slice(0, 70)}  (not NASA/Wikimedia: remove it or add the file by hand)`); skipped++; continue; }
      const buf = await getImage(r.downloadUrl);
      writeFileSync(dest, buf);
      manifest[u] = { file: `/assets/objects/${localName(u)}`, credit: r.credit, matched_title: r.matched, source_page: r.page };
      console.log(`OK     ${localName(u)}\n         matched: ${r.matched}\n         page:    ${r.page}`);
      done++;
    } catch (e) {
      console.error(`FAILED ${u.slice(0, 90)}\n         ${e.message}`);
      failed++;
    }
    await sleep(1500);
  }
  writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + '\n');
  console.log(`\n${done} downloaded, ${skipped} skipped, ${failed} failed.`);
  console.log('Open each "page:" link above and check the picture is the right one. Then run:');
  console.log('  node scripts/localize-assets.mjs --write');
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) await main();
