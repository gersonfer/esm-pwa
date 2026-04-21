Task 001.2 — Fix BOX State Rendering (Remove Invalid Inference)

Context

During Task 001.1, the UI introduced an incorrect assumption for detecting the BOX state.

Current implementation:

If no driver is in check-in → assume team is in BOX

This is incorrect.

UI MUST NEVER infer race state.

UI MUST ONLY reflect explicit state coming from data.

🧠 Domain Model Clarification (MANDATORY)

You MUST understand the following:

🔹 Team states
```
State      Meaning

DECK        Team is out of track rotation

BOX         Mandatory pit stop (team-level)

```

🔹 Driver state
```
State          Meaning

CHECK-IN       Driver is taking control (60s window)
```
❗ IMPORTANT

CHECK-IN ≠ active driver
CHECK-IN ≠ BOX
NO CHECK-IN ≠ BOX

❌ Current Incorrect Logic

Remove completely:

const hasActiveDriver = (team.drivers||[]).some(d => d.check_in);

if (!hasActiveDriver) {
  // assume BOX ❌
}

🎯 Objective

Fix BOX rendering so that:

🔹 Part 1 — Inspect Data Model

Before implementing:

1. Log a real WebSocket payload
2. Identify if BOX is provided as:

team.is_box
team.box
team.flag === "box"
or similar

🔹 Part 2 — Correct Rendering Logic

CASE 1 — BOX field EXISTS

Use it directly:

if (team.is_box === true) {
  boxHtml = `<span class="badge-box">BOX ${timer}</span>`;
}

CASE 2 — BOX field DOES NOT exist

DO NOT render BOX at all

🚫 DO NOT:

* infer from check_in
* infer from missing active driver
* infer from timers
* infer from any indirect signal

🔹 Part 3 — Timer Handling

If BOX has a timer:

* use ONLY explicit field from data

If no timer exists:

display only "BOX"

🔹 Part 4 — Preserve Everything Else

DO NOT change:

* CHECK-IN logic
* DECK rendering
* driver rendering
* WebSocket handling
* ViewModel

⸻

🔹 Part 5 — Validation (MANDATORY)

Case 1 — Team in DECK

* card is grey ✔
* NO BOX shown ✔

⸻

Case 2 — Driver in CHECK-IN

* shows ⏱ countdown ✔
* NO BOX shown ✔

⸻

Case 3 — No active driver

* NOTHING inferred ✔
* NO BOX shown ✔

Case 4 — Explicit BOX (if exists)

* BOX appears ✔
* timer correct ✔

🚨 Definition of Done

- No inferred BOX state exists
- UI reflects ONLY explicit backend data
- No regression introduced


