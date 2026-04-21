Task 001 — Live UI Refactor (Stint-Centric Design)

Context

This task focuses on improving the UI of the Live PWA (index.html) used for real-time stint monitoring.

The system already works correctly and is fed by a WebSocket stream.

⚠️ This is a visual-only refactor.

🚨 CRITICAL RULE (DO NOT VIOLATE)

DO NOT change, intercept, or alter ANY data coming from WebSockets.
DO NOT modify business logic.
DO NOT change timing behavior.
DO NOT remove any fields from the data model.

🔒 Data Integrity Requirement

The system MUST preserve:

- All WebSocket data fields
- All timing calculations
- All state transitions (deck, box, check-in, etc.)

Even if some fields are not used visually, they MUST remain intact.

⸻

🧠 Architectural Awareness (MANDATORY)

Before making any change:

1. Read:
    * docs/architectural.md
2. Inspect project structure:
    * /js/view-models/
    * /js/utils/
    * rendering functions inside index.html
3. Understand:

This is a VIEW layer only.
Data and logic come from the ViewModel and WebSocket stream.

Objective

Improve the UI to:

- maximize readability
- improve visual hierarchy
- preserve ALL information
- adapt layout to screen size dynamically

🔹 Part 1 — UI Refinement (Already Validated Mock)

Follow the validated mock exactly:

Key rules:

* Team color → thin top border only
* Active driver → large time
* Inactive drivers → show stint balance
* States → shown as subtle badges (BOX / CHECK-IN)
* Deck → slightly grey background

⸻

🔹 Part 2 — State Visualization (DO NOT CHANGE LOGIC)

States already exist in the system.

You must ONLY improve how they are displayed:

```
State         UI
DECK          grey card
BOX           badge + timer
CHECK-IN      badge + countdow
```

🔹 Part 3 — Responsive Layout (IMPORTANT)

Current layout does not scale well.

Improve grid behavior so that:

- cards ALWAYS fill available screen space
- avoid very small cards
- avoid large empty areas
- avoid truncation

Requirements

Use CSS Grid or equivalent to ensure:

- dynamic number of columns
- minimum readable card width
- cards expand to fill space

Suggested direction (do not blindly apply)

grid-template-columns: repeat(auto-fit, minmax(Xpx, 1fr));

You MUST determine the best X based on:

* readability of time values
* mobile usability
* desktop / TV distance viewing

🔹 Part 4 — Strict Constraints

DO NOT:

* modify WebSocket handlers
* modify ViewModel logic
* change how time is calculated
* remove or rename fields
* introduce new data

⸻

ONLY modify:

- HTML structure (minimally)
- CSS
- rendering layout (visual only)

🔹 Part 5 — Validation Criteria

Data Integrity

* All WebSocket data still flows unchanged ✔
* No console errors ✔

⸻

UI

* Time is dominant element ✔
* Cards are consistent ✔
* States are clearly visible ✔
* Layout fills screen properly ✔

⸻

Responsiveness

* Works on mobile ✔
* Works on desktop ✔
* Works on large screens / TV ✔

⸻

📦 Output Requirements

Provide:

1. Updated index.html (or minimal diff)
2. Explanation of layout changes
3. Confirmation that NO logic was altered

⸻

🚨 Definition of Done

- Zero regression in logic
- Zero data loss
- Improved readability
- Responsive layout working correctly

