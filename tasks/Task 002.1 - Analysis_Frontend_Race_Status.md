Task 002.1 — Analysis of Frontend Refactor Opportunities (race_status)

Context
The backend is now the authority of state, exposing:
race_status: "running" | "paused" | "finished"

Example Snapshot:
{ "kind": "snapshot", "race_left_sec": 0, "race_status": "finished", ... }

Objective
Perform a STRICT ANALYSIS (no code changes) to identify where the frontend incorrectly infers state using race_left_sec or implicit conditions, and map the path to a "Pure Render Layer" driven by race_status.

Target Files
Analyze ONLY these files for state logic:

index.html
stints.html
js/view-models/stints.js
js/utils/time.js

Instructions
1. Chain-of-Thought Analysis
Before providing the output, think step-by-step about:
Every instance where race_left_sec is used for visibility or logic.
Where paused is treated as a terminal state.
How the UI handles the transition from running -> finished when time is 0.

2. Identify State Inference Patterns
Map every usage of:

race_left_sec <= 0
!running / running
Implicit timer-based blink/visibility logic.

Classify each finding as:

REDUNDANT: Can be removed immediately in favor of race_status.
RISKY: Logic that depends on a specific timing that race_status might not cover alone.
LEGACY: To be kept only if it's purely for display (e.g., the digits of the clock).

3. Detection of Terminal State Assumptions
Find logic that assumes time == 0 means the race is over. In the new backend, the race is only over when race_status === "finished".

4. Refactor Mapping (Categorized)
Group findings by:

Timer & Visuals: (Blinking, freeze logic).
Driver/Team UI: (BOX/DECK status, check-in visibility).
Global UI: (Banners and Action buttons).

Output Format (Mandatory)
Executive Summary: High-level overview of technical debt regarding state inference.

Inference Mapping Table: | File | Line | Pattern | Classification | Impact |
| :--- | :--- | :--- | :--- | :--- |

Proposed Refactor Strategy: A step-by-step plan for Task 002.2 (Implementation).

Conclusion: Are there any gaps in the backend snapshot to fulfill the frontend needs?

Constraints
STRICTLY ANALYSIS. Do not modify files.

English Only. All analysis and documentation must be in English.

Output File: Save the final result to docs/analysis-002.1.md.