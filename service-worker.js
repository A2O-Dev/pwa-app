importScripts('js/sw-utils.js');

const CACHE_VERSION = 'v0.0.2';

const STATIC_CACHE = `static-${CACHE_VERSION}`;
const DYNAMIC_CACHE = `dynamic-${CACHE_VERSION}`;
const IMMUTABLE_CACHE = `immutable-${CACHE_VERSION}`;

const APP_SHELL = [
  '/',
  'index.html',
  'css/styles.css',
  'img/favicon.ico',
  'js/app.js',
  'js/sw-utils.js',
  'manifest.json',
  'img/icons/icon-144x144.png',
];

const APP_SHELL_IMMUTABLE = [
  'https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css',
  'https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js',
  'js/libs/jquery.js',
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

  self.skipWaiting();
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

        if (key !== IMMUTABLE_CACHE && key.includes('immutable')) {
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
        fetch(e.request)
          .then(updatedResponse => {
            caches.keys()
              .then(keys => {
                keys.forEach(key => {
                  caches.open(key)
                    .then(cache => cache.match(e.request))
                    .then(cacheMatch => {
                      if (!!cacheMatch) {
                        updateCache(key, e.request, updatedResponse)
                      }
                    })
                });
              })
          })
        return res;
      } else {
        return fetch(e.request)
          .then(newRes => {
            return updateCache(DYNAMIC_CACHE, e.request, newRes);
          });
      }
    });

  e.respondWith(response);
});
