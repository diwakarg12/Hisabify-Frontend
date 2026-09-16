const CACHE_NAME = 'hisabify-v2';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/logo-dark.png',
  '/logo-light.png',
  '/logo-horizontal.svg',
  '/logo-stacked.svg',
  '/logo-reversed.svg',
  '/apple-touch-icon.png'
];

// Install Event - Pre-cache core shell assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS))
  );
  self.skipWaiting();
});

// Activate Event - Clean up stale cache versions
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch Event - Serve static assets from cache; network-first for API requests
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);

  // Exclude cross-origin API requests and backend endpoints from static caching
  if (
    url.origin !== self.location.origin ||
    url.pathname.startsWith('/auth') ||
    url.pathname.startsWith('/expense') ||
    url.pathname.startsWith('/group') ||
    url.pathname.startsWith('/invite') ||
    url.pathname.startsWith('/notification') ||
    url.pathname.startsWith('/message') ||
    url.pathname.startsWith('/profile') ||
    event.request.headers.has('authorization')
  ) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        // Return cached asset and update cache in background (Stale-While-Revalidate)
        fetch(event.request)
          .then((networkResponse) => {
            if (networkResponse && networkResponse.status === 200) {
              const responseToCache = networkResponse.clone();
              caches.open(CACHE_NAME).then((cache) => cache.put(event.request, responseToCache));
            }
          })
          .catch(() => {});
        return cachedResponse;
      }

      return fetch(event.request).catch(() => {
        // Fallback for document navigation when offline
        if (event.request.mode === 'navigate') {
          return caches.match('/index.html');
        }
      });
    })
  );
});

