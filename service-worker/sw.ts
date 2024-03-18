/// <reference lib="WebWorker" />
/// <reference types="vite/client" />

import { cleanupOutdatedCaches, precacheAndRoute } from 'workbox-precaching'
import { clientsClaim } from 'workbox-core'
import { registerRoute } from 'workbox-routing'
import { CacheFirst } from 'workbox-strategies'
import { ExpirationPlugin } from 'workbox-expiration'

declare let self: ServiceWorkerGlobalScope

cleanupOutdatedCaches();
precacheAndRoute(self.__WB_MANIFEST);

self.addEventListener('install', (event) => {
  console.log('Guardando caches-v1');
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
    cacheName: 'svg-cache',
    plugins: [
      new ExpirationPlugin({ maxEntries: 24 * 60 * 60 })
    ],
  })
);

self.skipWaiting()
clientsClaim()

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
