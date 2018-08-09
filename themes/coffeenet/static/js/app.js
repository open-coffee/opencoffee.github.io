if ('serviceWorker' in navigator) {
    navigator.serviceWorker
        .register('/service-worker.js')
        .then(function (reg) {
            console.log(`Service Worker Registered in scope ${reg.scope}`);
        });
}
