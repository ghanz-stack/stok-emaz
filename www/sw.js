// SW Gudang Ibu NID v2 — NETWORK-FIRST (pola BudgetRumah)
const CACHE='g24kedaton-v21';
const ASSETS=['./','./index.html','./manifest.json','./firebase-config.js'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)).catch(()=>{}));self.skipWaiting()});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==CACHE).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{
  const req=e.request;if(req.method!=='GET')return;
  const url=new URL(req.url);
  if(url.origin!==self.location.origin)return; // Firebase/CDN biarkan ke jaringan
  const live=url.pathname.endsWith('firebase-config.js')||url.pathname.endsWith('manifest.json');
  if(req.mode==='navigate'||url.pathname.endsWith('.html')||live){
    e.respondWith(fetch(req).then(res=>{if(res&&res.status===200){const cp=res.clone();caches.open(CACHE).then(c=>c.put(req,cp)).catch(()=>{})}return res}).catch(()=>caches.match(req).then(r=>r||caches.match('./index.html'))));
    return;
  }
  e.respondWith(caches.match(req).then(r=>r||fetch(req).then(res=>{if(res&&res.status===200){const cp=res.clone();caches.open(CACHE).then(c=>c.put(req,cp)).catch(()=>{})}return res}).catch(()=>new Response('',{status:504}))));
});
