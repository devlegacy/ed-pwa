import { c, log, error } from "./helpers/console";
importScripts(`${PUBLIC_PATH.pathname}assets-manifest.js`);
const CACHE_NAME = 'pwa-demo-edteam-cache-v1';

const urlsToCache = [
  `${PUBLIC_PATH.pathname}index.html`,
  `${PUBLIC_PATH.pathname}index.html?utm=homescreen`,
  // `${PUBLIC_PATH.pathname}assets/css/app.css`, has hash in prod / load dynamic - witouth full integration with webpack
  // `${PUBLIC_PATH.pathname}assets/js/app.js`, has hash in prod / load dynamic - witouth full integration with webpack
  // `${PUBLIC_PATH.pathname}dvx-sw.js`,
  `${PUBLIC_PATH.pathname}assets/fonts/fa-regular-400.ttf`,
  `${PUBLIC_PATH.pathname}assets/fonts/fa-regular-400.woff`,
  `${PUBLIC_PATH.pathname}assets/fonts/fa-regular-400.woff2`,
];
// log(__assetsManifest);
// log(PUBLIC_PATH.pathname);
self.addEventListener('install', e => {
  c(`[sw]: Installed`);
  e.waitUntil(
    caches
      .open(CACHE_NAME)
      .then(cache => {
        c(`[sw]: Archivos en cache`);
        return cache
          .addAll(__assetsManifest)
          //skipWaiting forza al SW a activarse
          .then(() => self.skipWaiting());
      })
      .catch(err => error(`[sw]: Falló registro de cache`, err))
  );
});

self.addEventListener('activate', e => {
  c(`[sw]: activate`);

  const cacheList = [CACHE_NAME];

  e.waitUntil(
    caches
      .keys()
      .then(cachesNames => {
        c(`[sw]: cacheNames`, cachesNames);
        return Promise.all(
          cachesNames.map(cacheName => {
            //Eliminamos lo que ya no se necesita en cache
            if (cacheList.indexOf(cacheName) === -1) {
              caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        c(`[sw]: cache limpio y actualizado`);
        // Le indica al SW activar el cache actual
        return self.clients.claim();
      })
      .catch(err => error(`[sw]: Falló apertura de llaves de cache`, err))
  );

});

self.addEventListener('fetch', e => {
  c(`[sw]: Fetch`);

  e.respondWith(
    //Miramos si la petición coincide con algún elemento del cache
    caches
      .match(e.request)
      .then(response => {
        //Si coincide lo retornamos del cache
        if (response) {
          return response;
        }
        //Sino, lo solicitamos a la red
        return fetch(e.request)
          .then(response => {
            // Exclude files from webpack server and hot reload
            if (response.url.includes('browser-sync') || response.url.includes('sockjs-node') || response.url.includes('hot-update.json')) {
              return response;
            }

            let responseToCache = response.clone();

            caches
              .open(CACHE_NAME)
              .then(cache => {
                cache
                  .put(e.request, responseToCache)
                  .catch(err => error(`[sw]: ${e.request.url}`, err))
              })
              .catch(err => error(`[sw]: Falló apertura de cache`, err));

            return response;
          });
      })
      .catch(err => error(`[sw]: Falló respondWith`, err))
  );
});

self.addEventListener('push', e => {
  c(`[sw]: Push event`, e);
  if (e.data.text() === 'Test push message from DevTools.') {
    let title = 'Push Notification Demo';
    let options = {
      body: 'Click to return to app',
      icon: `${PUBLIC_PATH.pathname}android-chrome-192x192.png`,
      badge: `${PUBLIC_PATH.pathname}android-chrome-192x192.png`,
      vibrate: [100, 200, 50], // ms
      data: {
        id: 1,
      },
      actions: [
        {
          action: 'Si',
          title: 'I love this app 💓😍',
          icon: `${PUBLIC_PATH.pathname}android-chrome-192x192.png`,
        },
        {
          action: 'No',
          title: 'I don\'t love this app 💔😞',
          icon: `${PUBLIC_PATH.pathname}android-chrome-192x192.png`,
        },
      ],
    };

    e.waitUntil(self.registration.showNotification(title, options));
  }
});

self.addEventListener('notificationclick', e => {
  c(`[sw]: Notification click`, e);

  if (e.action === 'Si') {
    c('Amo esta aplicación');
    e.notification.close();

    clients.openWindow(`${PUBLIC_PATH.full}/?utm=homescreen`);
  } else if (e.action === 'No') {
    c('No me gusta esta aplicación :(');
    e.notification.close();
  }
});

self.addEventListener('sync', e => {
  c('[sw]: BackgroundSync', e)

  // Validar etiqueta definida en js o etiqueta github creada en js
  if (e.tag === 'github' || e.tag === 'test-tag-from-devtools') {
    e.waitUntil(
      // Comprobamos ventanas abiertas
      self
        .clients
        .matchAll()
        .then(all => {
          return all.map(client => {
            return client.postMessage('online');
          });
        })
        .catch(err => error('[sw]: Background sync fail', err))
    );
  }
});

// self.addEventListener('message', e => {
//   c('[sw]: message', e.data);
//   fetchGithubUser(localStorage.getItem('github', true));
// });
