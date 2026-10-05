import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { validate } from './validate-objects.mjs';

const pub = mkdtempSync(join(tmpdir(), 'pub-'));
mkdirSync(join(pub, 'assets/objects'), { recursive: true });
writeFileSync(join(pub, 'assets/objects/ok.jpg'), 'x');

// TEST FIXTURE ONLY. These values are placeholders for the test and are never shipped.
const good = () => ({
  type: 'Feature',
  geometry: { type: 'Point', coordinates: [10, 20] },
  properties: {
    id: 'test-object', name: 'Test', mission: 'Test mission', agency: 'Test agency', body: 'moon',
    lat: 20, lon: 10, left_behind: 2000, last_contact: 'test', why_left: 'test', science_enabled: 'test',
    image: '/assets/objects/ok.jpg', image_credit: 'test', source_url: 'https://example.org/x',
    dataset_id: 'TEST-1', verified: true,
  },
});
const fc = (...features) => ({ type: 'FeatureCollection', features });
const run = (...f) => validate(fc(...f), { publicDir: pub });
const withProps = (patch, geometry) => { const f = good(); Object.assign(f.properties, patch); if (geometry !== undefined) f.geometry = geometry; return f; };

test('a complete verified feature passes', () => assert.deepEqual(run(good()), []));
test('missing required field fails', () => { const f = good(); delete f.properties.why_left; assert.match(run(f).join('\n'), /missing required field "why_left"/); });
test('verified without source_url fails', () => assert.match(run(withProps({ source_url: null })).join('\n'), /requires "source_url"/));
test('verified without dataset_id fails', () => assert.match(run(withProps({ dataset_id: '' })).join('\n'), /requires "dataset_id"/));
test('lat out of range fails', () => assert.match(run(withProps({ lat: 91 }, { type: 'Point', coordinates: [10, 91] })).join('\n'), /lat out of range/));
test('lon out of range fails', () => assert.match(run(withProps({ lon: 181 }, { type: 'Point', coordinates: [181, 20] })).join('\n'), /lon out of range/));
test('missing image file fails', () => assert.match(run(withProps({ image: '/assets/objects/nope.jpg' })).join('\n'), /image file does not exist/));
test('hotlinked image fails', () => assert.match(run(withProps({ image: 'https://example.org/a.jpg' })).join('\n'), /local path/));
test('geometry mismatch fails', () => assert.match(run(withProps({}, { type: 'Point', coordinates: [1, 2] })).join('\n'), /does not match/));
test('verified needs geometry', () => assert.match(run(withProps({}, null)).join('\n'), /requires a Point geometry/));
test('duplicate id fails', () => assert.match(run(good(), good()).join('\n'), /duplicate id/));
test('unverified with null values passes if todo and hint exist', () => {
  const f = withProps({ verified: false, lat: null, lon: null, left_behind: null, last_contact: null, why_left: null, science_enabled: null, image: null, image_credit: null, source_url: null, dataset_id: null, todo: ['x'], source_hint: 'NSSDCA' }, null);
  assert.deepEqual(run(f), []);
});
test('unverified without todo fails', () => assert.match(run(withProps({ verified: false, source_hint: 'x' }, null)).join('\n'), /todo/));
