Task 001.1 — Live PWA UI Refinement (Final Polishing)

Context

This task refines the Live PWA UI (index.html) after initial redesign (Task 001).

The goal is to:

- simplify visual language
- align UI with domain model
- improve clarity under real race conditions

This is a visual-only refinement.

⸻

🚨 CRITICAL RULE (NON-NEGOTIABLE)

DO NOT modify:
- WebSocket data flow
- ViewModel logic
- timing calculations
- state transitions

DO NOT remove any data fields.

This task is strictly UI / presentation layer.

🧠 Domain Alignment (MANDATORY)

The UI MUST reflect:

- Team states (BOX, DECK) belong to TEAM level
- Driver states (CHECK-IN) belong to DRIVER level

🎯 Part 1 — Replace Visual Encoding (Badges)

🔹 Team Category (replace stars)

Replace:

⭐⭐⭐⭐

[P] [S] [A] [L]

Mapping:

Category		        Badge

PRO				       P

PRO-AM		            S

AM			           A

LIGHT		            L

🔹 Driver Skill (replace dots)
Replace:

●●●●

With:

[P] [G] [S] [B]

Mapping:

Skill   		Badge

Platinum		P

Gold			G

Silver			S

Bronze			B

🔹 Badge Style (STRICT)

.badge-letter {
  display: inline-flex;
  align-items: center;
  justify-content: center;

  width: 18px;
  height: 18px;

  font-size: 0.7rem;
  font-weight: 700;

  background: #3b82f6;
  color: #000;

  border-radius: 4px;
  margin-left: 6px;

  opacity: 0.85;
}

🎯 Part 2 — Fix State Representation

🔹 BOX (TEAM LEVEL)

* MUST be displayed in team header
* MUST NOT appear in driver rows

Example:

Ferrari [P]   [BOX 02:15]

🔹 DECK (TEAM LEVEL)

* Apply .deck class to card
* grey background

⸻

🔹 CHECK-IN (DRIVER LEVEL)

* Remove progress bar
* Show ONLY countdown

Example:

⏱ 11s

Optional subtle animation allowed (low intensity).

⸻

🎯 Part 3 — Remove Visual Noise

MUST REMOVE:

- driver dots (●●●●)
- team stars (⭐⭐⭐⭐)
- check-in progress bar
- BOX badge inside driver rows

🎯 Part 4 — Layout Consistency

Ensure all team cards follow the SAME structure:

[Top border color]

Team Name + Category Badge + Optional BOX

Active Driver:
  - Large time
  - Name
  - Optional CHECK-IN

Inactive Drivers:
  - Name + skill badge
  - Remaining stint time

🎯 Part 5 — Preserve Existing Improvements

DO NOT break:

- top color border (team identity)
- responsive grid behavior
- time hierarchy (active driver prominent)
- stint balance display

🎯 Part 6 — Header Refinement

Improve header readability:

- slightly increase race timer prominence
- keep track badge compact

🔹 Validation Checklist

Data Integrity

* WebSocket data unchanged
* No logic modified
* No console errors

⸻

UI Clarity

* Active driver easily identifiable
* Team state (BOX/DECK) instantly visible
* Driver state (CHECK-IN) clear
* Badges readable at glance

⸻

Consistency

* No mixed representations (stars/dots removed)
* All cards follow same structure

⸻

🚨 Definition of Done

- Visual simplification achieved
- Domain alignment correct
- No regression in functionality
- UI readable in < 1 second glance


