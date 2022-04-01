importScripts('js/sw-utils.js');

const STATIC_CACHE = 'static-v1';
const DYNAMIC_CACHE = 'dynamic-v1';
const IMMUTABLE_CACHE = 'inmutable-v1';

const APP_SHELL = [
  '/',
  'index.html',
  'css/styles.css',
  'img/favicon.ico',
  'js/app.js',
  'js/sw-utils.js',
  'manifest.json',
];

const APP_SHELL_IMMUTABLE = [
  'https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css',
  'https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js',
  'https://use.fontawesome.com/releases/v5.3.1/css/all.css',
  'https://use.fontawesome.com/releases/v5.3.1/webfonts/fa-solid-900.woff2',
];

self.addEventListener('install', e => {
  const cacheStatic = caches.open(STATIC_CACHE)
    .then(cache => cache.addAll(APP_SHELL));

  const cacheImmutable = caches.open(IMMUTABLE_CACHE)
    .then(cache => cache.addAll(APP_SHELL_IMMUTABLE));

  e.waitUntil(Promise.all([
    cacheStatic,
    cacheImmutable
  ]));
});

self.addEventListener('activate', e => {
  const response = caches.keys()
    .then(keys => {
      keys.forEach(key => {
        if (key !== STATIC_CACHE && key.includes('static')) {
          return caches.delete(key);
        }

        if (key !== DYNAMIC_CACHE && key.includes('dynamic')) {
          return caches.delete(key);
        }
      });
    });

  e.waitUntil(response);
});

self.addEventListener('fetch', e => {

  const response = caches.match(e.request)
    .then((res) => {
      if (res) {
        return res;
      } else {
        return fetch(e.request)
          .then(newRes => {
            return updateDynamicCache(DYNAMIC_CACHE, e.request, newRes);
          });
      }
    });

  e.respondWith(response);
});
