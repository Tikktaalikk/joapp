//tourne en arriere-plan, garde une copie des fichiers en memoire pour que l'appli marche sans connexion
const CACHE_NAME = 'joapp-v3';
const FILES_TO_CACHE = [
  './', './index.html', './manifest.json', './icon.svg',
  './shared/style.css', './shared/utils.js', './shared/storage.js', './shared/register-sw.js',
  './games/oiseaux-photo/index.html', './games/oiseaux-photo/birds.js', './games/oiseaux-photo/game.js'
];
self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(FILES_TO_CACHE)));
});
self.addEventListener('fetch', (event) => {
  event.respondWith(caches.match(event.request).then((response) => response || fetch(event.request)));
});