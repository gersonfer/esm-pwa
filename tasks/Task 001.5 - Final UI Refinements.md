TAsk 001.5 - Final UI Refinements

OBJECTIVE:
Apply UI refinements ONLY (no business logic changes). Maintain full compatibility with current snapshot structure.

---

1. DRIVER SKILL — ALL DRIVERS

- Display SKILL badge for ALL drivers (active and inactive).
- This includes the ACTIVE driver (currently missing).
- Badge must appear next to driver name.

Mapping (already used, keep consistent):
P = Platinum
G = Gold
S = Silver
B = Bronze

---

2. TEAM STATUS — DECK

- When team is in DECK state:
  - Add label "DECK" aligned to the RIGHT side of the card header.
  - Keep current background styling (no changes).
  - Only ADD the text "DECK".

---

3. STINTS LINK (UI FIX)

- Remove current "Stints" button (text + layout).
- Replace with:
  - A SINGLE icon (clipboard or similar)
  - Position: bottom-left of the card
  - No text label
  - Action: open stints.html

---

4. MOBILE PORTRAIT SPACING

- Current issue: content is compressed at the top.

Fix:
- Increase vertical spacing between:
  - Timer
  - Active driver
  - Driver list

- Distribute content to better fill the card height.
- Avoid “top-heavy” layout.

NOTE:
- Do NOT change landscape behavior (2 cards per row stays).

---

5. CONSTRAINTS

- DO NOT change:
  - Any JavaScript logic
  - Snapshot structure
  - Data flow

- ONLY modify:
  - index.html
  - styles.css

---

6. NEXT STEP (NOT PART OF THIS TASK)

After completion:
- Apply same UI standard to stints.html
- Then move to WebSockets integration

---

DELIVERABLE:
- Clean, consistent UI aligned with current design system
- No regressions
- Update docs/checkpoint.md with the changes made
- Commit changes to git with the message "Task 001.5 - Final UI Refinements"

