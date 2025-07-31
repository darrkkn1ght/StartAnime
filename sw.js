/**
 * StartAnime Service Worker
 * PWA functionality with advanced caching and offline support
 */

const CACHE_NAME = 'startanime-v1.0.0';
const STATIC_CACHE = 'startanime-static-v1.0.0';
const DYNAMIC_CACHE = 'startanime-dynamic-v1.0.0';
const IMAGE_CACHE = 'startanime-images-v1.0.0';

// Files to cache immediately
const STATIC_FILES = [
  '/',
  '/index.html',
  '/recommend.html',
  '/assets/css/main.css',
  '/assets/css/mobile-optimizations.css',
  '/assets/css/performance.css',
  '/assets/css/recomendations.css',
  '/assets/css/animations.css',
  '/assets/css/components.css',
  '/assets/js/main.js',
  '/assets/js/recommendations.js',
  '/assets/js/animations.js',
  '/assets/js/utils.js',
  '/assets/fonts/Inter-Regular.woff2',
  '/assets/fonts/Inter-Medium.woff2',
  '/assets/fonts/Inter-Bold.woff2',
  '/assets/images/ui/logo.svg',
  '/assets/images/ui/arrow-right.svg',
  '/assets/images/ui/star.svg',
  '/data/anime-list.json',
  '/data/genres.json',
  '/data/recommendations.json'
];

// Install event - cache static files
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing...');
  
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        console.log('Service Worker: Caching static files');
        return cache.addAll(STATIC_FILES);
      })
      .then(() => {
        console.log('Service Worker: Static files cached');
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('Service Worker: Failed to cache static files', error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activating...');
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== STATIC_CACHE && 
                cacheName !== DYNAMIC_CACHE && 
                cacheName !== IMAGE_CACHE) {
              console.log('Service Worker: Deleting old cache', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('Service Worker: Activated');
        return self.clients.claim();
      })
  );
});

// Fetch event - serve from cache or network
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Handle different types of requests
  if (isStaticFile(request)) {
    event.respondWith(handleStaticFile(request));
  } else if (isImage(request)) {
    event.respondWith(handleImage(request));
  } else if (isDataFile(request)) {
    event.respondWith(handleDataFile(request));
  } else {
    event.respondWith(handleDynamicRequest(request));
  }
});

// Check if request is for a static file
function isStaticFile(request) {
  const staticExtensions = ['.html', '.css', '.js', '.woff2', '.svg'];
  return staticExtensions.some(ext => request.url.includes(ext));
}

// Check if request is for an image
function isImage(request) {
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.gif'];
  return imageExtensions.some(ext => request.url.includes(ext));
}

// Check if request is for a data file
function isDataFile(request) {
  return request.url.includes('.json');
}

// Handle static file requests
async function handleStaticFile(request) {
  try {
    // Try cache first
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }

    // Fallback to network
    const networkResponse = await fetch(request);
    
    // Cache successful responses
    if (networkResponse.ok) {
      const cache = await caches.open(STATIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.error('Service Worker: Failed to fetch static file', error);
    
    // Return offline page for HTML requests
    if (request.url.includes('.html')) {
      return caches.match('/offline.html');
    }
    
    throw error;
  }
}

// Handle image requests
async function handleImage(request) {
  try {
    // Try cache first
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }

    // Fallback to network
    const networkResponse = await fetch(request);
    
    // Cache successful responses
    if (networkResponse.ok) {
      const cache = await caches.open(IMAGE_CACHE);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.error('Service Worker: Failed to fetch image', error);
    
    // Return placeholder image
    return caches.match('/assets/images/placeholder.jpg');
  }
}

// Handle data file requests
async function handleDataFile(request) {
  try {
    // Try cache first
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }

    // Fallback to network
    const networkResponse = await fetch(request);
    
    // Cache successful responses
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.error('Service Worker: Failed to fetch data file', error);
    
    // Return empty data structure
    return new Response(JSON.stringify({ error: 'Data unavailable offline' }), {
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// Handle dynamic requests
async function handleDynamicRequest(request) {
  try {
    // Try network first
    const networkResponse = await fetch(request);
    
    // Cache successful responses
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.error('Service Worker: Failed to fetch dynamic request', error);
    
    // Try cache as fallback
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    throw error;
  }
}

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  console.log('Service Worker: Background sync', event.tag);
  
  if (event.tag === 'background-sync') {
    event.waitUntil(doBackgroundSync());
  }
});

// Handle background sync
async function doBackgroundSync() {
  try {
    // Get pending actions from IndexedDB
    const pendingActions = await getPendingActions();
    
    for (const action of pendingActions) {
      try {
        await processPendingAction(action);
        await removePendingAction(action.id);
      } catch (error) {
        console.error('Service Worker: Failed to process pending action', error);
      }
    }
  } catch (error) {
    console.error('Service Worker: Background sync failed', error);
  }
}

// Push notification handling
self.addEventListener('push', (event) => {
  console.log('Service Worker: Push notification received');
  
  const options = {
    body: event.data ? event.data.text() : 'New anime recommendations available!',
    icon: '/assets/images/ui/logo.svg',
    badge: '/assets/images/ui/star.svg',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'Explore',
        icon: '/assets/images/ui/arrow-right.svg'
      },
      {
        action: 'close',
        title: 'Close',
        icon: '/assets/images/ui/star.svg'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification('StartAnime', options)
  );
});

// Notification click handling
self.addEventListener('notificationclick', (event) => {
  console.log('Service Worker: Notification clicked', event.action);
  
  event.notification.close();

  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/recommend.html')
    );
  }
});

// Message handling
self.addEventListener('message', (event) => {
  console.log('Service Worker: Message received', event.data);
  
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'CACHE_URLS') {
    event.waitUntil(
      caches.open(DYNAMIC_CACHE)
        .then((cache) => {
          return cache.addAll(event.data.urls);
        })
    );
  }
  
  if (event.data && event.data.type === 'DELETE_CACHE') {
    event.waitUntil(
      caches.delete(event.data.cacheName)
    );
  }
});

// Utility functions for background sync
async function getPendingActions() {
  // This would typically use IndexedDB
  // For now, return empty array
  return [];
}

async function processPendingAction(action) {
  // Process pending action (e.g., save user preferences, sync data)
  console.log('Service Worker: Processing action', action);
}

async function removePendingAction(actionId) {
  // Remove processed action from storage
  console.log('Service Worker: Removing action', actionId);
}

// Cache management utilities
async function clearOldCaches() {
  const cacheNames = await caches.keys();
  const oldCaches = cacheNames.filter(name => 
    name !== STATIC_CACHE && 
    name !== DYNAMIC_CACHE && 
    name !== IMAGE_CACHE
  );
  
  return Promise.all(
    oldCaches.map(name => caches.delete(name))
  );
}

async function getCacheSize(cacheName) {
  const cache = await caches.open(cacheName);
  const keys = await cache.keys();
  let size = 0;
  
  for (const request of keys) {
    const response = await cache.match(request);
    if (response) {
      const blob = await response.blob();
      size += blob.size;
    }
  }
  
  return size;
}

// Performance monitoring
self.addEventListener('fetch', (event) => {
  const startTime = performance.now();
  
  event.waitUntil(
    event.response.then((response) => {
      const endTime = performance.now();
      const duration = endTime - startTime;
      
      // Log slow requests
      if (duration > 1000) {
        console.warn('Service Worker: Slow request detected', {
          url: event.request.url,
          duration: duration
        });
      }
    })
  );
});

// Error handling
self.addEventListener('error', (event) => {
  console.error('Service Worker: Error occurred', event.error);
});

self.addEventListener('unhandledrejection', (event) => {
  console.error('Service Worker: Unhandled promise rejection', event.reason);
});

// Install prompt handling
self.addEventListener('beforeinstallprompt', (event) => {
  console.log('Service Worker: Install prompt available');
  // Store the event for later use
  self.deferredPrompt = event;
});

// App installed event
self.addEventListener('appinstalled', (event) => {
  console.log('Service Worker: App installed');
  // Clear the deferred prompt
  self.deferredPrompt = null;
});

// App update available
self.addEventListener('updatefound', (event) => {
  console.log('Service Worker: Update found');
  const newWorker = event.target.installing;
  
  newWorker.addEventListener('statechange', () => {
    if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
      console.log('Service Worker: New version available');
      // Notify the client about the update
      self.clients.matchAll().then(clients => {
        clients.forEach(client => {
          client.postMessage({
            type: 'UPDATE_AVAILABLE'
          });
        });
      });
    }
  });
});

// Service worker update
self.addEventListener('controllerchange', (event) => {
  console.log('Service Worker: Controller changed');
  // Reload the page to use the new service worker
  self.clients.matchAll().then(clients => {
    clients.forEach(client => {
      client.postMessage({
        type: 'RELOAD_PAGE'
      });
    });
  });
}); 