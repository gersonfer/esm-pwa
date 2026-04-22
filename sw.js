const CACHE_NAME = "esm-cache-v2";

// Apenas arquivos seguros (estáticos)
const ASSETS_TO_CACHE = [
  "./styles.css",
  "./fallback.html"
];

// Permite atualizar o SW imediatamente
self.addEventListener("message", event => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});

// INSTALL (robusto — não quebra se um asset falhar)
self.addEventListener("install", event => {
  self.skipWaiting();

  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_NAME);

      for (const asset of ASSETS_TO_CACHE) {
        try {
          await cache.add(asset);
        } catch (err) {
          console.warn("SW cache failed:", asset, err);
        }
      }
    })()
  );
});

// ACTIVATE — limpa versões antigas
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
      )
    )
  );

  self.clients.claim();
});

// FETCH — estratégia segura para PWA + WebSocket

self.addEventListener("fetch", event => {
  const req = event.request;
  const url = new URL(req.url);

  // ❗ NÃO INTERFERIR com WebSocket
  if (req.headers.get("upgrade") === "websocket") {
    return;
  }

  // ❗ Nunca cachear HTML (evita travar deploy)
  if (url.pathname === "/" || url.pathname.endsWith("index.html")) {
    event.respondWith(
      fetch(req).catch(() => caches.match("./fallback.html"))
    );
    return;
  }

  // 🔁 Network-first para assets
  event.respondWith(
    fetch(req)
      .then(res => {
        const copy = res.clone();

        caches.open(CACHE_NAME).then(cache => {
          cache.put(req, copy);
        });

        return res;
      })
      .catch(() => caches.match(req))
  );
});