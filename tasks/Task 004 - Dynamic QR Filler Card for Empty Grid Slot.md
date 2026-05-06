# Task-004 — Dynamic QR Filler Card for Empty Grid Slot

execution_policy:
  force_model: pro-high

mode: STRICT
objective: Render QR filler card in unused grid slot of ESM Live Viewer

---

## CONTEXT

Project:
- esm-live-pwa

This task applies ONLY to:
- Viewer PWA layout/grid rendering

QR asset location:
- assets/qr.png

Checkpoint file:
- docs/checkpoint.md

---

## PROBLEM

The current Viewer grid may contain unused/empty space when the number of teams does not fully occupy the rendered card grid.

Example:
- grid capacity = 9 cards
- active teams = 8
- result = 1 empty visual slot

Currently:
- empty area remains unused

Desired behavior:
- use empty slot intelligently
- render QR access card instead

---

## OBJECTIVE

When the Viewer grid contains at least one unused slot:

- render a QR Card
- using:
  assets/qr.png

The QR card should behave visually like a normal grid card.

This is NOT:
- an overlay
- a floating widget
- absolute positioning

It is:
- a normal responsive grid item

---

## EXPECTED BEHAVIOR

If:

available_slots > 0

Then:

- insert ONE QR filler card into the first available slot

The QR card:
- occupies exactly one grid slot
- follows responsive layout naturally
- resizes consistently with other cards

---

## CRITICAL CONSTRAINTS

You MUST:

- preserve current responsive grid behavior
- preserve existing card sizing rules
- insert QR as normal grid item
- use assets/qr.png
- render ONLY ONE QR card maximum

You MUST NOT:

- use absolute positioning
- use overlays
- break card alignment
- force fixed screen positions
- reduce space available to real teams

---

## IMPORTANT LAYOUT REQUIREMENT

The QR card must ONLY appear when:
- there is genuine unused capacity in the grid

If the grid is fully occupied:
- no QR card should appear

---

## TASK

### 1. TRACE GRID CALCULATION

Identify:

- how columns are calculated
- how rows are calculated
- how responsive grid capacity is determined

Determine:
- how to reliably detect empty grid capacity

DO NOT assume fixed columns.

Grid is responsive.

---

### 2. CALCULATE UNUSED CAPACITY

Correct logic should resemble:

available_slots =
    total_grid_capacity - team_count

Where:
- total_grid_capacity depends on actual responsive layout

---

### 3. IMPLEMENT QR FILLER CARD

Render:
- QR image from:
  assets/qr.png

Inside:
- normal grid card component/layout

The QR card should:
- visually integrate naturally
- remain centered
- scale responsively

---

### 4. OPTIONAL TEXT (ALLOWED)

If visually appropriate, optional small label allowed:

Examples:
- "SCAN TO JOIN"
- "ACESSE O PWA"

BUT:
- QR must remain visually dominant

Text is OPTIONAL.

---

### 5. ENSURE RESPONSIVENESS

Validate:
- desktop
- fullscreen TV layout
- smaller browser widths

QR card must:
- resize consistently
- not overflow
- not distort layout

---

## CRITICAL OBSERVATION

This task is about:
- intelligent usage of dead grid space

NOT:
- persistent QR overlays
- floating UI elements

The QR card must behave exactly like a regular grid card.

---

## VALIDATION (MANDATORY)

### Scenario 1 — Empty Slot Exists
- grid has unused capacity
- QR card appears
✔ expected

---

### Scenario 2 — Grid Full
- all slots occupied by teams
- QR card absent
✔ expected

---

### Scenario 3 — Responsive Resize
- resize browser
- column count changes
- QR card continues behaving correctly
✔ expected

---

### Scenario 4 — Visual Consistency
- QR card visually aligned with normal cards
- no layout distortion
✔ expected

---

### Build Validation
- npm build / vite build succeeds
- no console errors
- no broken asset paths

---

## COMPLETION RULE

Task complete only if:

- QR card appears ONLY when space exists
- responsive layout preserved
- no overlay hacks used
- card integrates naturally into Viewer grid

---

## CHECKPOINT UPDATE

Update:

docs/checkpoint.md

### Task-004 — Dynamic QR Filler Card

Include:
- Objective
- Grid strategy
- Empty-slot detection logic
- Files changed
- Validation checklist

Status:
ACCEPTED only after responsive validation

---

## IMPORTANT

The QR card is a:
👉 dynamic filler card

NOT:
👉 overlay UI

The solution must preserve the elegance of the Viewer grid architecture.

---

## START ANALYSIS AND IMPLEMENTATION
```
