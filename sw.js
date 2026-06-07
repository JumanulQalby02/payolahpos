const CACHE_NAME = 'payolah-pwa-v2';
  const urlsToCache = ['/index.html', '/manifest.json', '/192.jpg', '/512.jpg'];

  self.addEventListener('install', event => {
    event.waitUntil(
      caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
    );
    self.skipWaiting();
  });

  self.addEventListener('activate', event => {
    event.waitUntil(
      caches.keys().then(keys =>
        Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
      )
    );
    self.clients.claim();
  });

  self.addEventListener('fetch', event => {
    // Jangan ganggu request lintas-origin ke GAS — biarkan lewat apa adanya.
    if (event.request.url.indexOf(self.location.origin) !== 0) return;
    event.respondWith(
      caches.match(event.request).then(r => r || fetch(event.request))
    );
  });
