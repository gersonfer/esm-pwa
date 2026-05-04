# Executive Summary

The frontend currently uses **`race_left_sec`** only for displaying the countdown timer. All state‑driven UI decisions (timer border, driver blink, active‑stint gating) already rely on the newly‑exposed **`race_status`** field or on driver‑specific timers. No logic in the examined files infers the overall race state (**running / paused / finished**) from `race_left_sec`. Consequently, the technical debt around state inference is minimal:

* `race_left_sec` is used exclusively for **display** (LEGACY).
* All conditional styling (`setTimerBorder`, driver blink, active‑stint gating) correctly checks `race_status` (SAFE).
* The only implicit assumption is that a zero‑second timer indicates the race is finished, but this is never used for state decisions – the UI still checks `race_status`.

Overall, the codebase is already close to a **pure render layer**; the remaining work is to remove the display‑only usage of `race_left_sec` where it is not required for UI presentation.

---

# Inference Mapping Table

| File | Line | Pattern / Usage | Classification | Impact |
|------|------|----------------|----------------|--------|
| **index.html** | 301 | `$("#timer").textContent = formatTime(data.race_left_sec);` | **LEGACY** – pure display of remaining time. | UI shows countdown; safe to keep or replace with a generic timer component. |
| **index.html** | 120 | `if (lastSnapshot && lastSnapshot.race_status === 'running') { … }` | **SAFE** – explicit state check using `race_status`. | Drives driver‑name blinking; already correct. |
| **index.html** | 302 | `setTimerBorder(data.race_status);` | **SAFE** – UI border uses explicit status. | Correct visual cue for running/paused/finished. |
| **index.html** | 91‑94 (inside `setTimerBorder`) | `if (s === "running") … else if (s === "paused") … else if (s.includes("over") || s.includes("finish")) …` | **SAFE** – maps status strings to colors. | Handles visual state; no reliance on timer. |
| **index.html** | 118‑123 (inside `renderDriverCard`) | `if (left <= 0) { … if (lastSnapshot && lastSnapshot.race_status === 'running') isBlink = true; }` | **SAFE** – combines driver‑level timer with global `race_status`. | Correctly restricts blink to running races. |
| **stints.html** | 61 | `$("#timer").textContent = formatTime(data.race_left_sec || 0);` | **LEGACY** – display only. | Same as index.html. |
| **stints.html** | 72 | `const stints = buildStintViewModel(team, data.race_status);` | **SAFE** – passes explicit status to view‑model. | Drives active‑stint gating. |
| **stints.html** | 144 | `render({ race_left_sec: 0, teams: [...] });` (initial render) | **LEGACY** – placeholder display before WS data. | Harmless placeholder. |
| **js/view-models/stints.js** | 88‑94 | `const raceFinished = normalizedStatus === "finished" …` (multiple synonyms) | **SAFE** – defines terminal condition from `race_status`. | Prevents active‑stint rendering after finish. |
| **js/view-models/stints.js** | 99‑100 | `if (!activeDriver || raceFinished) return historical;` | **SAFE** – skips active stint when race finished. | Correct behavior. |
| **js/utils/time.js** | 8‑14 | `formatTime(sec)` – pure formatter used for both `race_left_sec` and driver timers. | **LEGACY** – utility function, not state inference. | No impact. |

---

# Proposed Refactor Strategy (for Task 002.2)

1. **Formalise `race_left_sec` as a Display‑Only Prop**
   * Document that `race_left_sec` is only used for the visual countdown timer.
   * Ensure any future components receive it solely for rendering, never for conditional logic.
2. **Audit for Hidden Timer‑Based State Checks**
   * Run a repository‑wide search for `race_left_sec` comparisons (`=== 0`, `<= 0`).
   * Verify each match is within a UI‑rendering context (e.g., `<span id="timer">`).
   * If any hidden state logic is discovered, replace it with `race_status` checks.
3. **Standardise Status‑Based Styling**
   * Centralise the mapping of `race_status` → CSS classes (e.g., `running → var(--ok)`).
   * Replace ad‑hoc string checks (`includes('over')`) with a strict enum lookup.
4. **Remove Redundant Fallbacks**
   * The initial render in `stints.html` (`render({ race_left_sec: 0, … })`) can stay as a loading placeholder, but consider moving it to a dedicated “loading” component to decouple from the main UI.
5. **Add Type / JSDoc Annotations**
   * Annotate the snapshot shape (`race_status: string`, `race_left_sec: number`) in both HTML scripts and the view‑model to aid future developers.
6. **Testing / Verification**
   * Add visual regression tests that assert the timer border colour changes correctly for each `race_status`.
   * Verify that the driver‑blink only occurs when `race_status === "running"`.
   * Ensure that when a snapshot with `race_status: "finished"` arrives, the active stint is **not** rendered (already covered by view‑model logic).
7. **Documentation Update**
   * Update the project README / architecture diagram to reflect the new source‑of‑truth model (backend → `race_status`).
   * Highlight that `race_left_sec` is no longer a control flow variable.

---

# Conclusion

The backend snapshot already provides all information required by the frontend:
* **`race_status`** fully describes the global race phase.
* **`race_left_sec`** can be retained for the countdown timer display without affecting logic.
* No additional fields are needed.

Therefore, the frontend is ready to be converted into a **pure render layer** with minimal refactoring: replace any stray timer‑based state checks (none detected beyond display) with explicit `race_status` conditions, and treat `race_left_sec` as a visual aid only.

*End of analysis.*
