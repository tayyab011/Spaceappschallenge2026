
const VERSION = '__VERSION__';
const SHELL = `starbound-shell-${VERSION}`;
const RUNTIME = 'starbound-runtime-v1';
const PRECACHE = __PRECACHE__;

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(SHELL).then((c) => Promise.all(PRECACHE.map((u) => c.add(new Request(u, { cache: 'reload' })).catch(() => {})))).then(() => self.skipWaiting()),
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k.startsWith('starbound-shell-') && k !== SHELL).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

const NEVER_CACHE = /(firestore|firebase|googleapis|identitytoolkit|securetoken|gstatic)\./;
const RUNTIME_PATH = /^\/(assets|models|tiles|images|maplibre)\//;

async function fromRuntimeCache(request) {
  const cache = await caches.open(RUNTIME);
  const hit = await cache.match(request, { ignoreVary: true });
  if (hit) return hit;
  const res = await fetch(request);
  if (res && (res.ok || res.type === 'opaque')) cache.put(request, res.clone()).catch(() => {});
  return res;
}

async function pmtilesRange(request) {
  const cache = await caches.open(RUNTIME);
  const key = new Request(request.url);
  let full = await cache.match(key);
  if (!full) {
    const res = await fetch(key);
    if (!res.ok) return res;
    await cache.put(key, res.clone());
    full = res;
  }
  const range = request.headers.get('range');
  if (!range) return full;
  const m = /^bytes=(\d*)-(\d*)$/.exec(range);
  if (!m) return full;
  const buf = await full.arrayBuffer();
  const size = buf.byteLength;
  let start = m[1] === '' ? size - Number(m[2]) : Number(m[1]);
  let end = m[1] === '' || m[2] === '' ? size - 1 : Math.min(Number(m[2]), size - 1);
  if (!(start >= 0 && start <= end)) return new Response(null, { status: 416, headers: { 'Content-Range': `bytes */${size}` } });
  return new Response(buf.slice(start, end + 1), {
    status: 206,
    headers: {
      'Content-Type': 'application/octet-stream',
      'Content-Range': `bytes ${start}-${end}/${size}`,
      'Content-Length': String(end - start + 1),
    },
  });
}

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (NEVER_CACHE.test(url.hostname)) return;

  const sameOrigin = url.origin === self.location.origin;

  if (sameOrigin && url.pathname.endsWith('.pmtiles')) {
    event.respondWith(pmtilesRange(req).catch(() => new Response('', { status: 504 })));
    return;
  }

  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req).catch(async () => (await caches.match('/index.html')) || (await caches.match('/')) || Response.error()),
    );
    return;
  }

  if (sameOrigin) {
    if (PRECACHE.includes(url.pathname)) {
      event.respondWith(caches.match(req).then((hit) => hit || fromRuntimeCache(req)));
      return;
    }
    if (RUNTIME_PATH.test(url.pathname)) {
      event.respondWith(fromRuntimeCache(req).catch(() => Response.error()));
      return;
    }
    return;
  }

  if (req.destination === 'image') {
    event.respondWith(fromRuntimeCache(req).catch(() => Response.error()));
  }
});
