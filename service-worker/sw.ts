/// <reference lib="WebWorker" />
/// <reference types="vite/client" />

import { cleanupOutdatedCaches, precacheAndRoute } from 'workbox-precaching'
import { clientsClaim } from 'workbox-core'
import { registerRoute } from 'workbox-routing'
import { CacheFirst } from 'workbox-strategies'
import { ExpirationPlugin } from 'workbox-expiration'

declare let self: ServiceWorkerGlobalScope

precacheAndRoute(self.__WB_MANIFEST);

cleanupOutdatedCaches();

self.addEventListener('install', (event) => {
  console.log('Guardando caches');
});

registerRoute(
  ({ url }) => {
    return (
      url.origin === self.location.origin &&
      (url.pathname.includes('cupon.svg') || url.pathname.includes('audio.svg') || url.pathname.includes('logo.svg') || 
        url.pathname.includes('micro.svg')|| url.pathname.includes('search.svg') || url.pathname.includes('companies'))
    );
  },
  new CacheFirst({
    cacheName: 'svg-cache-v2',
    plugins: [
      new ExpirationPlugin({ maxEntries: 120, maxAgeSeconds: 3600 }),
    ],
  })
);

self.skipWaiting();
clientsClaim();

// registerRoute(
//   ({ url }) => {
//     const image = url.origin === self.location.origin && url.pathname.endsWith('.png');
//     const router = url.pathname === '/login';
//     return image || router;
//   },  
  
//   new StaleWhileRevalidate({
//     cacheName: 'images-login',
//     plugins: [
//       //new ExpirationPlugin({ maxEntries: 24 * 60 * 60 }), 24hrs
//       new ExpirationPlugin({ maxAgeSeconds: 120 })
//     ],
//   })
// );
