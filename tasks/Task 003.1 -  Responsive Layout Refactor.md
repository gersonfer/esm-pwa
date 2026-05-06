## TASK-003.1 — Responsive Layout Refactor (Implementation)

### MODE
STRICT IMPLEMENTATION (FOLLOW APPROVED ANALYSIS EXACTLY)

---

## CONTEXT

You MUST implement the solution defined in:

👉 

This document is the source of truth.  
Do NOT reinterpret logic.  
Do NOT redesign rules.

---

## OBJECTIVE

Replace the current CSS-only responsive grid with a:

> ✅ JS-driven, domain-aware column system  
> constrained by viewport width

---

## CURRENT STATE (TO BE MODIFIED)

CSS:

css #grid {   grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); } 

Problem:
- width-only logic
- ignores team count

---

## TARGET STATE

Grid columns must be:

columns = min(preferred_by_teams, feasible_by_width)

---

## IMPLEMENTATION STEPS

### STEP 1 — Remove auto-fit logic

Modify styles.css:

css #grid {   display: grid;   grid-template-columns: repeat(var(--cols), 1fr);   grid-auto-rows: max-content; } 

- Remove auto-fit
- Remove minmax as primary driver

---

### STEP 2 — Define MIN_CARD_WIDTH

Inside JS:

js const MIN_CARD_WIDTH = 240; 

---

### STEP 3 — Implement column calculation

Create function:

js function computeColumns(teamCount) {   // Preferred (from analysis)   let preferred;    if (teamCount === 1) preferred = 1;   else if (teamCount <= 3) preferred = 2;   else if (teamCount === 4) preferred = 2;   else if (teamCount <= 6) preferred = 3;   else if (teamCount <= 9) preferred = 3;   else preferred = 4;    // Feasible (viewport constraint)   const feasible = Math.floor(window.innerWidth / MIN_CARD_WIDTH);    // Final   return Math.max(1, Math.min(preferred, feasible, 4)); } 

---

### STEP 4 — Integrate into renderDesktop()

Inside:

js function renderDesktop(data) 

Add:

js const teamCount = (data.teams || []).length; const cols = computeColumns(teamCount);  document.documentElement.style.setProperty('--cols', cols); 

---

### STEP 5 — Add resize handler (debounced)

Add once (global scope):

js let resizeTimeout;  window.addEventListener('resize', () => {   clearTimeout(resizeTimeout);    resizeTimeout = setTimeout(() => {     if (!lastSnapshot) return;      const teamCount = lastSnapshot.teams.length;     const cols = computeColumns(teamCount);      document.documentElement.style.setProperty('--cols', cols);   }, 150); }); 

---

### STEP 6 — Ensure no layout thrashing

- Column count MUST NOT flicker during render loop
- Do NOT recalculate unnecessarily
- Only:
  - on render (data change)
  - on debounced resize

---

## VALIDATION (MANDATORY)

You MUST validate:

### Case A — 4 teams @ 1920px
Expected:
- 2 columns
- layout: 2x2

---

### Case B — 6 teams @ 1920px
Expected:
- 3 columns
- layout: 3x2

---

### Case C — 10 teams @ 1920px
Expected:
- 4 columns
- layout: 4+4+2

---

### Case D — resize 1920 → 900
Expected:
- columns reduce dynamically
- cards never go below ~240px

---

### Case E — no teams
Expected:
- no errors
- layout remains stable

---

## NON-GOALS

- Do NOT modify mobile carousel
- Do NOT change card internal layout
- Do NOT introduce frameworks
- Do NOT refactor unrelated code

---

## OUTPUT REQUIREMENTS

Provide:

1. Files modified
2. Exact diff
3. Confirmation:
   - builds correctly
   - no console errors
   - layout matches analysis

---

## DEFINITION OF DONE

- Grid no longer uses auto-fit
- Columns respond to team count AND width
- Layout is stable and predictable
- All validation scenarios pass
- docs/checkpoint.md updated correctly



---
