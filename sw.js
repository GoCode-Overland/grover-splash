const CACHE_NAME = 'grover-v2';
const STATIC_ASSETS = [
  '/',
  '/main.css',
  '/main.js',
  '/fonts/PlantinInfantBold/font.woff2',
  '/img/grover-combomark-white.svg',
  '/img/hero-phone.jpg',
  '/img/favicon-32x32.png',
  '/img/favicon-16x16.png'
];

// ✅ INSTALL: Precache static assets only
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(STATIC_ASSETS))
      .then(() => self.skipWaiting())
  );
});

// ✅ ACTIVATE: Clean up old cache versions
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(name => {
          if (name !== CACHE_NAME) {
            return caches.delete(name);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// ✅ FETCH: Serve only listed assets from cache — ignore all others
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  // Only handle same-origin requests
  if (url.origin !== self.location.origin) return;

  // Only intercept requests that match our whitelist
  const isStaticAsset = STATIC_ASSETS.includes(url.pathname);
  if (!isStaticAsset) return; // Let the browser fetch it normally

  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
      .catch(() => caches.match('/'))
  );
});
