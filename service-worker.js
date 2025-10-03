// By changing the cache name, we force the service worker to update.
const CACHE_NAME = "daily-command-center-cache-v2";

const urlsToCache = [
  "./index.html",
  "https://cdn.tailwindcss.com",
  "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;900&display=swap",
  "https://cdn.jsdelivr.net/npm/dayjs@1/dayjs.min.js",
  "https://cdn.jsdelivr.net/npm/dayjs@1/plugin/utc.js",
];

self.addEventListener("install", (event) => {
  // Perform install steps
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("Opened cache and caching new assets");
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // Cache hit - return response
      if (response) {
        return response;
      }
      return fetch(event.request);
    })
  );
});

self.addEventListener("activate", (event) => {
  // This is the important part for updates.
  // It ensures that old caches are removed.
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
