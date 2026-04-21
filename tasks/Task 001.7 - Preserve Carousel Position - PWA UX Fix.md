Task 001.7 - Preserve Carousel Position - PWA UX Fix

OBJECTIVE:
Fix UX issue in iOS PWA where user loses carousel position when navigating to stints.html and returning to index.html.

When a user:
1. Is viewing a specific team card in the carousel
2. Clicks the stints icon
3. Navigates back

The UI MUST restore the SAME card position.

---

SCOPE:
This is a SMALL UX STATE FIX.

Allowed changes:
- JavaScript (index.html only)
- Navigation handling

DO NOT change:
- Data structures
- Backend
- Rendering logic
- CSS (unless strictly necessary)

---

IMPLEMENTATION STRATEGY:

Use sessionStorage to persist the active carousel index.

---

1. SAVE CURRENT CARD INDEX

When user clicks the stints icon:

- Capture current carousel index
- Store in sessionStorage using key:

    "esm_active_card"

Example:

    sessionStorage.setItem('esm_active_card', currentCardIndex);

IMPORTANT:
- Use existing carousel logic to determine index
- DO NOT hardcode values

---

2. RESTORE POSITION ON LOAD

On index.html load:

- Read sessionStorage key:

    const savedIndex = sessionStorage.getItem('esm_active_card');

- If exists:
    - Navigate carousel to that index

Example:

    if (savedIndex !== null) {
        goToCarouselIndex(parseInt(savedIndex));
    }

---

3. CLEANUP (OPTIONAL BUT RECOMMENDED)

After restoring:

    sessionStorage.removeItem('esm_active_card');

---

4. EDGE CASES

Handle safely:

- If index is invalid → ignore
- If carousel not yet initialized → delay execution (setTimeout or equivalent)
- Must NOT break normal first load behavior

---

5. CONSTRAINTS

- MUST NOT break swipe navigation
- MUST NOT interfere with normal carousel controls
- MUST work in iOS PWA (Safari WebKit)

---

6. VALIDATION

Test flow:

1. Swipe to 3rd or 4th card
2. Click stints icon
3. Navigate back

EXPECTED:
→ Same card is restored

---

DELIVERABLE:

- Minimal JS addition
- Clean integration with existing carousel
- No regressions
- Update checkpoint.md with the changes made
- Commit changes to git with the message "Task 001.7 - Preserve Carousel Position - PWA UX Fix"

---

GOAL:

User returns EXACTLY to the team card they came from.
