
import { readFileSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const REQUIRED_KEYS = [
  'id', 'name', 'mission', 'agency', 'body', 'lat', 'lon', 'left_behind',
  'last_contact', 'why_left', 'science_enabled', 'image', 'image_credit',
  'source_url', 'dataset_id', 'verified',
];
const VERIFIED_NON_NULL = [
  'agency', 'left_behind', 'last_contact', 'why_left', 'science_enabled',
  'image', 'image_credit', 'source_url', 'dataset_id',
];
// Keep in sync with ObjectBody in the TypeScript types.
const BODIES = ['moon', 'mars', 'solar system'];
const isBlank = (v) => v === null || v === undefined || (typeof v === 'string' && v.trim() === '');

export function validate(fc, { publicDir }) {
  const errors = [];
  const err = (id, msg) => errors.push(`${id}: ${msg}`);

  if (!fc || fc.type !== 'FeatureCollection' || !Array.isArray(fc.features)) {
    return ['file is not a GeoJSON FeatureCollection'];
  }
  const seen = new Set();

  fc.features.forEach((f, i) => {
    const p = f?.properties;
    const id = p?.id ?? `feature[${i}]`;
    if (f?.type !== 'Feature' || !p) return err(id, 'not a Feature with properties');

    for (const k of REQUIRED_KEYS) {
      if (!(k in p)) err(id, `missing required field "${k}"`);
    }
    if (typeof p.id !== 'string' || !/^[a-z0-9-]+$/.test(p.id)) err(id, 'id must be a lowercase slug');
    else if (seen.has(p.id)) err(id, 'duplicate id');
    else seen.add(p.id);
    if (isBlank(p.name)) err(id, 'name is empty');
    if (isBlank(p.mission)) err(id, 'mission is empty');
    if (!BODIES.includes(p.body)) err(id, `body must be one of: ${BODIES.join(', ')}`);
    if (typeof p.verified !== 'boolean') err(id, 'verified must be true or false');

    // coordinates
    const latSet = p.lat !== null && p.lat !== undefined;
    const lonSet = p.lon !== null && p.lon !== undefined;
    if (latSet !== lonSet) err(id, 'lat and lon must both be set or both be null');
    if (latSet && (typeof p.lat !== 'number' || !Number.isFinite(p.lat) || p.lat < -90 || p.lat > 90)) err(id, `lat out of range: ${p.lat}`);
    if (lonSet && (typeof p.lon !== 'number' || !Number.isFinite(p.lon) || p.lon < -180 || p.lon > 180)) err(id, `lon out of range: ${p.lon}`);

    if (p.left_behind !== null && p.left_behind !== undefined && !Number.isInteger(p.left_behind)) err(id, 'left_behind must be an integer year or null');
    if (p.story_id !== undefined && p.story_id !== null && typeof p.story_id !== 'string') err(id, 'story_id must be a string or null');
    if (!isBlank(p.source_url) && !/^https:\/\//.test(p.source_url)) err(id, 'source_url must be an https URL');

    // geometry
    const g = f.geometry;
    if (g !== null && g !== undefined) {
      if (g.type !== 'Point' || !Array.isArray(g.coordinates) || g.coordinates.length !== 2) err(id, 'geometry must be null or a Point [lon, lat]');
      else if (latSet && lonSet && (g.coordinates[0] !== p.lon || g.coordinates[1] !== p.lat)) err(id, 'geometry [lon, lat] does not match properties lon/lat');
    }

    // image file
    if (!isBlank(p.image)) {
      const rel = String(p.image).replace(/^\/+/, '');
      if (/^https?:/.test(p.image)) err(id, 'image must be a local path, not a URL');
      else if (!existsSync(resolve(publicDir, rel))) err(id, `image file does not exist: public/${rel}`);
    }

    if (p.verified === true) {
      for (const k of VERIFIED_NON_NULL) if (isBlank(p[k])) err(id, `verified:true requires "${k}"`);
      if (!latSet && !lonSet && !g) {
        // No single map point (e.g. destroyed in the air): allowed if the text says where it was last known.
        if (isBlank(p.last_known_location)) err(id, 'verified:true without coordinates requires "last_known_location"');
      } else {
        if (!latSet || !lonSet) err(id, 'verified:true requires numeric lat and lon');
        if (!g) err(id, 'verified:true requires a Point geometry [lon, lat]');
      }
    } else if (p.verified === false) {
      if (!Array.isArray(p.todo) || p.todo.length === 0) err(id, 'unverified features need a non-empty "todo" list');
      if (isBlank(p.source_hint)) err(id, 'unverified features need a "source_hint"');
    }
  });
  return errors;
}

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, '..');

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const file = resolve(root, 'data/objects.geojson');
  let fc;
  try {
    fc = JSON.parse(readFileSync(file, 'utf8'));
  } catch (e) {
    console.error(`validate-objects: cannot read ${file}: ${e.message}`);
    process.exit(1);
  }
  const errors = validate(fc, { publicDir: resolve(root, 'public') });
  const total = fc.features?.length ?? 0;
  const verified = (fc.features ?? []).filter((f) => f.properties?.verified === true).length;
  if (errors.length) {
    console.error(`validate-objects: ${errors.length} problem(s)`);
    for (const e of errors) console.error(`  - ${e}`);
    process.exit(1);
  }
  console.log(`validate-objects: OK (${total} objects, ${verified} verified, ${total - verified} unverified)`);
}
