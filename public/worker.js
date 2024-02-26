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

  // Limpar o cache manualmente
  if ('caches' in window) {
    document.getElementById('limparCacheBtn').addEventListener('click', function() {
      caches.keys().then(function(cacheNames) {
        cacheNames.forEach(function(cacheName) {
          caches.delete(cacheName);
        });
        console.log('Cache limpo com sucesso!');
      });
    });
  }

  // Forçar uma atualização do cache
  if ('caches' in window) {
    document.getElementById('forcarAtualizacaoBtn').addEventListener('click', function() {
      caches.open(cacheName).then(function(cache) {
        return cache.addAll(cacheAssets);
      });
      console.log('Cache atualizado com sucesso!');
    });
  }

  // Recuperar um recurso do cache
  if ('caches' in window) {
    document.getElementById('recuperarRecursoBtn').addEventListener('click', function() {
      caches.match('/index.html').then(function(response) {
        if (response) {
          console.log('Recurso encontrado no cache:', response);
        } else {
          console.log('Recurso não encontrado no cache.');
        }
      });
    });
  }

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