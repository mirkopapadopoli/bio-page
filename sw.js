// =============================================================================
// 🔧 SERVICE WORKER — Bio Page PWA
// Strategy: Cache-First for static assets, Network-First for HTML
// =============================================================================

const CACHE_NAME = 'bio-page-v1';
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

    // Network-First for HTML pages (always get fresh content)
    if (request.headers.get('accept')?.includes('text/html')) {
        event.respondWith(networkFirst(request));
        return;
    }

    // Cache-First for everything else (CSS, JS, images, fonts)
    event.respondWith(cacheFirst(request));
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
