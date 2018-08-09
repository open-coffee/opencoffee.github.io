const filesToCache = [
    '/',
    '/index.html',
    '/js/app.js',
    '/css/coffeenet.css',
    '/img/GitHub-Mark-32px.png',
    '/img/coffeenet_logo.png',
    '/img/element_bar.svg',
    '/projects/config-server/',
    '/projects/auth-server/',
    '/projects/discovery-server/',
    '/projects/frontpage/',
    '/projects/starter-discovery/',
    '/projects/starter-logging/',
    '/projects/starter-navigation-javascript/',
    '/projects/starter-navigation-thymeleaf/',
    '/projects/starter-security/'
];

let cacheName;

self.addEventListener('install', function (event) {
    console.log('[ServiceWorker] Install');
    event.waitUntil(

        fetch('/health/index.json').then(r => r.json())
            .then(health => {
                cacheName = `coffeenet-homepage-v${health.buildTime}`;
                caches.open(cacheName).then(function (cache) {
                    console.log(`[ServiceWorker] Caching app shell for ${cacheName}`);
                    return cache.addAll(filesToCache);
                })
            })
            .catch(e =>
                console.log("[ServiceWorker] Could not retrieve build time information")
            )
    );
});

self.addEventListener('activate', function (event) {
    console.log('[ServiceWorker] Activate');
    event.waitUntil(
        caches.keys().then(function (keyList) {
            return Promise.all(keyList.map(function (key) {
                if (key !== cacheName) {
                    console.log(`[ServiceWorker] Removing old cache '${key}'`);
                    return caches.delete(key);
                }
            }));
        })
    );
    return self.clients.claim();
});


self.addEventListener('fetch', function (event) {
    console.log('[ServiceWorker] Fetch', event.request.url);
    event.respondWith(
        caches.match(event.request).then(function (response) {
            return response || fetch(event.request);
        })
    );
});
