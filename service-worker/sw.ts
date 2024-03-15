/// <reference lib="WebWorker" />
/// <reference types="vite/client" />
import { cleanupOutdatedCaches, precacheAndRoute } from 'workbox-precaching'
import { clientsClaim } from 'workbox-core'
import { registerRoute } from 'workbox-routing'
import { StaleWhileRevalidate } from 'workbox-strategies';
import { ExpirationPlugin } from 'workbox-expiration';
import { NetworkOnly } from 'workbox-strategies';

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
    cacheName: 'images-login',
    plugins: [
      new ExpirationPlugin({ maxEntries: 24 * 60 * 60 }),
    ],
  })
  
);

self.skipWaiting()
clientsClaim()
