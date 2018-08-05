const cacheName = `coffeenet-homepage-${buildTime}`;
const filesToCache = [
    '/',
    '/index.html',
    '/js/app.js',
    '/css/coffeenet.css',
    '/img/GitHub-Mark-32px.png',
    '/img/coffeenet_logo.png',
    '/img/element_bar.svg',
    '/projects/config-server',
    '/projects/auth-server',
    '/projects/discovery-server',
    '/projects/frontpage',
    '/projects/starter-discovery',
    '/projects/starter-logging',
    '/projects/starter-navigation-javascript',
    '/projects/starter-navigation-thymeleaf',
    '/projects/starter-security'
];

self.addEventListener('install', function (e) {
    console.log('[ServiceWorker] Install');
    e.waitUntil(
        caches.open(cacheName).then(function (cache) {
            console.log('[ServiceWorker] Caching app shell');
            return cache.addAll(filesToCache);
        })
    );
});

self.addEventListener('activate', function (e) {
    console.log('[ServiceWorker] Activate');
    e.waitUntil(
        caches.keys().then(function (keyList) {
            return Promise.all(keyList.map(function (key) {
                if (key !== cacheName) {
                    console.log('[ServiceWorker] Removing old cache', key);
                    return caches.delete(key);
                }
            }));
        })
    );
    return self.clients.claim();
});


self.addEventListener('fetch', function (e) {
    console.log('[ServiceWorker] Fetch', e.request.url);
    e.respondWith(
        caches.match(e.request).then(function (response) {
            return response || fetch(e.request);
        })
    );
});
