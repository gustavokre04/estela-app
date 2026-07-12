/* Service worker de Estela — cachea la app para uso offline.
   Los datos de Garmin (fetch a tu backend) NUNCA se cachean: siempre van a la red. */
const CACHE = 'estela-v20';
const ASSETS = [
  './',
  './index.html',
  './manifest.webmanifest',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/apple-touch-icon.png'
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;                 // no tocar POST, etc.
  const url = new URL(req.url);
  if (url.origin !== location.origin) return;       // fuentes/backend externo: red directa
  if (url.pathname.endsWith('garmin_data.json')) return;  // datos de Garmin: siempre frescos, sin caché

  // App propia: cache-first, con actualización en segundo plano
  e.respondWith(
    caches.match(req).then(cached => {
      const network = fetch(req).then(res => {
        if (res && res.status === 200) {
          const copy = res.clone();
          caches.open(CACHE).then(c => c.put(req, copy));
        }
        return res;
      }).catch(() => cached || caches.match('./index.html'));
      return cached || network;
    })
  );
});
