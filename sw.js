/* Simple PWA Service Worker for offline-first static site */

const CACHE_NAME = 'kp-resume-v11';
const PRECACHE_URLS = [
  '/',
  '/index.html',
  '/developer-vietnam.html',
  '/developer-hcm.html',
  '/manifest.json',
  '/ab_files/main.css',
  '/ab_files/fonts.css',
  '/ab_files/projects.css',
  '/ab_files/feedback.css',
  '/ab_files/js/pwa.js',
  '/ab_files/KP-avatar.png',
  '/ab_files/favicon-192x192.png',
  '/ab_files/khoapham-144.png',
  '/ab_files/khoapham-192.png',
  '/ab_files/khoapham-512.png',
  
  // Site images
  '/ab_files/images/sites/fuelcloud.png',
  '/ab_files/images/sites/businesssales.jpg',
  '/ab_files/images/sites/konnect.jpg',
  '/ab_files/images/sites/natureeye.jpg',
  '/ab_files/images/sites/raksul.png',
  '/ab_files/images/sites/transportme.png',
  
  // User images
  '/ab_files/images/users/AnhTran.jpeg',
  '/ab_files/images/users/DucVu.png',
  '/ab_files/images/users/Henry.jpeg',
  '/ab_files/images/users/Keiran.png',
  '/ab_files/images/users/KOJI.jpeg'
];

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE_URLS))
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.map((key) => (key !== CACHE_NAME ? caches.delete(key) : undefined)))
    ).then(() => self.clients.claim())
  );
});

// Strategy: cache-first for same-origin static assets; network-first for HTML navigations
self.addEventListener('fetch', (event) => {
  const { request } = event;

  // Handle navigation requests (HTML pages)
  if (request.mode === 'navigate' || (request.method === 'GET' && request.headers.get('accept') && request.headers.get('accept').includes('text/html'))) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
          return response;
        })
        .catch(() => caches.match(request).then((res) => res || caches.match('/index.html')))
    );
    return;
  }

  // Special network-first handling for frequently updated JS modules
  const url = new URL(request.url);
  if (url.origin === self.location.origin && (url.pathname === '/ab_files/js/clients-feedback.js' || url.pathname === '/ab_files/js/projects-grid.js')) {
    event.respondWith(
      fetch(request, { cache: 'reload' })
        .then((response) => {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
          return response;
        })
        .catch(() => caches.match(request))
    );
    return;
  }

  // Only handle same-origin requests for static assets
  if (url.origin === self.location.origin) {
    event.respondWith(
      caches.match(request).then((cached) => {
        if (cached) return cached;
        return fetch(request)
          .then((response) => {
            const copy = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
            return response;
          })
          .catch(() => cached);
      })
    );
  }
});
