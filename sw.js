// sw.js faylini mana bunga almashtiring (Xavfsizroq va kengroq versiya)
const CACHE_NAME = 'dexo-market-v2';

self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((cachedResponse) => {
            // Agar fayl xotirada bo'lsa, uni qaytaramiz
            if (cachedResponse) {
                return cachedResponse;
            }
            // Aks holda internetdan olamiz va kelajak uchun saqlab qo'yamiz
            return fetch(event.request).then((response) => {
                if (event.request.method === 'GET' && response.status === 200) {
                    const responseClone = response.clone();
                    caches.open(CACHE_NAME).then((cache) => {
                        cache.put(event.request, responseClone);
                    });
                }
                return response;
            });
        }).catch(() => {
            // Internet ham yo'q, xotirada ham yo'q bo'lsa
            console.log('Faylni yuklab bo‘lmadi');
        })
    );
});
