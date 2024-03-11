/// <reference lib="WebWorker" />
/// <reference types="vite/client" />

import { cleanupOutdatedCaches, createHandlerBoundToURL, precacheAndRoute } from 'workbox-precaching'
import { clientsClaim } from 'workbox-core'
import { NavigationRoute, registerRoute } from 'workbox-routing'

declare let self: ServiceWorkerGlobalScope

cleanupOutdatedCaches();

precacheAndRoute(self.__WB_MANIFEST);

let allowlist: undefined | RegExp[]

if (import.meta.env.DEV)
  allowlist = [/^\/$/]

registerRoute(new NavigationRoute(
  createHandlerBoundToURL('/'),
  { allowlist },
))

registerRoute(
  ({ url }) => {
    const router = url.pathname === '/login';
    const image = url.pathname.endsWith('.svg') || url.pathname.endsWith('.png');
    return router || image;
  },
  
  ({ event }) => fetch(event.request)
);

self.skipWaiting();
clientsClaim();
