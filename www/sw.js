// Service worker Stok Emas Gudang Ibu NID
//
// POLICI: NETWORK-FIRST untuk request navigasi (index.html)
//         Cache-first untuk asset statis (CSS, JS, Gambar)
//         Cross-origin requests (Firebase, gstatic) dilepaskan ke jaringan murni
//
// Tujuan: Selalu dapat versi terbaru index.html => session selalu fresh
//         => User otomatis lepas dari versi lama tanpa hard refresh manual.

const CACHE = 'stok-emas-gid-v1';

const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './vendor/xlsx.full.min.js',
  './vendor/jspdf.umd.min.js',
  './vendor/jspdf-autotable.min.js',
  // Gambar & font akan di-cache secara dinamis
];

self.addEventListener('install', e=>{
  e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate', e=>{
  e.waitUntil(
    caches.keys()
      .then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k))))
      .then(()=>self.clients.claim())
  );
});

self.addEventListener('fetch', e=>{
  const req = e.request;
  const url = new URL(req.url);

  // 1) Cross-origin requests (Firebase, gstatic, CDN) - selalu ke jaringan
  if (url.origin !== self.location.origin) {
    // Biarkan ke jaringan tanpa disentuh cache kita
    return;
  }

  // 2) Request navigasi (index.html) - NETWORK-FIRST
  if (req.mode === 'navigate' || url.pathname.endsWith('.html')) {
    e.respondWith(
      fetch(req).then(res=>{
        // Cache the fresh response untuk request selanjutnya
        if (res && res.status === 200 && res.type !== 'opaque') {
          const copy = res.clone();
          caches.open(CACHE).then(c=>c.put(req, copy)).catch(()=>{});
        }
        return res;
      }).catch(()=>{
        // Jika network gagal, coba cache
        return caches.match(req).then(r=>{
          if (r) return r;
          // Fallback ke index.html jika ada
          return caches.match('./index.html');
        });
      })
    );
    return;
  }

  // 3) Asset statis (CSS, JS, Gambar) - CACHE-FIRST
  e.respondWith(
    caches.match(req).then(r=>{
      if (r) return r;

      // Jika tidak ada di cache, ambil dari jaringan dan cache-kan
      return fetch(req).then(res=>{
        if (res && res.status === 200 && res.type !== 'opaque') {
          const copy = res.clone();
          caches.open(CACHE).then(c=>c.put(req, copy)).catch(()=>{});
        }
        return res;
      }).catch(()=>{
        // Offline & tidak ada cache
        if (req.destination === 'image') {
          return new Response('', {status: 504, statusText: 'Offline & not cached', headers: {'Content-Type': 'image/svg+xml'}});
        }
        return new Response('', {status: 504, statusText: 'Offline & not cached', headers: {'Content-Type': 'text/plain'}});
      });
    })
  );
});