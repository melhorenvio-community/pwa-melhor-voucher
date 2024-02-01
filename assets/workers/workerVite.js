const countSum= (n)=>{
  let sum = 0;
  for(let i =1; i <= n; i++){
   sum += i;
  }
  return sum
 } 
 
 self.addEventListener('message', (event) => {
   console.log("In worker vite: value data: "+ event.data);

   let sum = countSum(event.data)

   let message = 'In worker vite:value sum' + event.data + ' is ' + sum;

   console.log(`message:${message}`);

   self.postMessage(sum)
 }, false);
//--------------------------
const CACHE_NAME = 'logo-image';
const CACHE_TIMEOUT = 300;

self.addEventListener('fetch', (event) => {
  console.log("fetch: value data vite"+ event.data);
  console.log("fetch: value request vite"+ event.request);
  
  event.respondWith(staleWhileRevalidate(event.request));
});

async function staleWhileRevalidate(request) {
  const cache = await caches.open(CACHE_NAME);
  const cachedResponse = await cache.match(request);

  if (cachedResponse) {
    event.waitUntil(updateCache(request));
    return cachedResponse;
  }

  const networkResponse = await fetch(request);

  cache.put(request, networkResponse.clone());

  return networkResponse;
}

async function updateCache(request) {
  const cache = await caches.open(CACHE_NAME);
  const networkResponse = await fetch(request);

  cache.put(request, networkResponse.clone());
}

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/service-worker.js')
    .then((registration) => {
      console.log('Service Worker registrado com sucesso: vite', registration);
    })
    .catch((error) => {
      console.error('Erro ao registrar o Service Worker: vite', error);
    });
}