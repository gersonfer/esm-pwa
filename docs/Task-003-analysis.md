# TASK-003 — Responsive Layout Refactor: Analysis

> **Mode:** STRICT ANALYSIS — No code changes.  
> **Scope:** ESM Live Viewer (`index.html` / `styles.css`)  
> **Date:** 2026-05-04

---

## 1. Problem Restatement

### What Is Actually Wrong

The current layout for the desktop view is declared at **line 60–68 of `styles.css`**:

```css
#grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  grid-auto-rows: max-content;
  gap: 1vw;
  padding: 1vw;
}
```

`auto-fit` with `minmax(220px, 1fr)` is a width-only, content-agnostic strategy. The browser computes the number of columns purely from one variable: **how many 220 px slots fit in the available container width**. The number of actual teams (the domain variable that matters most) plays no role.

This produces three failure modes:

| Viewport Width | Teams | CSS Column Result | Actual Problem |
|---|---|---|---|
| ~1920 px | 4 | 8 columns | 4 cards stretch absurdly, wasting half the screen |
| ~1400 px | 10 | 6 columns | 4+4+2 rows — 2 orphans; grid feels incomplete |
| ~900 px | 10 | 4 columns | 3+3+3+1 — last row has a lonely card |
| ~600 px | 6 | 2 columns | Handled by carousel — not a desktop concern |

The fundamental error is that **the algorithm is indifferent to team count**. A grid should approximate a rectangle. The layout mechanism should first ask: *"how many teams exist?"*, and only then ask: *"what constraints does the viewport impose?"*

---

## 2. Constraints

### UI Type
- **Operational real-time dashboard** — not a marketing page or content site
- Live race monitoring; used by pit-crew coordinators and race directors
- Must be readable at a glance under stress / poor lighting (paddock environments)
- Single-view, no pagination — all teams must be visible simultaneously

### Expected Team Range
- **Minimum:** 2 teams (rarely; internal testing)
- **Typical:** 6–10 teams (most race events)
- **Maximum observed:** 12 teams (large grids)
- Outlier consideration: up to 16 teams cannot be ruled out for future events

### Readability Requirements
- Each card must display:
  - Team name + category badge
  - Active driver: large time counter (`2.2rem` monospace), name, position timer
  - Inactive drivers: smaller time + name rows
- **Minimum legible card width:** ~220 px (current `minmax` lower bound — correct)
- **Comfortable card width:** 260–360 px (allows names without truncation)
- **Maximum useful card width:** ~420 px (beyond this, whitespace dominates and feels unprofessional)

### Real-Time Usage Constraints
- The render function is called on every WebSocket tick (approximately 1 Hz from backend)
- Column count must be **stable between ticks** — layout thrashing (column count changing while data updates) is disorienting for operators
- Column count changes are acceptable only on:
  1. Window resize
  2. Team count change (team added/removed mid-race)
- The `isMobile()` function switches to carousel below 900 px — this breakpoint is fixed and correct; the problem is exclusively the **desktop grid behavior above 900 px**

---

## 3. Strategy Comparison

### Strategy A — Pure Adaptive (CSS `auto-fit/minmax`)

**Mechanism:** Browser divides available width by `minmax(lower, 1fr)`. No JS required.

| Criterion | Assessment |
|---|---|
| **Predictability** | Low — column count changes unpredictably as window width passes minmax thresholds |
| **Density** | Poor at extremes — too many columns for few teams; odd orphan rows for typical counts |
| **UX under resize** | Layout jumps column count mid-resize; no hysteresis |
| **Implementation complexity** | Zero — pure CSS |
| **Domain suitability** | Ignores team count entirely; not domain-aware |

**Fatal flaw:** With 4 teams on a 1920 px screen, `auto-fit` with `minmax(220px, 1fr)` creates 8 columns — the 4 team cards each stretch to fill 2 column-widths, or sit in 4 of 8 slots with 4 empty slots. Both outcomes look broken. CSS has no way to express "use at most N columns where N is derived from data."

---

### Strategy B — Intelligent Breakpoints (JS-Driven, Domain-Aware)

**Mechanism:** JS calculates the ideal column count from `teams.length` and `window.innerWidth`, then writes `grid-template-columns: repeat(N, 1fr)` to the grid element on each render.

| Criterion | Assessment |
|---|---|
| **Predictability** | High — column count is a deterministic function of two known inputs |
| **Density** | Excellent — always uses the fewest columns that fit without going below min card width |
| **UX under resize** | Good with debounce — can add hysteresis to prevent column-count oscillation |
| **Implementation complexity** | Moderate — requires a small JS function; must integrate with existing render cycle |
| **Domain suitability** | Excellent — team count is the primary driver; viewport is a constraint, not the driver |

**Key advantage:** Because `renderDesktop()` already runs on every WebSocket update, injecting column recalculation into that cycle (or a debounced resize handler) is low-cost and fits the existing architecture.

---

### Verdict

Strategy A is structurally inappropriate for this domain. Strategy B is the correct approach with one refinement: the column calculation must be **capped by a minimum card width constraint** so it degrades gracefully on narrow viewports instead of producing unreadably thin cards.

A **hybrid** is warranted: JS determines the preferred column count from team count, then CSS `minmax` acts as a safety floor to prevent cards from shrinking below the readability threshold.

---

## 4. Proposed Solution

> **No code is produced here.** This section defines the model only.

### Chosen Strategy: JS-Driven Hybrid

**Primary axis:** Team count → preferred columns  
**Secondary axis:** Viewport width → maximum feasible columns (given min card width)  
**Final result:** `min(preferred, feasible)` — whichever is more conservative

### Column Calculation Model

**Step 1 — Preferred columns from team count:**

| Teams | Preferred Columns | Rationale |
|---|---|---|
| 1 | 1 | Single team, center the card |
| 2–3 | 2 | Two columns fills the screen symmetrically |
| 4 | 2 | 2×2 grid — most balanced for 4 items |
| 5–6 | 3 | 3+3 — two full rows |
| 7–9 | 3 | 3+3+3 or 3+3+2 — acceptable asymmetry |
| 10–12 | 4 | 4+4+2 or 4+4+4 — operational density |
| 13–16 | 4 | 4×4 max; below this card size becomes too small |

> **Design principle:** Prefer fewer rows over fewer columns. Operators scan horizontally across a wide screen more naturally than vertically.

**Step 2 — Feasible columns from viewport:**

```
feasible = floor(availableWidth / MIN_CARD_WIDTH)
```

- `MIN_CARD_WIDTH` = 240 px (10 px above current 220 px minmax; preserves current floor)
- `availableWidth` = `window.innerWidth` minus any fixed sidebar/padding (currently none; full width)

**Step 3 — Final column count:**

```
columns = clamp(min(preferred, feasible), 1, 4)
```

- Never fewer than 1 column
- Never more than 4 columns (density cap; beyond 4 columns cards are too narrow at any reasonable viewport)

### Rules Table (Final)

| Teams | Preferred | Min Viewport for Full Grid | Notes |
|---|---|---|---|
| 1 | 1 | Any | Full width single card |
| 2 | 2 | 480 px | Symmetric pair |
| 3 | 2 | 480 px | 2+1 acceptable; 3 columns would make cards too narrow |
| 4 | 2 | 480 px | Perfect 2×2 square |
| 5 | 3 | 720 px | 3+2 — slightly asymmetric but acceptable |
| 6 | 3 | 720 px | Perfect 3×2 rectangle |
| 7 | 3 | 720 px | 3+3+1 — one orphan (see Risks) |
| 8 | 4 | 960 px | Perfect 4×2 rectangle |
| 9 | 3 | 720 px | Perfect 3×3 square |
| 10 | 4 | 960 px | 4+4+2 — 2 orphans at bottom |
| 11 | 4 | 960 px | 4+4+3 |
| 12 | 4 | 960 px | Perfect 4×3 rectangle |

### Minimum Card Width Constraint

- Hard floor: **240 px** (cards below this are not readable for the `2.2rem` time counter)
- If feasible columns drops below 1 (viewport < 240 px): this is below the mobile threshold (900 px) and will never be reached in desktop mode
- The existing mobile carousel handles sub-900 px — this constraint only applies to desktop

### How Resize Affects the Result

- On resize, the column count is recalculated
- A **debounce of 150 ms** should be applied to avoid recalculating on every animation frame during drag
- Since the result is an integer, hysteresis is inherent — no oscillation at exact boundary conditions
- Team count changes (WebSocket updates) should also trigger recalculation, but these are already handled inside the render cycle

---

## 5. Layout Behavior Simulation

### Scenario 1: 10 Teams @ Wide Screen (1920 px)
- Preferred: 4 | Feasible: `floor(1920/240)` = 8 | **Final: 4 columns**
- Layout: 4 + 4 + 2 (two orphans on last row)
- Card width: ≈ 460–480 px
- **Assessment:** Excellent density; cards spacious but not wasteful. Significant improvement over current `auto-fit` which would produce 8 columns with 10 cards each at 220 px minimum.

### Scenario 2: 10 Teams @ Medium Screen (1280 px)
- Preferred: 4 | Feasible: `floor(1280/240)` = 5 | **Final: 4 columns**
- Layout: 4 + 4 + 2
- Card width: ≈ 305–320 px
- **Assessment:** Good density; comfortable readability.

### Scenario 3: 10 Teams @ Narrow Desktop (1024 px)
- Preferred: 4 | Feasible: `floor(1024/240)` = 4 | **Final: 4 columns**
- Layout: 4 + 4 + 2
- Card width: ≈ 248–256 px
- **Assessment:** Tight but legible; the `2.2rem` time counter still fits; names may truncate slightly at the edge.

### Scenario 4: 6 Teams @ Narrow Desktop (1024 px)
- Preferred: 3 | Feasible: `floor(1024/240)` = 4 | **Final: 3 columns**
- Layout: 3 + 3 (perfect 3×2 rectangle)
- Card width: ≈ 333–340 px
- **Assessment:** Excellent — clean rectangle, good readability.

### Scenario 5: 6 Teams @ Wide Screen (1920 px)
- Preferred: 3 | Feasible: `floor(1920/240)` = 8 | **Final: 3 columns**
- Layout: 3 + 3
- Card width: ≈ 630–640 px
- **Assessment:** Wide cards, but 6 teams need space — operators can see all data at a glance. The cap at 3 columns prevents the `auto-fit` failure mode of creating empty columns.

### Scenario 6: 4 Teams @ Wide Screen (1920 px)
- **Current behavior:** `floor(1920/220)` = 8 columns; 4 cards in 8 slots — looks broken.
- Preferred: 2 | Feasible: 8 | **Final: 2 columns**
- Layout: 2 + 2
- Card width: ≈ 950 px
- **Assessment:** Cards are very wide, but this is the correct tradeoff for 4 teams. The alternative (1 column) is worse. For events with very few teams, wide cards give operators more comfortable reading space.

### Scenario 7: 2 Teams @ Medium Screen (1280 px)
- Preferred: 2 | Feasible: 5 | **Final: 2 columns**
- Layout: 1 + 1
- Card width: ≈ 620 px
- **Assessment:** Balanced, symmetric layout.

### Scenario 8: 12 Teams @ Medium Screen (1280 px)
- Preferred: 4 | Feasible: 5 | **Final: 4 columns**
- Layout: 4 + 4 + 4 (perfect 4×3 rectangle)
- Card width: ≈ 305 px
- **Assessment:** Maximum information density; optimal for large-grid events.

---

## 6. Risks

### Edge Case: Orphan Rows (e.g., 7 or 10 teams)

- With 7 teams at 3 columns: rows are 3 + 3 + 1. The single card on the last row stretches to full grid width.
- With 10 teams at 4 columns: rows are 4 + 4 + 2. The two cards on the last row each take 50% of grid width.
- **Risk:** Visual imbalance on last row. The 7-team case (one full-width card) looks particularly wrong.
- **Mitigation:** The preferred column table in Section 4 already accounts for mathematical orphan problems. 7 teams use 3 columns (3+3+1) rather than 4 (4+3) because 3+3+1 is less asymmetric than 4+3. The implementation phase could optionally use CSS `justify-items: stretch` on the grid to reduce the visual impact of orphan cards.

### Edge Case: Very Large Team Counts (14–16+)

- 16 teams at 4 columns = perfect 4×4 rectangle
- 14 teams at 4 columns = 4+4+4+2 — two orphans
- **Risk:** Beyond 12 teams, the model may need a 5-column option for very wide screens
- **Mitigation:** The feasibility constraint (`floor(width / 240)`) already allows 5 columns at 1200+ px. The preferred column logic would need to be extended for 13–16 teams in the implementation phase.

### Edge Case: Very Small Desktop Screens (900–1024 px)

- This is the most constrained desktop range (small laptops, external monitors)
- 10 teams at 4 columns → card width ≈ 248 px — tight but functional
- At exactly 960 px, feasible = 4; at 900 px, feasible = 3 — the system automatically reduces columns, making each card ≈ 290 px.
- **Assessment:** The feasibility constraint handles this gracefully without extra logic.

### Layout Instability: Column Count Oscillation During Resize

- If resize fires during window drag and the new width triggers a different column count, the grid reflows
- **Mitigation:** A debounce (150 ms) on the resize handler prevents oscillation. Since column count is an integer, there is no fractional boundary — once committed to N columns, the grid is stable until width crosses the threshold.

### Performance: Resize Handler Cost

- The column calculation is a single integer division and a table lookup — O(1), negligible CPU cost
- Applying `grid-template-columns` triggers a style recalculation but NOT a full layout reflow (modern browsers batch CSS property writes efficiently)
- **Low-probability risk:** On very slow devices (old tablets used as pit monitors), frequent reflow could cause jank. Debounce mitigates this.

### Data-Driven Assumption

- The model assumes team count is available at render time via `data.teams.length`
- The first render fires with `{ race_left_sec: 0, teams: [] }` (line 320 in `index.html`)
- At 0 teams, column count is irrelevant — the grid is empty. No risk.
- When teams arrive via WebSocket, column count is set correctly on first meaningful render.

---

## 7. Final Recommendation

### Strategy to Adopt: **JS-Driven Hybrid**

**Recommended approach:** Implement Strategy B (JS-driven column calculation) with CSS `minmax` retained as a safety floor — not as the primary layout driver.

The hybrid works as follows:
1. JS calculates the preferred column count from team count using the table in Section 4
2. JS calculates the feasible column count from viewport width with a minimum card width of 240 px
3. Final column count = `min(preferred, feasible)`, clamped between 1 and 4
4. This value is written to the `#grid` element as `grid-template-columns: repeat(N, 1fr)`
5. A debounced resize handler (150 ms) recalculates on window resize
6. The render function (called each WebSocket tick) also recalculates — team count changes are handled naturally

### Why This Is Optimal for ESM

1. **Domain-first:** The number of teams — not the viewport width — drives layout. This is correct because the domain constraint (show all teams, equally sized) matters more than the CSS constraint (fill available width).

2. **Stable under real-time updates:** Column count does not change between WebSocket ticks (teams rarely change mid-race). The grid is stable; only card contents update.

3. **Predictable for operators:** An operator who opens the dashboard at 10 teams sees 4 columns. If they resize the window, columns adjust rationally — they do not jump arbitrarily.

4. **No new infrastructure:** The calculation fits entirely inside the existing `renderDesktop()` function. No new components, no new files, no framework dependency.

5. **Fixes the identified failure modes:**
   - 4 teams on 1920 px → 2 columns (not 8)
   - 10 teams on 1920 px → 4 columns (not 8)
   - 6 teams → always 3 columns (2×3 rectangle, regardless of screen width)

### Is Hybrid Required?

**Yes.** Pure Strategy A fails at the domain level. Pure Strategy B without a CSS floor is fragile (if JS errors, the layout collapses). The hybrid — JS determines columns, CSS enforces minimum card width as a fallback — is the minimal, robust solution.

In the implementation phase, the `auto-fit` keyword in `grid-template-columns` must be replaced with an explicit `repeat(N, 1fr)` controlled by JS.

---

*Analysis complete. No code was modified. Awaiting implementation approval.*
