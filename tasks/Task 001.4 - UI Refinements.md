# Task 001.4
 — UI Refinements (No WebSocket Changes)

## Objective
Improve visual clarity, responsiveness and domain readability of Live PWA UI without modifying:
- WebSocket payload
- Data flow
- View-model logic

---

## 1. Driver Skill Badge — FIX

### Problem
Badge is not consistently visible for all drivers.

### Requirement
Skill badge MUST always be visible for every driver, independent of:
- active / inactive
- check-in / box / deck

### Rule
Driver row = Name + Skill badge (always)

---

## 2. Stint Balance Visual Signal

### Applies ONLY to ACTIVE driver

### Color rules
- nremaining_time >= 300 seconds → GREEN
- remaining_time < 300 seconds → YELLOW
- remaining_time <= 120 seconds → RED
- remaining_time == 0 → RED + BLINK (ONLY if race is running)

### Constraint
If race timer == 0 → NO blinking

---

## 3. Mobile Portrait — Layout Optimization

### Problem
- Card too tall
- Poor vertical usage
- Almost overflowing viewport

### Requirement
Cards should fit better vertically, reducing internal spacing without losing readability.

### Guidelines
- Reduce internal padding
- Reduce active block height
- Reduce spacing between drivers
- Preserve visual hierarchy

### Goal
More content visible without scrolling.

---

## 4. Mobile Landscape — Grid Fix

### Problem
- Cards truncated
- Layout too tight
- No spacing between columns

### Requirement
- 2 cards per row
- Proper spacing between cards
- No truncation

### Rules
- Cards MUST NOT overflow
- Cards MUST NOT compress content
- Maintain readable margins

---

## HARD CONSTRAINTS

DO NOT:
- Modify WebSocket handling
- Modify data model
- Add inferred states
- Change business logic

---

## Definition of Done

- Skill badge visible for all drivers
- Stint balance colors applied correctly
- Blink only when saldo == 0 AND race running
- Mobile portrait improved (no overflow)
- Mobile landscape shows 2 clean cards side by side
- Task progress status and summary of acitivities documented in docs/checkpoint.md 
