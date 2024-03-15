/// <reference lib="WebWorker" />
/// <reference types="vite/client" />
import { cleanupOutdatedCaches, precacheAndRoute } from 'workbox-precaching'
import { clientsClaim } from 'workbox-core'
import { registerRoute } from 'workbox-routing'
import { StaleWhileRevalidate } from 'workbox-strategies';
import { ExpirationPlugin } from 'workbox-expiration';

declare let self: ServiceWorkerGlobalScope

precacheAndRoute(self.__WB_MANIFEST)

cleanupOutdatedCaches()

registerRoute(
  ({ url }) => {
    const image = url.origin === self.location.origin && url.pathname.endsWith('.png');
    const router = url.pathname === '/login';
    return image || router;
  },  
  
  new StaleWhileRevalidate({
    cacheName: 'images',
    plugins: [
      new ExpirationPlugin({ maxEntries: 50 }),
    ],
  })
  
);

self.addEventListener('fetch', (event) => {
  const request = event.request;
  if (request.url.includes('/register')) {
    event.respondWith(
      fetch(request.url, { cache: 'no-store' })
    );
  } else {
    event.respondWith(
      caches.match(request).then((response) => {
        return response || fetch(request);
      })
    );
  }
});


self.skipWaiting()
clientsClaim()
