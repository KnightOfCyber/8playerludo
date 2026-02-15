const CACHE_NAME = "ludo8pwa-v1";

const ASSETS = [
  "./",
  "./index.html",
  "./style.css",
  "./game.js",
  "./manifest.json",
  "./Board.png",
  "./icon-192.png",
  "./icon-512.png",

  "./sounds/dice.mp3",
  "./sounds/move.mp3",
  "./sounds/music.mp3",
  "./sounds/capture.wav"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) return caches.delete(key);
        })
      )
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      return cachedResponse || fetch(event.request);
    })
  );
});
