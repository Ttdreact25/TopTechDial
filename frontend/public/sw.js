/**
 * MIT License
 * Copyright (c) 2024 TopTechDial
 * 
 * TopTechDial PWA Service Worker for Offline Capabilities & Asset Caching
 */

const CACHE_NAME = 'toptechdial-v1-cache-manifest';
const OFFLINE_URL = '/offline.html';

const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/offline.html',
  '/manifest.json',
  '/favicon.ico',
  '/src/main.jsx',
  '/src/index.css',
  '/src/styles/theme.css'
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log('[Service Worker] Precaching critical assets for enhanced performance');
            return cache.addAll(ASSETS_TO_CACHE);
        })
    );
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('[Service Worker] Removing deprecated cache version:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
    self.clients.claim();
});

self.addEventListener('fetch', (event) => {
    // Only handle GET requests for caching
    if (event.request.method !== 'GET') return;

    // Skip Chrome Extensions and non-HTTP schemes
    if (!event.request.url.startsWith('http')) return;

    event.respondWith(
        caches.match(event.request).then((cachedResponse) => {
            if (cachedResponse) {
                return cachedResponse;
            }

            return fetch(event.request).then((response) => {
                // Return original response if invalid or not Cache-able
                if (!response || response.status !== 200 || response.type !== 'basic') {
                    return response;
                }

                // Dynamically cache new requests to improve subsequent load times
                const responseToCache = response.clone();
                caches.open(CACHE_NAME).then((cache) => {
                    cache.put(event.request, responseToCache);
                });

                return response;
            }).catch(() => {
                // If fetch fails (offline), serve the offline page for main document requests
                if (event.request.mode === 'navigate') {
                    return caches.match(OFFLINE_URL);
                }
            });
        })
    );
});

self.addEventListener('push', (event) => {
   const data = event.data.json();
   console.log('[Service Worker] Push notification received:', data);
   
   const options = {
       body: data.body,
       icon: '/logo192.png',
       badge: '/favicon.ico',
       data: {
           url: data.url
       }
   };
   
   event.waitUntil(
       self.registration.showNotification(data.title, options)
   );
});

self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    event.waitUntil(
        clients.openWindow(event.notification.data.url)
    );
});
