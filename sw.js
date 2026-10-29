// =============================================================================
// 🔧 SERVICE WORKER — Bio Page PWA
// Strategy: Network-First for HTML, JS, CSS and JSON (offers.json changes every
// day, code changes with every deploy); Cache-First only for images and fonts.
// Cache-First on JS/CSS/JSON served stale offerte.js/offerte.css/offers.json
// forever to anyone who had visited the site: bump CACHE_NAME on any change to
// this file's strategy so old caches get deleted on activate.
// =============================================================================

const CACHE_NAME = 'bio-page-v2';
const STATIC_ASSETS = [
    '/',
    '/index.html',
    '/style.css',
    '/script.js',
    '/config.js',
    '/manifest.json',
    '/img/profile.PNG',
    '/img/icon-192x192.png',
    '/img/icon-512x512.png',
    '/img/apple-touch-icon.png'
];

// External resources to cache
const EXTERNAL_ASSETS = [
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css',
    'https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap'
];

// =============================================================================
// INSTALL — Pre-cache static assets
// =============================================================================
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('[SW] Pre-caching static assets');
                return cache.addAll(STATIC_ASSETS);
            })
            .then(() => self.skipWaiting())
    );
});

// =============================================================================
// ACTIVATE — Clean old caches
// =============================================================================
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys()
            .then((cacheNames) => {
                return Promise.all(
                    cacheNames
                        .filter((name) => name !== CACHE_NAME)
                        .map((name) => {
                            console.log('[SW] Deleting old cache:', name);
                            return caches.delete(name);
                        })
                );
            })
            .then(() => self.clients.claim())
    );
});

// =============================================================================
// FETCH — Cache-First for assets, Network-First for HTML
// =============================================================================
self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);

    // Skip non-GET requests
    if (request.method !== 'GET') return;

    // Images and fonts rarely change: Cache-First
    if (['image', 'font'].includes(request.destination)) {
        event.respondWith(cacheFirst(request));
        return;
    }

    // Everything else (HTML, JS, CSS, offers.json): Network-First, cache only as offline fallback
    event.respondWith(networkFirst(request));
});

/**
 * Network-First strategy: try network, fallback to cache
 */
async function networkFirst(request) {
    try {
        const networkResponse = await fetch(request);
        if (networkResponse.ok) {
            const cache = await caches.open(CACHE_NAME);
            cache.put(request, networkResponse.clone());
        }
        return networkResponse;
    } catch (error) {
        const cachedResponse = await caches.match(request);
        if (cachedResponse) {
            return cachedResponse;
        }
        // Return offline fallback
        return caches.match('/index.html');
    }
}

/**
 * Cache-First strategy: try cache, fallback to network
 */
async function cacheFirst(request) {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
        return cachedResponse;
    }

    try {
        const networkResponse = await fetch(request);
        if (networkResponse.ok) {
            const cache = await caches.open(CACHE_NAME);
            cache.put(request, networkResponse.clone());
        }
        return networkResponse;
    } catch (error) {
        // Return nothing for failed non-HTML requests
        return new Response('', { status: 408, statusText: 'Offline' });
    }
}
