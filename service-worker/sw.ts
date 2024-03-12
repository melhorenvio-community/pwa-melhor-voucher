/// <reference lib="WebWorker" />
/// <reference types="vite/client" />

import { precacheAndRoute, createHandlerBoundToURL } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { CacheFirst } from 'workbox-strategies';
import { ExpirationPlugin } from 'workbox-expiration';
import { clientsClaim } from 'workbox-core'

declare let self: ServiceWorkerGlobalScope;

precacheAndRoute(self.__WB_MANIFEST);

registerRoute(
  ({ request }) => request.destination === 'style' || request.destination === 'document',
  new CacheFirst({
    cacheName: 'css-html-cache',
    plugins: [
      new ExpirationPlugin({
        maxEntries: 20,
        maxAgeSeconds: 7 * 24 * 60 * 60,
      }),
    ],
  })
);

registerRoute(
  ({ request }) => request.destination === 'image',
  new CacheFirst({
    cacheName: 'image-cache',
    plugins: [
      new ExpirationPlugin({
        maxEntries: 50,
        maxAgeSeconds: 30 * 24 * 60 * 60,
      }),
    ],
  })
);

const customHandler = createHandlerBoundToURL('/offline.html');

registerRoute(
  ({ url }) => url.pathname.startsWith('/login'),
  ({ event }) => customHandler.handle({ event })
);

registerRoute(
  ({ url }) => url.pathname.startsWith('/register'),
  ({ event }) => customHandler.handle({ event })
);

self.skipWaiting();
clientsClaim();

