const CACHE_NAME = "math-sprint-v2-2.0.4";
const ASSETS = [
  "./?v=2.0.4",
  "./index.html?v=2.0.4",
  "./styles.css?v=2.0.4",
  "./app.js?v=2.0.4",
  "./logic.js?v=2.0.4",
  "./manifest.json?v=2.0.4",
  "./favicon.svg?v=2.0.4",
  "./favicon.ico?v=2.0.4",
  "./apple-touch-icon.png?v=2.0.4"
];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(caches.keys().then((keys) => Promise.all(
    keys.map((key) => (
      key.startsWith("math-sprint-v2-") && key !== CACHE_NAME ? caches.delete(key) : null
    ))
  )));
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  event.respondWith(caches.match(event.request).then((cached) => cached || fetch(event.request)));
});
