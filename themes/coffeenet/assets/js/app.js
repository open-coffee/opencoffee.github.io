if ('serviceWorker' in navigator) {
    navigator.serviceWorker
        .register('{{ .CoffeeNetServiceWorkerUrl }}')
        .then(function (reg) {
            console.log(`[ServiceWorker] Registered in scope ${reg.scope}`);
        });
}
