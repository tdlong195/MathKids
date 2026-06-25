const CACHE_NAME = 'mathkids-v1'
const RUNTIME_CACHE = 'mathkids-runtime'

// Files to cache on install
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/favicon.ico',
  '/manifest.json',
]

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(STATIC_ASSETS).catch(() => {
        // Fail gracefully if offline during install
        console.log('[SW] Some assets unavailable during install')
      })
    })
  )
  self.skipWaiting()
})

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME && cacheName !== RUNTIME_CACHE) {
            return caches.delete(cacheName)
          }
        })
      )
    })
  )
  self.clients.claim()
})

// Network-first, fallback to cache
self.addEventListener('fetch', event => {
  const { request } = event
  const url = new URL(request.url)

  // Skip cross-origin & API calls
  if (url.origin !== location.origin) {
    return
  }

  event.respondWith(
    fetch(request)
      .then(response => {
        // Cache successful responses
        if (response.status === 200) {
          const cache = caches.open(RUNTIME_CACHE)
          cache.then(c => c.put(request, response.clone()))
        }
        return response
      })
      .catch(() => {
        // Fall back to cache
        return caches.match(request).then(cached => {
          return cached || new Response('Offline - không có dữ liệu lưu trữ', {
            status: 503,
          })
        })
      })
  )
})
