import { precacheAndRoute } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { StaleWhileRevalidate, CacheFirst } from 'workbox-strategies';
import { ExpirationPlugin } from 'workbox-expiration';

workbox.precaching.precacheAndRoute(self.__WB_MANIFEST);

precacheAndRoute([
  {url: '/login', revision: '01'},
  {url: '/rescue', revision: '01'},
  {url: '/register', revision: '01'},
  {url: '/icons', revision: '01'},
  {url: '/companies', revision: '01'},
]);

registerRoute(
  ({url}) => url.pathname.startsWith('/login'),
  new StaleWhileRevalidate({
    cacheName: 'pwa-login',
    plugins: [
      new ExpirationPlugin({
        maxAgeSeconds: 7 * 24 * 60 * 60,
        maxEntries: 50,
      }),
    ],
  }),
);

registerRoute(
  ({url}) => url.pathname.startsWith('/register'),
  new CacheFirst({
    cacheName: 'pwa-register',
    plugins: [
      new ExpirationPlugin({
        maxAgeSeconds: 7 * 24 * 60 * 60,
        maxEntries: 50,
      }),
    ],
  }),
);