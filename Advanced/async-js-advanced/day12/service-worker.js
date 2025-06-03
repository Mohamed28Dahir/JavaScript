// Service Worker Implementation

const CACHE_NAME = 'app-cache-v1';
const STATIC_ASSETS = [
    '/',
    '/index.html',
    '/styles.css',
    '/app.js',
    '/offline.html'
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Caching static assets');
                return cache.addAll(STATIC_ASSETS);
            })
            .then(() => self.skipWaiting())
    );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys()
            .then(cacheNames => {
                return Promise.all(
                    cacheNames
                        .filter(name => name !== CACHE_NAME)
                        .map(name => caches.delete(name))
                );
            })
            .then(() => self.clients.claim())
    );
});

// Fetch event - implement caching strategies
self.addEventListener('fetch', (event) => {
    const request = event.request;
    
    // Apply different strategies based on request type
    if (request.mode === 'navigate') {
        event.respondWith(networkFirstStrategy(request));
    } else if (request.url.includes('/api/')) {
        event.respondWith(staleWhileRevalidate(request));
    } else {
        event.respondWith(cacheFirstStrategy(request));
    }
});

// Network-first strategy for navigation requests
async function networkFirstStrategy(request) {
    try {
        // Try network first
        const networkResponse = await fetch(request);
        
        // Cache successful response
        const cache = await caches.open(CACHE_NAME);
        cache.put(request, networkResponse.clone());
        
        return networkResponse;
    } catch (error) {
        // Network failed, try cache
        const cachedResponse = await caches.match(request);
        
        if (cachedResponse) {
            return cachedResponse;
        }
        
        // If no cache, return offline page
        return caches.match('/offline.html');
    }
}

// Cache-first strategy for static assets
async function cacheFirstStrategy(request) {
    const cachedResponse = await caches.match(request);
    
    if (cachedResponse) {
        // Return cached response immediately
        return cachedResponse;
    }
    
    try {
        // If not in cache, try network
        const networkResponse = await fetch(request);
        
        // Cache successful response
        const cache = await caches.open(CACHE_NAME);
        cache.put(request, networkResponse.clone());
        
        return networkResponse;
    } catch (error) {
        console.error('Cache-first strategy failed:', error);
        throw error;
    }
}

// Stale-while-revalidate strategy for API requests
async function staleWhileRevalidate(request) {
    const cachedResponse = await caches.match(request);
    
    // Start network request immediately
    const networkResponsePromise = fetch(request).then(
        async response => {
            const cache = await caches.open(CACHE_NAME);
            cache.put(request, response.clone());
            return response;
        }
    );
    
    // Return cached response immediately if available
    if (cachedResponse) {
        return cachedResponse;
    }
    
    // Otherwise wait for network
    return networkResponsePromise;
}

// Background sync
self.addEventListener('sync', (event) => {
    if (event.tag === 'sync-messages') {
        event.waitUntil(syncMessages());
    }
});

async function syncMessages() {
    try {
        const messagesQueue = await getMessagesQueue();
        
        for (const message of messagesQueue) {
            await sendMessage(message);
            await removeFromQueue(message);
        }
        
        // Notify clients of successful sync
        const clients = await self.clients.matchAll();
        clients.forEach(client => {
            client.postMessage({
                type: 'SYNC_COMPLETE',
                timestamp: Date.now()
            });
        });
    } catch (error) {
        console.error('Sync failed:', error);
        // Sync will be retried automatically by the browser
    }
}

// Push notifications
self.addEventListener('push', (event) => {
    const data = event.data.json();
    
    const options = {
        body: data.body,
        icon: '/icon.png',
        badge: '/badge.png',
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

// Helper functions
async function getMessagesQueue() {
    // Implementation would interact with IndexedDB
    return [];
}

async function sendMessage(message) {
    // Implementation would send message to server
}

async function removeFromQueue(message) {
    // Implementation would remove from IndexedDB
}

// Cache management utilities
async function deleteOldCaches() {
    const cacheKeepList = [CACHE_NAME];
    const keyList = await caches.keys();
    const cachesToDelete = keyList.filter(key => !cacheKeepList.includes(key));
    await Promise.all(cachesToDelete.map(key => caches.delete(key)));
}

async function updateStaticCache() {
    const cache = await caches.open(CACHE_NAME);
    await cache.addAll(STATIC_ASSETS);
}

// Periodic cache update
async function periodicCacheUpdate() {
    try {
        await deleteOldCaches();
        await updateStaticCache();
        console.log('Cache updated successfully');
    } catch (error) {
        console.error('Cache update failed:', error);
    }
}

// Example of handling versioned caches
const CACHE_VERSIONS = {
    static: 'static-v1',
    dynamic: 'dynamic-v1',
    api: 'api-v1'
};

async function updateCacheVersion(version) {
    const newVersion = version + 1;
    const oldCache = await caches.open(`static-v${version}`);
    const newCache = await caches.open(`static-v${newVersion}`);
    
    // Copy all cached responses to new cache
    const requests = await oldCache.keys();
    await Promise.all(
        requests.map(async request => {
            const response = await oldCache.match(request);
            await newCache.put(request, response);
        })
    );
    
    // Delete old cache
    await caches.delete(`static-v${version}`);
    
    return newVersion;
} 