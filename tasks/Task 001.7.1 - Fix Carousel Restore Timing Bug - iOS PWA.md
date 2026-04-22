PROMPT — Task 001.7.1 - Fix Carousel Restore Timing Bug (iOS PWA)

OBJECTIVE:
Fix the bug where carousel position is NOT restored correctly after returning from stints.html.

ROOT CAUSE:
The restore logic is executed BEFORE real team data is loaded (teams = []),
causing the saved index to be consumed too early and lost.

---

SCOPE:
- Modify ONLY index.html JavaScript
- DO NOT change:
  - Backend
  - Data structure
  - stints.html
  - CSS

---

REQUIRED FIX:

1. DELAY RESTORE UNTIL DATA IS AVAILABLE

Only attempt to restore carousel position when:

    teams.length > 0

---

2. DO NOT CONSUME sessionStorage TOO EARLY

Current issue:
- sessionStorage is read and cleared on first empty render

Fix:
- Only read AND remove sessionStorage AFTER successful restore

---

3. IMPLEMENT SAFE RESTORE LOGIC

Replace current logic with:

Pseudo:

if (!restoredCarousel AND teams.length > 0) {

    const savedIndex = sessionStorage.getItem('esm_active_card');

    if (savedIndex !== null) {

        const targetIndex = parseInt(savedIndex);

        setTimeout(() => {
            const cards = document.querySelectorAll('.carousel-card');

            if (cards[targetIndex]) {

                cards[targetIndex].scrollIntoView({
                    behavior: 'auto',
                    inline: 'center'
                });

                activeCardIndex = targetIndex;

                updateDots();

                sessionStorage.removeItem('esm_active_card');

                restoredCarousel = true;
            }
        }, 50);

    } else {
        restoredCarousel = true;
    }
}

---

4. IMPORTANT RULES

- DO NOT set restoredCarousel = true before successful restore
- DO NOT remove sessionStorage before confirming card exists
- MUST work with WebSocket delayed data

---

5. EDGE CASES

Handle safely:
- savedIndex inválido → ignorar
- cards ainda não renderizados → retry com pequeno delay

---

6. VALIDATION

Test:

1. Swipe to 3rd or 4th team
2. Click stints
3. Go back

EXPECTED:
→ Same card is restored (100% consistent)

---

GOAL:

Restore MUST happen only when UI is ready.
Never consume state prematurely.
