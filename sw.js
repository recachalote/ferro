/* Ferro — service worker (offline) */
const CACHE = 'ferro-v2';
const ASSETS = [
  './',
  'index.html',
  'manifest.webmanifest',
  'css/app.css',
  'icons/icon-180.png',
  'icons/icon-192.png',
  'icons/icon-512.png',
  'icons/icon.svg',
  'js/core/util.js',
  'js/core/calc.js',
  'js/core/store.js',
  'js/core/charts.js',
  'js/core/timer.js',
  'js/core/ui.js',
  'js/data/exercises.js',
  'js/data/programs.js',
  'js/views/home.js',
  'js/views/workout.js',
  'js/views/routines.js',
  'js/views/history.js',
  'js/views/progress.js',
  'js/views/body.js',
  'js/views/exercises.js',
  'js/views/tools.js',
  'js/views/achievements.js',
  'js/views/settings.js',
  'js/app.js'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE)
      .then((cache) => cache.addAll(ASSETS).catch(() => {}))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;

  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req)
        .then((res) => {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put('index.html', copy)).catch(() => {});
          return res;
        })
        .catch(() => caches.match('index.html'))
    );
    return;
  }

  event.respondWith(
    caches.match(req).then((hit) => {
      if (hit) return hit;
      return fetch(req).then((res) => {
        if (res && res.ok) {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put(req, copy)).catch(() => {});
        }
        return res;
      });
    })
  );
});

self.addEventListener('message', (event) => {
  if (event.data === 'skipWaiting') self.skipWaiting();
});
