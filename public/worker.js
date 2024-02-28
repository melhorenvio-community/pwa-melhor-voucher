if ('serviceWorker' in navigator) {
  const cacheName = 'PWA-V1';

  const cacheAssets = [
    'index.html',
    '/assets/pcss/index.pcss',
    '/assets/workerVite/workerVite.js',
    '/icons/',
    '/companies/',
  ]

  const pageStrategy = new CacheFirst({
    cacheName: 'pages',
    plugins: [
      new CacheableResponsePlugin({
        statuses: [200],
      }),
    ],
  });

  registerRoute( ({ request }) => request.mode === 'navigate', pageStrategy );

  self.addEventListener('install', event => {
    console.log("offline: Install");
    const files = ['/off.vue'];
    event.waitUntil(
      self.caches.open('offline-fallbacks')
          .then(cache => cache.addAll(files))
    );
  });


  self.addEventListener('Install', (event) => {
    console.log("Service worker: Install");

    event.waitUtil(
      caches
        .open(cacheName)
        .then(cache => {
          console.log("Service worker: caches");
          cache.addAll(cacheAssets)
        })
        .then(() => {
          self.skipWatting();
        })
    )
  });

  self.addEventListener('Activate', (event) => {
    console.log("Service worker: Install");

    event.waitUtil(
      caches
        .key()
        .then(cacheName => {
          return Promise.all(
            cacheName.map(cache => {
              if(cache !== cacheName) {
                console.log("Service worker: clearing old cache");
                return caches.delete(cache);
              }
            })
          )
        })
    )
  });
}