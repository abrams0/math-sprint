const CACHE_PREFIX = "math-sprint-v1-";
const CACHE_NAME = `${CACHE_PREFIX}__APP_VERSION__`;
const ASSETS = [
  "./",
  "./index.html",
  "./styles.css",
  "./app.js",
  "./logic.js",
  "./manifest.json"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.map((key) => (
        key.startsWith(CACHE_PREFIX) && key !== CACHE_NAME ? caches.delete(key) : null
      )))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  if (new URL(event.request.url).pathname.includes("/v2/")) return;
  event.respondWith(
    fetch(event.request)
      .then((response) => response)
      .catch(async () => {
        const cached = await caches.match(event.request, { ignoreSearch: true });
        if (cached) return cached;
        if (event.request.mode === "navigate") {
          return caches.match("./index.html", { ignoreSearch: true });
        }
        return Response.error();
      })
  );
});
