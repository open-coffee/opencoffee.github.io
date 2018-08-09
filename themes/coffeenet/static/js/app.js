if ('serviceWorker' in navigator) {
    navigator.serviceWorker
        .register('/service-worker.js')
        .then(function (reg) {
            console.log(`[ServiceWorker] Registered in scope ${reg.scope}`);
        });
}
