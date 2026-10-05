
import { readdirSync, readFileSync, writeFileSync, mkdirSync, existsSync, statSync } from 'node:fs';
import { resolve, join, extname, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const args = new Set(process.argv.slice(2));
const WRITE = args.has('--write');
const DOWNLOAD = WRITE || args.has('--download');
const outDir = join(root, 'public/assets/objects');

const IMG_EXT = new Set(['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg']);
const EMBED_HOSTS = ['sketchfab.com', 'youtube.com', 'youtube-nocookie.com', 'youtu.be', 'fonts.googleapis.com', 'fonts.gstatic.com'];
const IMAGE_HOSTS = ['images-assets.nasa.gov', 'assets.science.nasa.gov'];
function wikiFix(u) {
  const url = new URL(u);
  if (url.hostname !== 'upload.wikimedia.org') return u;
  const p = url.pathname.split('/');
  const name = p.includes('thumb') ? p[p.length - 2] : p[p.length - 1];
  return `https://commons.wikimedia.org/wiki/Special:FilePath/${name}?width=960`;
}
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

const files = [...walk(join(root, 'src')), join(root, 'index.html')];
const found = new Map(); 
for (const f of files) {
  const text = readFileSync(f, 'utf8');
  for (const m of text.matchAll(/https?:\/\/[^\s'"`)<>\\]+/g)) {
    const u = m[0].replace(/[.,;]+$/, '');
    if (u.includes('$')) continue;
    if (!isImageUrl(u)) continue;
    if (!found.has(u)) found.set(u, new Set());
    found.get(u).add(f.replace(root + '/', ''));
  }
}

function localName(u) {
  const url = new URL(u);
  const base = decodeURIComponent(url.pathname.split('/').pop() || 'image').replace(/\.[^.]+$/, '').replace(/[^a-zA-Z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 48) || 'image';
  const ext = (extname(url.pathname) || '.jpg').toLowerCase();
  return `${base}-${createHash('sha1').update(u).digest('hex').slice(0, 8)}${ext}`;
}

console.log(`${found.size} hosted image URL(s) in src/:`);
for (const [u, fs] of found) console.log(`  ${new URL(u).hostname}  ${localName(u)}  <- ${[...fs].join(', ')}`);
const nonNasa = [...found.keys()].filter((u) => !/nasa\.gov$/.test(new URL(u).hostname));
if (nonNasa.length) console.log(`\nCheck licence and credit before shipping these non-NASA-hosted images (${nonNasa.length}):\n  ` + nonNasa.map((u) => new URL(u).hostname + ' ' + u.slice(0, 90)).join('\n  '));

if (!DOWNLOAD) {
  console.log('\nDry run. Re-run with --download (and --write to rewrite src/).');
  process.exit(0);
}

mkdirSync(outDir, { recursive: true });
const manifestPath = join(outDir, 'manifest.json');
const manifest = existsSync(manifestPath) ? JSON.parse(readFileSync(manifestPath, 'utf8')) : {};
const ok = new Map();
for (const u of found.keys()) {
  const name = localName(u);
  const dest = join(outDir, name);
  try {
    if (!existsSync(dest)) {
         const res = await fetch(wikiFix(u), { redirect: 'follow' });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const type = res.headers.get('content-type') || '';
      if (!type.startsWith('image/')) throw new Error(`not an image (${type})`);
      writeFileSync(dest, Buffer.from(await res.arrayBuffer()));
    }
    ok.set(u, `/assets/objects/${name}`);
    manifest[u] = { file: `/assets/objects/${name}`, credit: manifest[u]?.credit ?? 'TODO: add credit line from the source page' };
    console.log('ok    ', name);
  } catch (e) {
    console.error('FAILED', u, '-', e.message);
  }
}
writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + '\n');
console.log(`\n${ok.size}/${found.size} downloaded. Manifest: public/assets/objects/manifest.json (fill in each credit).`);

if (WRITE) {
  let changed = 0;
  for (const f of files) {
    let text = readFileSync(f, 'utf8');
    const before = text;
    for (const [u, local] of ok) text = text.split(u).join(local);
    if (text !== before) { writeFileSync(f, text); changed++; console.log('rewrote', f.replace(root + '/', '')); }
  }
  console.log(`${changed} file(s) rewritten. Review with git diff, then run npm run lint && npm run build.`);
}
if (ok.size !== found.size) process.exit(1);
