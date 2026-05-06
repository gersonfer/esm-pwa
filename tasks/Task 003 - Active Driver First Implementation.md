TASK-003.2 — Active Driver First (Implementation)

MODE

STRICT IMPLEMENTATION (NO REFACTOR, NO EXTRA CHANGES)

⸻

CONTEXT

Current UI renders drivers in the order received from backend:

(team.drivers || []).map(d => renderDriverCard(d))

This causes the active driver (check_in = true) to appear in arbitrary positions.

OBJECTIVE

Ensure that:

✅ The active driver (check_in === true) is ALWAYS rendered first in the list

Without altering:

* backend contract
* rendering logic
* visual structure

⸻

SCOPE

Modify ONLY:

* renderDesktop(data)
* renderMobile(data)

DO NOT touch:

* renderDriverCard
* CSS
* WebSocket handling
* other UI logic

### Apply in BOTH render paths

You MUST apply the same logic in:

* renderDesktop
* renderMobile

⸻

### VALIDATION

Case A — Active driver in middle

Input:

[ A, B(active), C ]

Expected:

[ B, A, C ]

Case B — Active already first

Input:

[ A(active), B, C ]

Expected:

[ A(active), B, C ]

Case C — No active driver

Input:

[ A, B, C ] (all check_in: false)

Expected:

[ A, B, C ] (no change)

⸻

### CONSTRAINTS

* Do NOT mutate original array
* Do NOT change driver object structure
* Do NOT introduce new dependencies
* Keep logic O(n log n) or better

⸻

### OUTPUT REQUIREMENTS

Provide:

1. Files modified
2. Exact diff
3. Confirmation:
    * works in desktop
    * works in mobile
    * no regression observed

⸻

### DEFINITION OF DONE

* Active driver always appears first
* UI behavior remains stable
* No side effects
* docs/checkpoint.md updated with changes


