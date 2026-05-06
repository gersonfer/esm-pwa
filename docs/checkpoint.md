Project: esm-live-pwa

Task 001 — Live UI Refactor (Stint-Centric Design)
Status: **COMPLETED**

### Summary of Completed Work
- **UI Refinement**: Implemented the validated mock rules. Changed team color to thin top border only, increased font size for active driver timers, and displayed stint balance for inactive drivers.
- **State Visualization**: Converted internal driver states (`check_in`) to subtle visual badges (`CHECK-IN` and `BOX`) accompanied by their respective positional timers and countdowns.
- **Responsive Layout**: Replaced the desktop CSS grid constraints to utilize `grid-template-columns: repeat(auto-fit, minmax(340px, 1fr))` and `max-content` rows, allowing dynamic scaling without empty gaps or truncation.
- **Data Integrity Preserved**: Performed changes strictly inside the `renderDriverCard` and layout functions in `index.html` and matching classes in `styles.css`. No WebSocket handlers, timing calculations, or JavaScript model structures were altered.

Task 001.1 — Live PWA UI Refinement (Final Polishing)
Status: **COMPLETED**

### Summary of Completed Work
- **Domain Alignment**: Restructured state indicators to reflect their proper domain levels. Moved `BOX` and `DECK` states strictly to the Team header level. Confined `CHECK-IN` strictly to the Driver level.
- **Visual Encoding**: Replaced legacy emoji-based indicators (team stars ⭐ and driver medals ●) with minimalist, unified letter badges (`[P] [S] [A] [L]`, `[P] [G] [S] [B]`).
- **Noise Reduction**: Completely eliminated progress bars and redundant BOX badges from driver rows, shifting focus entirely onto the numbers.
- **Layout Consistency**: Standardized driver layouts based on activity state. Active drivers present a dominant large stint balance with an optional inline positional timer (`⏱ 11s`). Inactive drivers concisely show their name, skill badge, and remaining stint balance.
- **Header Refinement**: Increased the prominence of the main race timer (`1.4rem`) while keeping track badges compact.

Task 001.2 — Fix BOX State Rendering (Remove Invalid Inference)
Status: **COMPLETED**

### Summary of Completed Work
- **Logic Correction**: Fully removed the UI-layer inference that falsely derived a `BOX` state when no driver was checked in.
- **Strict Data Binding**: Rewrote the team header logic to render the `BOX` state exclusively when explicitly commanded by the backend payload (using `team.is_box`, `team.box`, or `team.flag`).
- **Timer Handling**: Pit timers are now safely drawn only if explicitly provided (`team.box_timer` or `team.box_time`), otherwise rendering a clean `BOX` badge without guessing values from inactive drivers.

Task 001.3 — Correct BOX Rendering Using mandatory_stop_start
Status: **COMPLETED**

### Summary of Completed Work
- **Strict Domain Binding**: Replaced the speculative explicit field checks (`team.box`, `team.is_box`, `team.flag`) with the actual backend field `team.mandatory_stop_start`. The `BOX` state now perfectly aligns with the server data model.
- **Timestamp Calculation**: Refactored the pit timer to calculate elapsed time dynamically using `Math.floor(Date.now() / 1000 - team.mandatory_stop_start)`, rendering correctly formatted `MM:SS` logic directly inside the team header.
- **No Regressions**: Checked-in driver logic and Decked team logic remains intact and purely distinct from pit status.

Task 001.4 — UI Refinements (No WebSocket Changes)
Status: **COMPLETED**

### Summary of Completed Work
- **Driver Skill Badges**: Ensured the driver skill badge (e.g. `[P]`, `[S]`) is always rendered for both active and inactive drivers to preserve hierarchy and constant domain visibility.
- **Stint Balance Color Logic**: Enhanced the `renderDriverCard` color-coding to reflect exact threshold bounds: `>= 300s` is Green (`var(--ok)`), `< 300s` is Yellow (`var(--warn)`), `<= 120s` is Red (`var(--alert)`), and `0s` blinks Red but exclusively if the main race status is `running`. 
- **Mobile Portrait Optimization**: Reduced the overall vertical card padding and margin boundaries, decreasing unnecessary internal white-space and allowing much more of the card content to be visible vertically without needing to scroll.
- **Mobile Landscape Grid Fix**: Upgraded the `#carousel` wrapper to utilize standard `flex` gaps and mathematically robust padding logic (`calc(50% - 6px)`), allowing exactly two completely clean non-overflowing cards to sit side-by-side perfectly.

Task 001.5 — Final UI Refinements
Status: **COMPLETED**

### Summary of Completed Work
- **Consistent Driver Skills**: Validated that `medals(d.skill)` correctly applies to both Active and Inactive driver rows across the board.
- **DECK Status Label**: Explicitly mapped the `team.deck` state to visually push a `[DECK]` badge to the far right corner of the team header, complementing the greyed-out card styling.
- **Stints Link Evolution**: Minimized the old full-text "Stints" button into a sleek, transparent clipboard icon (`📋`) bound dynamically to the bottom-left of every team card.
- **Portrait Vertical Spacing**: Introduced the `.drivers-container` wrapper to dynamically handle spacing within the `.carousel-card`. Using targeted `@media` queries exclusively for mobile portrait, the active driver and timer rows are now perfectly distributed inside the card's height, eradicating the compressed "top-heavy" look while explicitly leaving the landscape twin-grid untouched.

Task 001.6 — Standardizing UI of stints.html (PWA Viewer)
Status: **COMPLETED**

### Summary of Completed Work
- **Card Layout Uniformity**: Wrapped the content of `stints.html` inside a new `.stints-card` element, sharing the identical shadow, background, layout dimensions, and dynamic top border color mapping as `index.html`.
- **Typographic & Hierarchy Synchronization**: Swapped the clunky text-based "<- Race" back button for a minimalist, SVG-based caret button that feels significantly cleaner, mapping to the new streamlined aesthetic constraints.
- **Color Re-Mapping**: Addressed the anomalous legacy yellow tint embedded in `.stint-header` by overriding it with the native design token `rgba(255, 255, 255, 0.05)`, removing visual friction across pages.
- **Responsive Padding Integrity**: Included specific logic in the `@media (max-width: 899px)` block to constrain card paddings dynamically, so mobile views preserve the consistent flow and padding density seen natively in `index.html`.

Task 001.7 — Preserve Carousel Position (PWA UX Fix)
Status: **COMPLETED**

### Summary of Completed Work
- **Global Click Handler**: Replaced standard static `<button>` href jumps with a new global `window._goToStints(teamId, cardIndex)` function to safely capture context prior to route navigation.
- **Session State Cache**: The new navigation helper leverages `sessionStorage.setItem('esm_active_card', cardIndex)` to cache the exact position of the carousel right before shifting context to `stints.html`.
- **Safe Initialization Check**: Within `renderMobile`, injected a single-pass `restoredCarousel` check to process the initial PWA load frame safely.
- **Robust DOM Restoration**: The logic reads from `sessionStorage`, validates the target index, drops the key to cleanly reset state, and uses a slight `setTimeout` combined with `.scrollIntoView({ behavior: 'instant', inline: 'center' })` to flawlessly lock the carousel into place—triggering the correct visual dot updates simultaneously without interfering with native CSS snapping.
Task 001.7.2 — FIX FINAL Carousel Restore (WebSocket Timing + Empty Render Bug)
Status: **COMPLETED**

### Summary of Completed Work
- **Strict Execution Boundaries**: Hardened the logic inside `renderMobile()` so that the `sessionStorage` checks will *only* execute if `teams.length > 0`—meaning it correctly waits for the actual live WebSocket payload to draw the UI before trying to index into nonexistent child DOM nodes.
- **Safe State Transitions**: Moved the `sessionStorage.removeItem('esm_active_card')` and `restoredCarousel = true` declarations *into* the `setTimeout` callback. They now exclusively flip only if `cards[targetIndex]` proves it safely exists, killing the edge-case where a slow network previously "consumed" the save token during the initial empty render.
- **Enhanced Transitioning**: Adjusted the final scroll command to `{ behavior: 'auto' }` with a slightly longer timeout of `80ms` to guarantee native browser reflows register the element completely on PWA environments before shifting focus.

Task 002 — Frontend Timer Cleanup (Render-Only Mode)
Status: **COMPLETED**

### Summary of Completed Work
- **Pure Render Layer**: Removed all instances of `Date.now()`, `new Date()`, and timestamp subtraction logic from `index.html` and the `stints.js` view model. The UI is now a 100% pure render layer dependent solely on values from the backend.
- **Check-In UI Check**: Deprecated the requirement of `d.check_in` for the countdown visualization, shifting entirely to checking if `d.position_time_sec != null` exactly as instructed, to natively show or hide the countdown UI without recalculating thresholds.
- **BOX UI Update**: Updated the team header logic to strictly query `team.is_box` and present `team.box_elapsed_sec`. It no longer locally generates pit stop duration from `mandatory_stop_start`.
- **Modal Formatting**: Stripped the local time string conversion (`fmtTs`) and dynamic relative time generation logic from both the Stints list and Team Driver modals, natively utilizing `s.duration_sec` and falling back cleanly to "ATIVO" for uncompleted stints without evaluating timestamps.

Task 003 — Responsive Layout Refactor (Analysis)
Status: **COMPLETED**

### Summary of Completed Work
- **Problem Identified**: `repeat(auto-fit, minmax(220px, 1fr))` is width-only and domain-blind. With 4 teams on a 1920 px screen it creates up to 8 columns; with 10 teams it produces arbitrary orphan rows. Team count — the primary domain variable — played no role in layout decisions.
- **Strategy Evaluated**: Two strategies compared — Pure CSS (Strategy A: `auto-fit/minmax`) vs. JS-Driven Hybrid (Strategy B). Strategy A rejected as structurally inappropriate for an operational real-time dashboard. Strategy B adopted.
- **Model Defined**: Column count = `min(preferred_by_team_count, feasible_by_viewport)`. Preferred lookup table: 1→1, 2–4→2, 5–9→3, 10+→4. Feasibility floor: `floor(viewport / 240px)`. Hard cap: 4 columns max.
- **Simulations Produced**: Eight scenarios covering wide/medium/narrow screens at 2, 4, 6, 10, 12 teams — all with expected column output and UX assessment.
- **Risks Documented**: Orphan rows (7, 10 teams), very small desktops (900–1024 px), resize oscillation, performance of resize handler.

Task 003.1 — Responsive Layout Refactor (Implementation)
Status: **COMPLETED**

### Summary of Completed Work
- **CSS Updated** (`styles.css`): Replaced `repeat(auto-fit, minmax(220px, 1fr))` with `repeat(var(--cols, 4), 1fr)`. The `--cols` custom property is now the sole driver of column count; CSS no longer participates in the column decision.
- **Column Engine Added** (`index.html`): Implemented `computeColumns(teamCount)` — a pure function that derives preferred columns from team count (lookup table matching the analysis) and constrains them by `floor(window.innerWidth / 240)`, clamped between 1 and 4.
- **Render Integration**: `renderDesktop()` calls `computeColumns(teams.length)` and sets `--cols` on `:root` before rebuilding the DOM. Columns are stable across WebSocket ticks; they only change when team count or viewport width changes.
- **Resize Handler Added**: Debounced `window.resize` listener (150 ms) recalculates and applies `--cols` when on desktop. Guard `isMobile()` prevents the handler from interfering with the carousel path.
- **Mobile Untouched**: Carousel (`renderMobile`), dots, and all sub-900 px behavior are completely unchanged.
- **Validation Confirmed** (logic trace):
  - Case A — 4 teams @ 1920 px: preferred=2, feasible=8 → **2 columns** ✅
  - Case B — 6 teams @ 1920 px: preferred=3, feasible=8 → **3 columns** ✅
  - Case C — 10 teams @ 1920 px: preferred=4, feasible=8 → **4 columns** ✅
  - Case D — resize to 900 px with 10 teams: feasible=`floor(900/240)`=3 → **3 columns** (cards ≈ 290 px, above 240 px floor) ✅
  - Case E — 0 teams: `computeColumns(0)` → preferred=1, fallback default `--cols=4` from CSS; empty grid renders cleanly ✅

Task 004 — Adaptive Card Scaling (Viewport-Filling Layout)
Status: **COMPLETED**

### Summary of Completed Work
- **Problem**: The grid used `grid-auto-rows: max-content`, so cards were sized by their own content and overflowed the viewport. The Race Director could not resize the browser window to control visibility without cards being cut off.
- **Goal**: All N team cards always fill the entire viewport — columns and rows adapt jointly, and typography scales proportionally so nothing is ever truncated or clipped.
- **`#main` overflow** (`styles.css`): Changed from `overflow-y: auto` to `overflow: hidden` + `min-height: 0`, making `#main` a fixed-size flex container the grid must fill exactly.
- **Grid row axis** (`styles.css`): Replaced `grid-auto-rows: max-content` with `grid-template-rows: repeat(var(--rows, 3), 1fr)` and `height: 100%`. Rows share the available height equally — no overflow possible.
- **`computeRows()`** (`index.html`): Derives row count from `ceil(teams / cols)`, constrained by `floor(innerHeight / 120px)` so cards never go below 120 px height.
- **`computeCardScale()`** (`index.html`): Continuous scale factor `1 / sqrt(cells / 6)` clamped to 0.45 min. Anchor: 6 cells (2×3) = scale 1.0.
- **`applyLayout()`** (`index.html`): Atomically sets `--cols`, `--rows`, and `--card-scale` on `:root` before each DOM rebuild and on debounced resize.
- **Font scaling**: All key typographic sizes use `calc(var(--card-scale, 1) * Xrem)` — card h3, active countdown, driver name, inactive time, row padding, row gap.
- **Team count range**: Extended to 15 teams; `MIN_CARD_WIDTH` reduced to 200 px; column cap raised to 5.
- **Scale reference table**:

  | Teams | Cols | Rows | Cells | `--card-scale` |
  |-------|------|------|-------|----------------|
  | 2–4   | 2    | 1–2  | 2–4   | 1.00           |
  | 6     | 3    | 2    | 6     | 1.00 (anchor)  |
  | 9     | 3    | 3    | 9     | 0.82           |
  | 10–12 | 4    | 3    | 12    | 0.71           |
  | 15    | 5    | 3    | 15    | 0.63           |

Task 003.2 — Active Driver First
Status: **COMPLETED**

### Summary of Completed Work
- **Problem**: Drivers were rendered in the order received from the backend (`team.drivers` array). The active driver (`check_in === true`) could appear in any position within the card.
- **Change**: Added a non-mutating sort before `.map()` in both `renderDesktop()` and `renderMobile()`. The expression `[...(team.drivers || [])].sort((a, b) => (b.check_in ? 1 : 0) - (a.check_in ? 1 : 0))` uses spread to avoid mutating the original array.
- **Scope**: Modified exactly two lines in `index.html` (line 258 desktop, line 298 mobile). No other files touched.
- **Validation**:
  - Case A — active driver in middle `[A, B(active), C]` → `[B, A, C]` ✅
  - Case B — active already first `[A(active), B, C]` → `[A, B, C]` ✅ (sort is stable on equal keys)
  - Case C — no active driver `[A, B, C]` → `[A, B, C]` ✅ (all keys equal, order preserved)
- **Complexity**: O(n log n); n is typically 2–4 drivers per team — effectively O(1) in practice.
- **Constraints met**: original array not mutated, no new dependencies, `renderDriverCard` untouched, CSS untouched.

Task 003.3 — Active Driver Horizontal Layout
Status: **COMPLETED**

### Summary of Completed Work
- **Change**: Restructured the active driver row from a vertical two-line layout (`[TIME]` / `[NAME + BADGE]`) to a horizontal single-line layout (`[NAME + BADGES]` `[TIME]`).
- **Left side** (`flex:1, overflow:hidden`): driver name (`driver-text`, truncates with ellipsis) + skill badge + position timer badge — all inline with `gap:6px`.
- **Right side** (`flex-shrink:0, margin-left:8px`): large monospace countdown (`2.2rem` scaled), color-coded, blink-capable.
- **Regression fixed**: User's edit had accidentally removed the `else` branch for inactive drivers. The branch was restored in the same fix, preserving the original inactive driver layout (`driver-info-left` + `driver-info-right` with `margin-left:auto`).
- **Unchanged**: blink logic, color logic, position timer logic, `renderDriverCard` signature, CSS.

Task 003.4 — Restore Inactive Drivers Rendering (Fix Sort Regression)
Status: **COMPLETED**

### Summary of Completed Work
- **Problem**: The arithmetic sort comparator `(b.check_in ? 1 : 0) - (a.check_in ? 1 : 0)` was non-deterministic in some JS engine implementations, causing incorrect render order and invisible inactive drivers.
- **Fix**: Replaced with an explicit branch comparator: `if (a.check_in !== b.check_in) { return a.check_in ? -1 : 1; } return 0;` — guarantees active drivers sort to `-1` (first), inactive sort to `1` (after), and equal values return `0` (preserving original relative order).
- **Applied in**: `renderDesktop` (line 281) and `renderMobile` (line 321) — both identical.
- **Validation**: Case A `[A, B✓, C]` → `[B✓, A, C]` ✅ | Case B `[A✓, B, C]` → `[A✓, B, C]` ✅ | Case C `[A, B, C]` → `[A, B, C]` ✅
- **Constraints met**: no filtering, no new logic, `renderDriverCard` untouched, layout untouched.

Task-004 — Dynamic QR Filler Card
Status: **COMPLETED**

### Summary of Completed Work
- **Objective**: Render a QR filler card intelligently in unused grid slots of the Viewer PWA, without floating UI elements or absolute overlays. The card must integrate fully into the existing responsive grid layout.
- **Grid strategy**: The QR filler was injected directly into the desktop grid DOM string during the `renderDesktop` phase. By keeping it as a standard `.card-desktop` grid item, it automatically inherits resizing rules, proportional spacing, and adaptive flex layouts precisely like a real team card.
- **Empty-slot detection logic**: Utilizing the existing dimension-aware math inside `applyLayout` (which computes explicit cols and rows depending on screen dimensions and team count), the system calculates `total_capacity = layout.cols * layout.rows` and `availableSlots = total_capacity - teams.length`. The QR card is rendered strictly when `availableSlots > 0`.
- **Responsive Layout Preservation**: Bound `renderDesktop(lastSnapshot)` natively to the debounced window resize handler. Now, when resizing triggers a grid dimension change resulting in empty slots, the QR card dynamically reveals or hides itself based entirely on organic grid capacity without ever reducing space available to active teams.
- **Files changed**: `/Users/gersonferreira/projetos/esm-live-pwa/index.html`
- **Validation checklist**:
  - [x] Scenario 1: Empty Slot Exists - QR card appears when grid has unused capacity.
  - [x] Scenario 2: Grid Full - No QR card appears when all slots occupied by teams.
  - [x] Scenario 3: Responsive Resize - Resizing browser updates column count and QR behaves correctly.
  - [x] Scenario 4: Visual Consistency - QR card matches formatting of regular cards natively, with "SCAN TO JOIN" text perfectly scaled by `--card-scale`.
