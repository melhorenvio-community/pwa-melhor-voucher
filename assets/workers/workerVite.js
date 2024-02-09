if ('serviceWorker' in navigator) {
  const cacheName = 'PWA-V1';

  const cacheAssets = [
    'index.html',
    '/assets/pcss/index.pcss',
    '/assets/pcss/wor.pcss',
    '/icons/',
    '/companies/',
  ]
  
  self.addEventListener('Install', (event) => {
    console.log("Service worker vite: Install");

    event.waitUtil(
      caches
        .open(cacheName)
        .then(cache => {
          console.log("Service worker vite: caches");
          cache.addAll(cacheAssets)
        })
        .then(() => {
          self.skipWatting();
        })
    )
  });

  self.addEventListener('Activate', (event) => {
    console.log("Service worker vite: Install");

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