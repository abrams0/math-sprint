const CACHE_NAME = "math-sprint-v2-__APP_VERSION__";
const ASSETS = ["./", "./index.html", "./styles.css", "./app.js", "./logic.js", "./manifest.json"];

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
