import test from 'node:test';
import assert from 'node:assert/strict';

const store = new Map();
globalThis.localStorage = {
  getItem: (k) => (store.has(k) ? store.get(k) : null),
  setItem: (k, v) => store.set(k, String(v)),
};
const warnings = [];
console.warn = (...a) => warnings.push(a.join(' '));

const { resolve, setLang, getLang } = await import('../src/i18n/core.ts');
const strings = (await import('../src/i18n/strings.json', { with: { type: 'json' } })).default;

test('english resolves without falling back', () => {
  const r = resolve('map.title', 'en');
  assert.equal(r.fellBack, false);
  assert.equal(r.text, strings.en['map.title']);
});
test('a translated bn key is used', () => {
  const r = resolve('map.moon', 'bn');
  assert.equal(r.fellBack, false);
  assert.equal(r.text, strings.bn['map.moon']);
});
test('a missing bn key falls back to English visibly and logs TODO_REVIEW once', () => {
  const key = 'map.whyLeft';
  assert.ok(!(key in strings.bn), 'fixture assumption: this key has no bn text');
  const r = resolve(key, 'bn');
  assert.equal(r.fellBack, true);
  assert.equal(r.text, strings.en[key]);
  resolve(key, 'bn');
  assert.equal(warnings.filter((w) => w.includes('TODO_REVIEW') && w.includes(key)).length, 1);
});
test('an empty bn string counts as missing', () => {
  strings.bn['test.empty'] = '  ';
  strings.en['test.empty'] = 'hello';
  assert.equal(resolve('test.empty', 'bn').fellBack, true);
});
test('a key missing everywhere returns the key and logs', () => {
  const r = resolve('nope.nothing', 'en');
  assert.equal(r.text, 'nope.nothing');
  assert.ok(warnings.some((w) => w.includes('nope.nothing')));
});
test('every bn key also exists in en', () => {
  for (const k of Object.keys(strings.bn)) if (k !== 'test.empty') assert.ok(k in strings.en, k);
});
test('language choice is stored in localStorage', () => {
  setLang('bn');
  assert.equal(getLang(), 'bn');
  assert.equal(store.get('abnf_lang'), 'bn');
  setLang('en');
  assert.equal(store.get('abnf_lang'), 'en');
});
