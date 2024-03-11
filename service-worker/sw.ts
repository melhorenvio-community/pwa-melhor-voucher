/// <reference lib="WebWorker" />
/// <reference types="vite/client" />

import { cleanupOutdatedCaches, createHandlerBoundToURL, precacheAndRoute } from 'workbox-precaching'
import { clientsClaim } from 'workbox-core'
import { NavigationRoute, registerRoute } from 'workbox-routing'

declare let self: ServiceWorkerGlobalScope

cleanupOutdatedCaches();

precacheAndRoute([
  {
    url: '/login/',
    revision: null,
  },
  {
    url: '/register/',
    revision: null,
  },
  {
    url: '/login/index.js',
    revision: null,
  },
  {
    url: '/login/index.html',
    revision: null,
  },
  {
    url: '/register/index.js',
    revision: null,
  },
  {
    url: '/register/index.css',
    revision: null,
  },
  {
    url: '/register/index.html',
    revision: null,
  },
]);

let allowlist: undefined | RegExp[]

if (import.meta.env.DEV)
  allowlist = [/^\/$/]

registerRoute(new NavigationRoute(
  createHandlerBoundToURL('/'),
  { allowlist },
))

self.skipWaiting();
clientsClaim();
