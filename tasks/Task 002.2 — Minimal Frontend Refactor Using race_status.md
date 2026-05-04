# Task 002.2 — Minimal Frontend Refactor Using race_status

## Context

Task 002.1 confirmed that:

- race_status is already the primary driver of UI state
- race_left_sec is used ONLY for display purposes
- no critical state inference exists in the frontend

Therefore, this task is NOT a full refactor.

It is a **targeted cleanup and standardization**.

---

## Objective

Perform a MINIMAL and SAFE refactor to:

- enforce race_status as the ONLY state authority
- remove fragile or implicit logic
- standardize state handling

WITHOUT changing behavior.

---

## Scope (STRICT)

Modify ONLY:

1. index.html
2. stints.html
3. js/view-models/stints.js

Do NOT modify:

- layout
- CSS
- WebSocket logic
- snapshot structure
- rendering structure

---

## Changes Required

### 1. Standardize race_status checks

Replace any pattern like:

    s.includes("finish")
    s.includes("over")

With STRICT checks:

    s === "finished"

---

### 2. Enforce explicit state usage

Ensure ALL state-driven conditions use:

    snapshot.race_status

NOT:

    race_left_sec
    !running
    implicit conditions

---

### 3. Protect race_left_sec as display-only

DO NOT remove:

    formatTime(race_left_sec)

BUT ensure it is NEVER used for:

- if conditions
- UI state decisions
- blink logic

---

### 4. Validate blink logic

Ensure:

    blink ONLY occurs when:

        race_status === "running"

Example:

    if (remaining_time === 0 && race_status === "running")

---

### 5. Validate active stint behavior

Ensure:

    race_status === "finished"

forces:

- no active stint rendering
- no dynamic updates
- UI remains static

---

### 6. Remove fragile fallbacks (if any)

If any logic uses:

    race_left_sec === 0

Replace with:

    race_status === "finished"

---

## Constraints

Do NOT:

- introduce new abstractions
- refactor structure
- rename variables
- change rendering flow
- optimize unrelated code

This must be a **surgical refactor only**

---

## Validation

### Case 1 — Running

    race_status = "running"

- UI updates normally
- blink works

---

### Case 2 — Paused

    race_status = "paused"

- UI frozen
- no blink

---

### Case 3 — Finished

    race_status = "finished"

- no blink
- no active stint
- UI fully stable

---

## Output

Provide:

1. List of changes made (file + line reference)
2. Short explanation per change
3. Confirmation of no behavior change

---

## Definition of Done

- No usage of race_left_sec for state decisions
- All state logic uses race_status
- No regression in UI behavior

---

## Notes

This is NOT a refactor for performance or architecture.

This is a **consistency and safety pass** to align frontend with backend truth.