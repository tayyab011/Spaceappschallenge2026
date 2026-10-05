#!/usr/bin/env node
// Downloads the image for each object in data/objects.geojson that has an "image_source_url".
//   node scripts/fetch-object-images.mjs          download missing images
//   node scripts/fetch-object-images.mjs --force  download again
// Saves to public/<image> (for example public/assets/objects/apollo-11-descent-stage.jpg).
// Run it on a machine with internet access. A failed URL is reported and skipped; open that
// object's source page, find the right image link, and fix "image_source_url".
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const force = process.argv.includes('--force');
const fc = JSON.parse(readFileSync(resolve(root, 'data/objects.geojson'), 'utf8'));

let ok = 0, skipped = 0, failed = 0;
for (const { properties: p } of fc.features) {
  if (!p.image_source_url || !p.image) continue;
  const dest = resolve(root, 'public', p.image.replace(/^\/+/, ''));
  if (existsSync(dest) && !force) { skipped++; continue; }
  try {
    const res = await fetch(p.image_source_url, { redirect: 'follow' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const type = res.headers.get('content-type') || '';
    if (!type.startsWith('image/')) throw new Error(`not an image (${type})`);
    mkdirSync(dirname(dest), { recursive: true });
    writeFileSync(dest, Buffer.from(await res.arrayBuffer()));
    console.log('ok     ', p.id);
    ok++;
  } catch (e) {
    console.error('FAILED ', p.id, p.image_source_url, '-', e.message);
    failed++;
  }
}
console.log(`\n${ok} downloaded, ${skipped} already present, ${failed} failed.`);
if (failed) process.exit(1);
console.log('Now run: npm run validate');
