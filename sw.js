const CACHE_NAME = "esm-cache-v1";

// Arquivos que PODEM ser cacheados (NÃO incluir index.html!)
const ASSETS_TO_CACHE = [
  "./manifest.json",
  "./ui/js/main.js",
  "./ui/js/i18n.js",
  "./styles.css"
];

// INSTALL — só faz cache dos assets listados (NÃO cacheia index.html)
self.addEventListener("install", event => {
  self.skipWaiting(); // ativa imediatamente
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS_TO_CACHE))
  );
});

// ACTIVATE — limpa TODO cache antigo
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim(); // SW atual domina imediatamente
});

// FETCH — regra inteligente:
// • index.html e "/" → SEMPRE DA REDE (sem cache)
// • arquivos estáticos → "network first" com fallback no cache
self.addEventListener("fetch", event => {
  const req = event.request;
  const url = new URL(req.url);

  // Nunca cacheie o index.html (previne versão presa)
  if (url.pathname === "/" || url.pathname.endsWith("index.html")) {
    return event.respondWith(fetch(req).catch(() => caches.match("/fallback.html")));
  }

  // Para demais arquivos, use network-first
  event.respondWith(
    fetch(req)
      .then(res => {
        // atualiza cache em background
        return caches.open(CACHE_NAME).then(cache => {
          cache.put(req, res.clone());
          return res;
        });
      })
      .catch(() => caches.match(req)) // fallback
  );
});