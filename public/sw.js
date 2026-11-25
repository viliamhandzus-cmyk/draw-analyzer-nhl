self.addEventListener('fetch',e=>{if(new URL(e.request.url).pathname.startsWith('/api/'))return;e.respondWith(fetch(e.request).catch(()=>new Response('Offline',{status:503})));});
