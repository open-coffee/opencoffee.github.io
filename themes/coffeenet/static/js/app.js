if ('serviceWorker' in navigator) {
    navigator.serviceWorker
        .register('/js/service-worker.js', { scope: '/' })
        .then(function () {
            console.log('Service Worker Registered');
        });
}
