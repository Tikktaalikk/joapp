const CACHE_NAME = 'joapp-v2';
const FILES_TO_CACHE = ['./', './index.html', './style.css', './script.js', './birds.js', './game.js', './manifest.json', './icon.svg'];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(FILES_TO_CACHE)));
});
self.addEventListener('fetch', (event) => {
  event.respondWith(caches.match(event.request).then((response) => response || fetch(event.request)));
});