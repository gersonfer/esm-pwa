# 🏁 ESM Live Viewer (PWA)

**ESM Live Viewer** é uma aplicação **Progressive Web App (PWA)** responsiva e offline-ready, desenvolvida para exibir o status em tempo real das equipes e pilotos do **Endurance Slot Manager (ESM)**.

O sistema adapta automaticamente o layout de acordo com o dispositivo:

| Dispositivo | Layout exibido |
|--------------|----------------|
| 📱 **Mobile (retrato)** | Carrossel — uma equipe por tela, com swipe lateral |
| 📲 **Mobile (paisagem)** | Mini-telão — duas equipes lado a lado |
| 💻 **Desktop / TV** | Telão completo — todas as equipes simultaneamente |

---

## 🚀 Recursos principais

- 🕒 **Cronômetro global** (HH:MM:SS)
- 🎨 **14 cores contrastantes** nas bordas dos cards para fácil identificação das equipes
- 🔁 **Simulação automática** de progresso dos stints
- 📱 **Layout adaptativo** para qualquer tela
- ⚡ **PWA instalável e funcional offline**
- 💾 **Cache automático via Service Worker**
- 🌐 **Hospedagem simples via GitHub Pages**

---

## 📁 Estrutura do projeto

```
esm-pwa/
│
├── index.html          # Aplicação principal (HTML + JS + CSS)
├── manifest.json       # Configuração do PWA
├── sw.js               # Service Worker para cache offline
└── /assets/
    ├── icon-192.png
    └── icon-512.png
```

---

## 📲 Instalação no iPhone (iOS)

1. Abra o Safari e acesse:  
   👉 **https://gersonfer.github.io/esm-pwa/**
2. Toque em **Share → Add to Home Screen**.
3. Confirme o nome **ESM Live Viewer** e toque em **Add**.  
4. O app será adicionado à tela inicial e abrirá **fullscreen**, mesmo sem conexão com a internet.

---

## 🧠 Atualizações

Para atualizar o conteúdo do PWA:

```bash
git add .
git commit -m "Descrição da alteração"
git push
```

O GitHub Pages publicará automaticamente a nova versão (leva de 30 a 90 segundos).  
Se o navegador ainda exibir a versão antiga, abra a URL com o parâmetro de versão:

```
https://gersonfer.github.io/esm-pwa/?v=2
```

---

## 🧩 Deploy rápido

Comandos para enviar alterações ao GitHub Pages:

```bash
git add .
git commit -m "Atualização do ESM Live Viewer"
git push
```

Após o push, aguarde 1–2 minutos e acesse:  
👉 **https://gersonfer.github.io/esm-pwa/**

---

## 🛠️ Próximos passos

- 🔗 Conectar o frontend ao backend Rust (via Axum + WebSocket)
- 📊 Injetar dados reais do ESM em tempo real (substituindo a simulação)
- 🧩 Adicionar identificador de pista e modo de exibição (DG Espanha / DG Itália, etc.)

---

### 📜 Licença
Este projeto é distribuído sob a licença MIT.  
© 2025 Gerson Ferreira
