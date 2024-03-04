// @ts-nocheck
import { cleanupOutdatedCaches, createHandlerBoundToURL, precacheAndRoute } from 'workbox-precaching';
import { clientsClaim } from 'workbox-core';
import { NavigationRoute, registerRoute } from 'workbox-routing';

let self;

precacheAndRoute(self.__WB_MANIFEST);

cleanupOutdatedCaches();

let allowlist;

if (import.meta.env.DEV)
  allowlist = [/^\/$/];

registerRoute(new NavigationRoute(createHandlerBoundToURL('/'), { allowlist }));

self.skipWaiting();
clientsClaim();
