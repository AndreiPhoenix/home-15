// Имя кэша
const CACHE_NAME = 'my-site-cache-v1';
// Ресурсы для кэширования
const urlsToCache = [
  '/',
  '/index.html',
  '/styles/main.css',
  '/scripts/main.js',
  '/images/logo.png'
];

// Установка Service Worker
self.addEventListener('install', event => {
  // Открываем кэш и добавляем в него файлы
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// Активация Service Worker
self.addEventListener('activate', event => {
  // Удаляем старые кэши
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Перехват запросов и возврат из кэша
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Кэш найден - возвращаем его
        if (response) {
          return response;
        }
        // Иначе делаем запрос к сети
        return fetch(event.request);
      }
    )
  );
});
