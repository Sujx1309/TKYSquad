const staticCacheName = 'my-pwa-v1';

// Cache necessary resources upon installation
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(staticCacheName)
      .then(cache => {
        return cache.addAll([ 
            'styles.css',
            'app.js',
            'Index.html',
            'Sw.js',
            'Login/login.html',
            'Login/login.js',
            'Login/style.css',
            'Login/study.jpeg',
            "TKY.png",
            'Notes html/ગણિતNotes.html',
            'Video html/ગણિતVideos.html',
            'https://fonts.googleapis.com/css2?family=Dosis:wght@200..800&family=Lexend:wght@100..900&display=swap&font-display=swap'
        ]);
      })
  );
});

// Intercept network requests and serve cached content if available
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        return response || fetch(event.request);
      })
  );
});
