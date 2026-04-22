# Task 002 — Frontend Timer Cleanup (Render-Only Mode)

## Objective
Remove all time-based calculations from the frontend and convert the UI into a pure render layer based exclusively on backend-provided values.

---

## Context

The backend (ESM) now provides:

- box_elapsed_sec
- check_in_elapsed_sec
- position_time_sec (bounded 0–60)
- stint_left_sec
- race_left_sec

Frontend must no longer calculate time using device clocks.

---

## Strategy

This is a **frontend-only refactor**.

Do NOT:
- modify WebSocket logic
- modify payload structure
- introduce new backend dependencies

---

## Core Principle

Frontend MUST NOT compute time.
Frontend MUST ONLY render values received from backend.

---

## 1. REMOVE ALL TIME CALCULATIONS

Search and remove:

- Date.now()
- new Date()
- performance.now()
- any subtraction using timestamps
- any usage of:
  - check_in_time
  - mandatory_stop_start

---

## 2. CHECK-IN UI LOGIC (MANDATORY)

Use:

- position_time_sec → for UI (0–60s window)
- check_in_elapsed_sec → optional informational

### Rules

If position_time_sec !== null:
→ Show countdown / urgency UI

If position_time_sec === null:
→ Hide countdown UI completely

DO NOT:
- recompute remaining time
- subtract values in frontend

---

## 3. BOX UI LOGIC

Use:

- is_box
- box_elapsed_sec

### Rules

If is_box === true:
→ Show BOX timer using box_elapsed_sec

If is_box === false:
→ Hide BOX UI

---

## 4. STINT & RACE (NO CHANGE)

Continue using:

- stint_left_sec
- race_left_sec

These are already correct and must remain unchanged.

---

## 5. REMOVE ANY TIMER LOOPS

Remove:

- setInterval for updating timers
- manual UI refresh loops

WebSocket updates are the ONLY source of updates.

---

## 6. OPTIONAL UX (SAFE)

You MAY:

- format seconds to mm:ss
- apply colors based on thresholds
- apply blink effects based on values

BUT:
Do NOT derive new time values.

---

## 7. VALIDATION

### CHECK-IN

- position_time_sec = 10 → visible countdown
- position_time_sec = null → hidden

### BOX

- is_box = true → visible timer
- is_box = false → hidden

### GENERAL

- No usage of Date.now()
- No timer drift across devices
- UI updates only on WebSocket events

---

## Definition of Done

- All time calculations removed from frontend
- UI renders exclusively backend values
- No regression in behavior
- No dependency on client clock
- update docs/checkpoint.md


---

## Notes

Backend is now the single source of truth for all timing.

Frontend must remain deterministic and stateless regarding time.
