# ESM Live Viewer — Architecture Document

## 1. System Overview

**ESM Live Viewer** is a client-only Progressive Web Application (PWA) that provides real-time telemetry visualization for endurance racing events. It receives live race data through a secure WebSocket connection and renders adaptive layouts based on the client device.

### 1.1 Architectural Style

- **Pattern**: Single-Page Application (SPA) with functional rendering
- **Communication**: WebSocket (WSS) for real-time push from server
- **Build**: Zero-build architecture — no bundler, no transpiler, no framework
- **Deployment**: Static files served via Render (Docker) or GitHub Pages

### 1.2 External Dependencies

| Dependency | Type | URL |
|---|---|---|
| ESM Backend | WebSocket server | `wss://esm-live.onrender.com/ws` |
| Render Platform | Hosting | `esm-live.onrender.com` |
| GitHub Pages | Alternative hosting | `gersonfer.github.io/esm-pwa/` |

---

## 2. File Structure

```
esm-live-pwa/
├── index.html          # Application entry point (HTML shell + all JS logic + SW registration)
├── styles.css          # Global stylesheet (CSS variables, desktop grid, mobile carousel, components)
├── sw.js               # Service Worker (cache management, network-first strategy)
├── manifest.json       # Web App Manifest (PWA installability config)
├── fallback.html       # Offline fallback page (self-contained, no external deps)
├── render.yaml         # Render.com infrastructure-as-code deployment config
├── assets/
│   ├── icon-192.png    # PWA icon 192×192
│   └── icon-512.png    # PWA icon 512×512
└── docs/               # Supplemental documentation
```

---

## 3. Component Architecture

### 3.1 Application Shell (`index.html`)

The single HTML file serves three distinct roles:

1. **DOM skeleton** — `<header>` (title, track badge, timer), `<div id="main">` (content area), `<div id="dots">` (carousel indicators)
2. **Application logic** — all JavaScript inside an IIFE
3. **Service Worker registration** — separate `<script>` block handling SW lifecycle

#### 3.1.1 DOM Structure

```
<body>
  <header>
    <span>
      🏁 ESM Live Viewer
      <span id="track-badge"></span>   ← dynamically shown/hidden
    </span>
    <span id="timer">--:--:--</span>    ← countdown with dynamic border color
  </header>

  <div id="main"></div>                 ← teams/drivers rendered here
  <div id="dots"></div>                 ← mobile carousel dot indicators
</body>
```

### 3.2 Application Logic (IIFE in `index.html`)

All logic is encapsulated in an Immediately Invoked Function Expression to avoid global scope pollution.

#### 3.2.1 Utility Functions

| Function | Purpose |
|---|---|
| `$` | Shorthand: `q => document.querySelector(q)` |
| `isMobile()` | Device detection via `(pointer: coarse)` or `innerWidth < 900` |
| `formatTime(sec)` | Converts seconds to `HH:MM:SS` format |
| `fmt(sec)` | Alias of `formatTime` — used in driver meta display |
| `stars(category)` | Maps team category to star string: `LIGHT→★☆☆☆`, `AM→★★☆☆`, `PRO-AM→★★★☆`, `PRO→★★★★` |
| `medals(skill)` | Maps driver skill to medal string: `platinum→●●●●`, `gold→●●●○`, `silver→●●○○`, `bronze→●○○○` |
| `updateTrackBadge(name)` | Shows/hides the track name badge in the header |
| `setTimerBorder(status)` | Applies color-coded border to timer based on race status |

#### 3.2.2 Timer Border Color Logic

```
race_status contains "running"   → Green  (var(--ok))
race_status == "paused"          → Yellow (var(--warn))
race_status contains "over"/"finish" → Red (var(--alert))
unknown status                   → Accent (var(--accent))
```

#### 3.2.3 Driver Card Renderer (`renderDriverCard`)

This is the most complex rendering function. It produces the HTML for a single driver within a team card.

**Inputs**: A driver data object with fields: `name`, `skill`, `stint_duration_sec`, `stint_left_sec`, `check_in`, `position_time_sec`.

**Computed Values**:

- **Stint progress percentage**: `pct = round(100 * (done / total))`, clamped to [0, 100]
- **Progress bar color**: `var(--ok)` green if checked in, `var(--alert)` red otherwise
- **Row opacity**: `1.0` if checked in, `0.7` if not

**Stint Time Urgency (checked-in drivers only)**:

| Stint Remaining | Background | Border | Text Color |
|---|---|---|---|
| `< 60s` | `#ff0000` (red) | `#000` (black) | `#000` (black) |
| `< 120s` | `#ff0000` (red) | `#ffcc00` (yellow) | `#000` (black) |
| `< 300s` | `#ffcc00` (yellow) | `#e74c3c` (red) | `#000` (black) |
| `≥ 300s` | transparent | `var(--warn)` | `var(--text)` |

**Name color urgency (non-checked-in drivers)**:

| Stint Remaining | Color |
|---|---|
| `< 120s` | `var(--alert)` (red) |
| `< 300s` | `var(--warn)` (yellow) |
| `≥ 300s` | `var(--text)` (white) |

**Position Timer** (displayed only when `check_in === true` and `position_time_sec` is a number):

- **Badge**: `⏱ Xs` shown inline with driver name
- **Color thresholds**:
  - `≤ 40s`: Cyan `#00ffff` (good)
  - `41–50s`: Yellow `#ffff00` (warning)
  - `> 50s`: Red `#ff0000` (critical)
- **Progress bar**: fills proportionally to `(position_time_sec / 60) * 100`, capped at 100%
- **Text shadow**: neon glow effect on non-dark backgrounds; disabled on dark text for readability
- **Animation**: `pulse-text` keyframes — 1s infinite alternate pulse

**Output HTML structure**:

```html
<div class="driver-row" style="[boxStyle] opacity:[opacity]">
  <div class="driver-name">
    <span style="[color]">
      [name]
      <span class="medals">[medals]</span>
      [posHtml – position badge, if applicable]
    </span>
    <span style="[pctBlack]">[pct]%</span>
  </div>
  <div class="progress">
    <div class="progress-bar" style="width:[pct]%; background:[progressColor]"></div>
  </div>
  [posBarHtml – position progress bar, if applicable]
  <div class="driver-meta">
    <span>[elapsed] / [remaining]</span>
  </div>
</div>
```

### 3.3 Layout Renderers

#### 3.3.1 Desktop Renderer (`renderDesktop`)

- **Container**: `<div id="grid">` — CSS Grid layout
- **Grid config**: `grid-template-columns: repeat(auto-fill, minmax(320px, 1fr))`
- **Cards**: Each team is a `.card-desktop` element with team-colored border
- **Deck state**: Teams with `deck: true` receive `.deck-active` class (darker background)
- **Scroll behavior**: native vertical scroll on `#grid`

```html
<div id="grid">
  <div class="card-desktop [deck-active]" style="border-color:[team.color]">
    <h3>[team_name] <span class="team-stars">[stars]</span></h3>
    [driver cards...]
  </div>
  ...
</div>
```

#### 3.3.2 Mobile Renderer (`renderMobile`)

- **Container**: `<div id="carousel">` — flex container with horizontal scroll
- **Scroll snap**: `scroll-snap-type: x mandatory` for card-by-card snapping
- **Card sizing**: `flex: 0 0 100%` (full width in portrait), `flex: 0 0 50%` (landscape via media query)
- **Dot indicators**: rendered in `#dots`, synced with `activeCardIndex` on scroll
- **Scroll preservation**: restores `scrollLeft` position after re-render to prevent jump

```html
<div id="carousel">
  <div class="carousel-card" style="border-color:[team.color]">
    <h3>[team_name] <span class="team-stars">[stars]</span></h3>
    [driver cards...]
  </div>
  ...
</div>
```

#### 3.3.3 Render Orchestration (`render`)

Called on every WebSocket message (excluding `hello` type):

1. Updates `#timer` text via `formatTime(data.race_left_sec)`
2. Applies border color via `setTimerBorder(data.race_status)`
3. Updates track badge via `updateTrackBadge(data.track_name)`
4. Routes to `renderMobile` or `renderDesktop` based on `isMobile()`

**Initial state**: renders empty state (`{race_left_sec: 0, teams: []}`) before first WebSocket message.

### 3.4 WebSocket Client (`connect`)

```
connect()
  └─► new WebSocket("wss://esm-live.onrender.com/ws")
       ├─► onmessage → JSON.parse → filter "hello" → render(data)
       └─► onclose → setTimeout(connect, 1000)  [auto-reconnect]
```

**Behavior**:
- Establishes a persistent WebSocket to the ESM backend
- Parses incoming JSON messages
- Ignores messages where `type === "hello"` (server heartbeat/ack)
- On connection loss, auto-reconnects after 1 second
- Error handling: silent `try/catch` — malformed JSON is discarded

### 3.5 Service Worker Registration (in `index.html`)

The second `<script>` block handles SW registration with aggressive update logic:

```
if "serviceWorker" in navigator
  └─► register("./sw.js")
       ├─► if reg.waiting → postMessage("SKIP_WAITING")
       ├─► on "updatefound"
       │    └─► on state "installed" → postMessage("SKIP_WAITING")
       └─► on "controllerchange" → window.location.reload()
```

**Key behaviors**:
- Immediately activates any waiting worker via `SKIP_WAITING`
- Forces reload of the page when a new SW takes control
- Ensures zero-delay updates to the application

---

## 4. Styling System (`styles.css`)

### 4.1 Design Tokens (CSS Custom Properties)

```css
:root {
  --bg:         #0f1115;   /* Page background */
  --card:       #161a20;   /* Default team card background */
  --card-deck:  #2e333a;   /* Active/deck team card background */
  --accent:     #ffcc00;   /* Primary accent (yellow) */
  --text:       #f6f6f6;   /* Primary text */
  --muted:      #bbb;      /* Secondary text */
  --ok:         #2ecc71;   /* Success / running status */
  --alert:      #e74c3c;   /* Error / critical status */
  --warn:       #f1c40f;   /* Warning / paused status */
}
```

### 4.2 Layout Systems

#### Desktop Grid (`#grid`)

- **Type**: CSS Grid with `auto-fill`
- **Column sizing**: `minmax(320px, 1fr)` — cards expand to fill available space
- **Row sizing**: `grid-auto-rows: 1fr` — equal-height rows
- **Spacing**: `.8vw` gap and padding (scales with viewport)
- **Overflow**: vertical scroll within the grid container

#### Mobile Carousel (`#carousel`)

- **Type**: Flexbox with horizontal scroll
- **Snap**: `scroll-snap-type: x mandatory` for card-aligned scrolling
- **Card width**: 100% in portrait, 50% in landscape
- **Smooth scrolling**: `-webkit-overflow-scrolling: touch`
- **Overflow**: `overflow-x: auto`, `overflow-y: hidden`

### 4.3 Component Styles

| Component | Class | Key Properties |
|---|---|---|
| Header | `header` | Flex row, space-between, semi-transparent background |
| Track badge | `#track-badge` | Inline-block, accent background, hidden by default |
| Timer | `#timer` | Monospace font, 3px accent border, rounded |
| Team card (desktop) | `.card-desktop` | Card background, 5px transparent border, shadow |
| Team card (deck) | `.card-desktop.deck-active` | Darker background (`--card-deck`) |
| Team card (mobile) | `.carousel-card` | Card background, 12px border radius, 5px border |
| Driver row | `.driver-row` | Bottom margin, dynamic background/border (urgency) |
| Progress bar container | `.progress` | Full width, 0.5rem height, rounded, dark background |
| Progress bar fill | `.progress-bar` | Width animates with 0.4s linear transition |
| Position badge | `.pos-badge` | Pulsing animation, semi-transparent background |
| Position bar | `.pos-bar-container` / `.pos-bar-fill` | 8px height, gray background, color fill with transition |
| Carousel dots | `.dot` / `.dot.active` | 10px circles, inactive gray → active accent with scale |

### 4.4 Animations

**`pulse-text`** (position timer):
```css
@keyframes pulse-text {
  from { opacity: 0.8; transform: scale(1); }
  to   { opacity: 1;   transform: scale(1.05); text-shadow: 0 0 8px currentColor; }
}
```
Applied to `.pos-badge` with `1s infinite alternate` timing.

---

## 5. Service Worker Architecture (`sw.js`)

### 5.1 Cache Configuration

```js
const CACHE_NAME = "esm-cache-v1";

const ASSETS_TO_CACHE = [
  "./manifest.json",
  "./ui/js/main.js",      // Note: path does not exist in current project
  "./ui/js/i18n.js",      // Note: path does not exist in current project
  "./styles.css",
  "./fallback.html"
];
```

> **Note**: `./ui/js/main.js` and `./ui/js/i18n.js` are stale entries — these paths do not exist in the current project structure. They fail silently during `cache.addAll()`.

### 5.2 Lifecycle Events

#### Install

- Calls `self.skipWaiting()` for immediate promotion to active state
- Caches all entries in `ASSETS_TO_CACHE`
- Does **not** cache `index.html` — intentional to prevent stale content

#### Activate

- Deletes all caches whose name differs from `CACHE_NAME`
- Calls `self.clients.claim()` to immediately take control of all open pages

#### Message

- Listens for `{ type: "SKIP_WAITING" }` from the main page
- Calls `self.skipWaiting()` to bypass the waiting phase

### 5.3 Fetch Strategy

Two-tier strategy based on request URL:

| Resource Pattern | Strategy | Behavior |
|---|---|---|
| `/` or `index.html` | **Network-only** | Always fetches from network. On failure, serves `./fallback.html` from cache |
| All other requests | **Network-first, cache-on-success** | Fetches from network, updates cache with fresh response. Falls back to cached version on network failure |

```
Fetch Event
  ├─► URL is "/" or ends with "index.html"
  │    └─► fetch(req) → on error → caches.match("./fallback.html")
  │
  └─► All other URLs
       ├─► fetch(req) → clone response → cache.put(req, clone) → return response
       └─► on network error → caches.match(req) → return cached or undefined
```

### 5.4 Caching Strategy Summary

| Asset | Strategy | Cached? | Always Fresh? |
|---|---|---|---|
| `index.html` | Network-only | No | Yes — always from network |
| `styles.css` | Network-first | Yes | Yes — updated on each successful fetch |
| `manifest.json` | Network-first | Yes | Yes |
| `fallback.html` | Cache-only (install-time) | Yes | No — served only on offline |
| PWA icons | Network-first | Yes | Yes |
| WebSocket data | Not intercepted | N/A | WebSocket bypasses SW fetch |

---

## 6. PWA Manifest (`manifest.json`)

```json
{
  "name": "ESM Live Viewer",
  "short_name": "ESM Viewer",
  "start_url": "/esm-pwa/?theme=auto",
  "scope": "/esm-pwa/",
  "display": "standalone",
  "background_color": "#10141a",
  "theme_color": "#10141a",
  "icons": [
    { "src": "assets/icon-192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "assets/icon-512.png", "sizes": "512x512", "type": "image/png" }
  ]
}
```

### Key Configuration

| Field | Value | Effect |
|---|---|---|
| `start_url` | `/esm-pwa/?theme=auto` | Opens app under `/esm-pwa/` path with theme hint |
| `scope` | `/esm-pwa/` | PWA controls all URLs under this path |
| `display` | `standalone` | Runs without browser chrome (app-like) |
| `theme_color` | `#10141a` | Sets mobile status bar color |

---

## 7. Offline Fallback (`fallback.html`)

A self-contained HTML page displayed when the user is offline and `index.html` cannot be fetched.

### Structure

- **Self-contained**: all CSS is inline, no external dependencies
- **Responsive**: adapts to any screen size
- **Theme-aware**: uses `prefers-color-scheme` media query for light/dark mode
- **Content**: racing flag emoji, "Sem Conexão" heading, explanatory text, retry button

### Retry Behavior

The retry button calls `location.reload()`, which triggers the Service Worker's fetch handler to attempt a network fetch of `index.html` again.

---

## 8. Data Model

### 8.1 WebSocket Message Schema

The application expects JSON objects with this structure:

```typescript
interface RaceData {
  race_left_sec: number;       // Seconds remaining in the race
  race_status: string;          // "running" | "paused" | "finished" | etc.
  track_name: string;           // Name of the current track (optional)
  teams: Team[];
}

interface Team {
  team_name: string;            // Display name of the team
  color: string;                // Hex color code for border branding
  category: string;             // "LIGHT" | "AM" | "PRO-AM" | "PRO"
  deck: boolean;                // Whether team is currently active/priority
  drivers: Driver[];
}

interface Driver {
  name: string;                 // Driver display name
  skill: string;                // "platinum" | "gold" | "silver" | "bronze"
  stint_duration_sec: number;   // Total planned stint duration
  stint_left_sec: number;       // Seconds remaining in current stint
  check_in: boolean;            // Whether driver has checked into session
  position_time_sec: number;    // Current lap/position time in seconds (optional)
}
```

### 8.2 Message Filtering

- Messages with `type === "hello"` are **ignored** (server connection acknowledgment)
- All other messages are parsed and passed to the `render()` function
- Malformed JSON is silently discarded via `try/catch`

---

## 9. Runtime Flow

### 9.1 Page Load Sequence

```
1. Browser loads index.html
2. <head> loads manifest.json and styles.css
3. <body> renders static header structure
4. IIFE script executes:
   a. Renders initial empty state (timer="--:--:--", no teams)
   b. Calls connect() → opens WebSocket
5. Service Worker registration script executes:
   a. Registers sw.js
   b. If a waiting SW exists, sends SKIP_WAITING
   c. Sets up controllerchange → reload listener
6. WebSocket receives first data message → render() populates UI
7. Subsequent WebSocket messages trigger incremental re-renders
```

### 9.2 Re-render Cycle

```
WebSocket message received
  └─► JSON parse
       └─► type !== "hello"?
            ├─► Yes → render(data)
            │         ├─► Update #timer text
            │         ├─► Update timer border color
            │         ├─► Update track badge
            │         └─► isMobile()?
            │              ├─► Yes → renderMobile()
            │              │         ├─► Rebuild #carousel HTML
            │              │         ├─► Restore scrollLeft
            │              │         └─► Update #dots + attach scroll listener
            │              └─► No  → renderDesktop()
            │                        └─► Rebuild #grid HTML
            └─► No  → ignore (hello/heartbeat)
```

### 9.3 Service Worker Update Flow

```
Browser detects new sw.js
  └─► SW installs as "waiting" worker
       └─► Main page detects reg.waiting → sends SKIP_WAITING
            └─► Waiting worker calls skipWaiting() → becomes "active"
                 └─► Active worker claims clients → "controllerchange" fires
                      └─► Main page reloads → fresh index.html from network
```

---

## 10. Deployment Architecture

### 10.1 Render Configuration (`render.yaml`)

```yaml
services:
  - type: web
    name: esm-live
    env: docker
    repo: https://github.com/gersonfer/esm-pwa
    plan: free
    branch: main
    healthCheckPath: /health
    envVars:
      - key: PORT
        value: 8080
```

| Property | Value | Notes |
|---|---|---|
| Type | `web` | Publicly accessible HTTP service |
| Env | `docker` | Expects a Dockerfile in the repo |
| Branch | `main` | Deploys on every push to main |
| Health check | `/health` | Render pings this endpoint |
| Plan | `free` | Subject to Render free tier spin-down |

### 10.2 GitHub Pages

- Static deployment — files served directly from the `main` branch
- URL: `https://gersonfer.github.io/esm-pwa/`
- No server-side component required

---

## 11. Design Patterns & Conventions

### 11.1 IIFE Encapsulation

All application logic is wrapped in `(function(){ ... })()` to:
- Avoid polluting the global `window` namespace
- Prevent naming collisions with other scripts
- Create a private scope for variables and functions

### 11.2 DOM Query Shorthand

```js
const $ = q => document.querySelector(q);
```

A minimal abstraction over `document.querySelector` for brevity.

### 11.3 Functional Rendering

- **Pure functions**: `renderDriverCard(d)`, `renderDesktop(data)`, `renderMobile(data)` take data and return HTML strings
- **No state management**: data flows one-way (WebSocket → render → DOM)
- **Full re-render on every message**: entire `#main` innerHTML is replaced each time
- **No DOM diffing**: no virtual DOM, no patching — brute-force replacement

### 11.4 CSS Architecture

- **Design tokens**: all static colors defined as CSS variables in `:root`
- **Data-driven colors**: dynamic values (team borders, driver urgency, position timer) applied via inline `style` attributes
- **Component classes**: reusable class names for structural elements (`.driver-row`, `.progress`, `.pos-badge`)
- **No CSS preprocessing**: plain CSS, no Sass/Less

### 11.5 Error Handling

- **WebSocket**: silent `try/catch` around JSON parsing — malformed messages are discarded
- **Auto-reconnect**: 1-second delay on connection close, infinite retry loop
- **Offline**: `fallback.html` served from cache when network unavailable
- **No user-facing error states**: no retry UI in the main app (only in fallback page)

---

## 12. Performance Characteristics

### 12.1 Strengths

| Aspect | Detail |
|---|---|
| **Zero bundle size** | No frameworks, no build — raw HTML/JS/CSS is < 20KB |
| **Fast initial paint** | Static HTML renders immediately before JS executes |
| **Efficient caching** | `index.html` always fresh, static assets cached with network-first |
| **No build complexity** | Deploy is a `git push` — no CI/CD pipeline needed |

### 12.2 Bottlenecks

| Issue | Impact |
|---|---|
| **Full DOM replacement on every message** | Creates and destroys all DOM nodes each render cycle; can cause flicker on rapid updates |
| **No message throttling/debouncing** | If the server sends messages faster than the browser can render, redundant work accumulates |
| **Scroll position loss on desktop** | Desktop grid re-render resets scroll position entirely |
| **Mobile scroll restoration is approximate** | `scrollLeft` is restored after innerHTML replacement, but exact pixel position may drift |
| **Stale cache entries** | `ASSETS_TO_CACHE` references non-existent paths (`./ui/js/main.js`, `./ui/js/i18n.js`) — fail silently but add noise |
| **No connection reuse** | WebSocket reopens on every reconnect without exponential backoff |

---

## 13. Known Stale References

The following entries in `sw.js` reference files that do not exist in the project:

```js
const ASSETS_TO_CACHE = [
  "./manifest.json",
  "./ui/js/main.js",   // ← Does not exist
  "./ui/js/i18n.js",   // ← Does not exist
  "./styles.css",
  "./fallback.html"
];
```

These fail silently during `cache.addAll()` and do not break functionality.

---

## 14. Glossary

| Term | Definition |
|---|---|
| **Stint** | A continuous driving period by a single driver in an endurance race |
| **Check-in** | Driver confirmation that they are ready to enter the track |
| **Deck** | A team that is next in line for track time (priority/active status) |
| **Position Time** | Lap or sector time — lower is better |
| **Category** | Team classification: LIGHT, AM, PRO-AM, PRO |
| **Skill Tier** | Driver classification: bronze, silver, gold, platinum |
| **SW** | Service Worker — background script enabling offline support and caching |
| **PWA** | Progressive Web Application — web app with native app-like capabilities |
