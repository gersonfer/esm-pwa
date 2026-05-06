## TASK-003.4 — Restore Inactive Drivers Rendering (Fix Regression)

### MODE
STRICT FIX (MINIMAL CHANGE)

---

## CONTEXT

Current code:

js ${[...(team.drivers || [])]   .sort((a, b) => (b.check_in ? 1 : 0) - (a.check_in ? 1 : 0))   .map(d => renderDriverCard(d))   .join("")} 

This introduced a regression:

❌ Only active driver is visible  
❌ Inactive drivers are missing or not rendered correctly  

---

## ROOT CAUSE

The current sort comparator:

js (b.check_in ? 1 : 0) - (a.check_in ? 1 : 0) 

is not deterministic and may break rendering order.

---

## OBJECTIVE

Restore correct behavior:

- ALL drivers must be rendered
- Active driver appears first
- Remaining drivers keep original order

---

## IMPLEMENTATION

Replace the comparator with a deterministic version:

js ${[...(team.drivers || [])]   .sort((a, b) => {     if (a.check_in !== b.check_in) {       return a.check_in ? -1 : 1;     }     return 0;   })   .map(d => renderDriverCard(d))   .join("")} 

---

## APPLY IN BOTH

- renderDesktop
- renderMobile

---

## VALIDATION

### Case A
Input:
[A, B(active), C]

Expected:
[B, A, C]

---

### Case B
Input:
[A(active), B, C]

Expected:
[A, B, C]

---

### Case C
Input:
[A, B, C]

Expected:
[A, B, C]

---

## CONSTRAINTS

- Do NOT filter drivers
- Do NOT modify renderDriverCard
- Do NOT change layout
- Do NOT introduce new logic

---

## DEFINITION OF DONE

- All drivers rendered  
- Active first  
- Order stable  
- No regression
- Update docs/checkpoint.md to reflect the changes in the code
