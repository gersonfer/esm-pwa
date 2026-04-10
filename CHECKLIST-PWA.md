# ✅ Checklist de Atualização do PWA — ESM Live

Use esta checklist sempre que alterar o PWA, para garantir que o Safari, navegadores desktop e atalhos instalados no iOS recebam a versão nova corretamente.

---

## ✅ 1. Alterei HTML / CSS / JS dentro do `index.html`
- Ex: ajuste visual, mudança de texto, novos elementos, correções pequenas  
✅ **Ação:** aumentar a versão do cache no `sw.js`

```js
const CACHE_NAME = "esm-live-cache-vX";
```

✔️ Não precisa remover e reinstalar o PWA  
✔️ Safari atualiza sozinho após alguns segundos  
✔️ O PWA instalado baixa o novo cache ao abrir

---

## ✅ 2. Alterei o `sw.js` (Service Worker)
- Ex: mudou cache, adicionou arquivos, alterou fetch(), install(), activate()  
✅ **Ação obrigatória:** aumentar `CACHE_NAME`

❌ Não precisa remover o PWA  
⚠️ Se não mudar o nome do cache, o navegador não baixa a versão nova!

---

## ✅ 3. Alterei o `manifest.json`
- Ex: `start_url`, `scope`, `name`, `short_name`, `icons`  
✅ **Ação obrigatória:**
- Apagar o atalho PWA da Home do iOS
- Abrir no Safari → acessar a URL do PWA
- Instalar novamente

📌 O iOS mantém o manifest antigo se o atalho não for reinstalado.

---

## ✅ 4. Alterei imagens / ícones dentro de `assets/`
- Ex: logo nova, ícones diferentes  
✅ **Ação:** aumentar `CACHE_NAME`  
❌ Não precisa reinstalar o PWA

---

## ✅ 5. Quero forçar todos os usuários a receberem atualização
- Aumentar `CACHE_NAME`
- Fazer `git push`
- Usuário abre Safari e recebe a nova versão

Para garantir:
- iOS: botão "AA" → **Reload without content blockers**
- Mac: **Cmd + Shift + R**

---

## ✅ Versão mínima recomendada do `sw.js`

```js
const CACHE_NAME = "esm-live-cache-v5";

self.addEventListener("install", e => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll([
        "./",
        "./index.html",
        "./manifest.json",
        "./sw.js",
        "./assets/icon-192.png",
        "./assets/icon-512.png"
      ]);
    })
  );
});

self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(key => key !== CACHE_NAME)
            .map(key => caches.delete(key))
      )
    )
  );
});

self.addEventListener("fetch", e => {
  e.respondWith(
    caches.match(e.request).then(resp => resp || fetch(e.request))
  );
});
```

---

## ✅ Erro 404 ao abrir o PWA
- Verificar se o `manifest.json` contém:

```json
{
  "start_url": "/esm-pwa/",
  "scope": "/esm-pwa/"
}
```

Se mudar qualquer um dos dois → Reinstalar o PWA no iOS

---

## ✅ Tabela Resumo

| Alteração | Aumentar CACHE_NAME | Reinstalar PWA iOS |
|-----------|--------------------|-------------------|
| HTML / CSS / JS (index) | ✅ | ❌ |
| sw.js | ✅ | ❌ |
| manifest.json | ✅ | ✅ obrigatório |
| assets/ (ícones, imagens) | ✅ | ❌ |

---

✅ **Dica final:** Sempre que algo “não atualizar”, incremente o `CACHE_NAME`  
Ex: `"esm-live-cache-v6"`

---

📌 Arquivo recomendado para o repositório:  
`CHECKLIST-PWA.md`
