// Картинки страниц кэшируются навсегда, но под номером набора (i=...): сменился набор — скачались заново. Остальное всегда берётся свежим.
const IMG = 'img-' + (new URL(self.location).searchParams.get('i') || '1');
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (e) => e.waitUntil(
  caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== IMG && k !== 'app').map((k) => caches.delete(k)))).then(() => clients.claim())
));
self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;
  const isImg = /\.jpg$/.test(new URL(e.request.url).pathname);
  if (isImg) {
    e.respondWith(caches.open(IMG).then((c) => c.match(e.request).then((r) => r || fetch(e.request).then((res) => { if (res.ok) c.put(e.request, res.clone()); return res; }))));
    return;
  }
  e.respondWith(fetch(e.request, { cache: 'no-store' }).then((res) => { if (res.ok) { const cp = res.clone(); caches.open('app').then((c) => c.put(e.request, cp)); } return res; })
    .catch(() => caches.match(e.request)));
});
