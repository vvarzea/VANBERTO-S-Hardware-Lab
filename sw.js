const CACHE='vanberto-hardware-lab-v3';
const CORE=['./','index.html','manifest.webmanifest','favicon.png','apple-touch-icon.png','icon-192.png','icon-512.png','libs/three.min.js','libs/jspdf.umd.min.js'];
const FONTS=['fonts/orbitron-latin-400-normal.woff2', 'fonts/orbitron-latin-600-normal.woff2', 'fonts/orbitron-latin-800-normal.woff2', 'fonts/orbitron-latin-900-normal.woff2', 'fonts/fira-code-latin-300-normal.woff2', 'fonts/fira-code-latin-400-normal.woff2', 'fonts/fira-code-latin-500-normal.woff2', 'fonts/rajdhani-latin-400-normal.woff2', 'fonts/rajdhani-latin-600-normal.woff2', 'fonts/rajdhani-latin-700-normal.woff2'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(async c=>{await c.addAll(CORE);await Promise.allSettled(FONTS.map(f=>c.add(f)));}).then(()=>self.skipWaiting()));});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(n=>n!==CACHE).map(n=>caches.delete(n)))).then(()=>self.clients.claim()));});
// Abre logo da cache e atualiza em segundo plano. Só ficheiros do próprio jogo (fontes incluídas).
self.addEventListener('fetch',e=>{
  const r=e.request;
  if(r.method!=='GET'||new URL(r.url).origin!==location.origin)return;
  e.respondWith(caches.open(CACHE).then(c=>c.match(r,{ignoreSearch:true}).then(hit=>{
    const net=fetch(r).then(res=>{if(res.ok)c.put(r,res.clone());return res;}).catch(()=>hit);
    return hit||net;
  })));
});
