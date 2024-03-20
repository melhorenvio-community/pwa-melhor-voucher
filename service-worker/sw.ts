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
      (url.pathname.includes('logo.svg') || url.pathname.includes('pwa-192x192.png') || url.pathname.includes('home-screen.png') )
    );
  },
  new CacheFirst({
    cacheName: 'login-cache',
    plugins: [
      new ExpirationPlugin({ maxEntries: 2 * 24 * 60 * 60 })
    ],
  })
);

registerRoute(
  ({ url }) => {
    return (
      url.origin === self.location.origin &&
      (url.pathname.includes('cupon.svg') || url.pathname.includes('companies') || url.pathname.includes('audio.svg') || url.pathname.includes('micro.svg') || url.pathname.includes('search.svg'))
    );
  },
  new CacheFirst({
    cacheName: 'index-cache',
    plugins: [
      new ExpirationPlugin({ maxEntries: 24 * 60 * 60 })
    ],
  })
);

registerRoute(
  ({ url }) => {
    return (
      url.origin === self.location.origin &&
      (url.pathname.includes('congratulations.svg') || url.pathname.includes('error.svg'))
    );
  },
  new CacheFirst({
    cacheName: 'rescue-cache',
    plugins: [
      new ExpirationPlugin({ maxEntries: 24 * 60 * 60 })
    ],
  })
);

self.skipWaiting()
clientsClaim()