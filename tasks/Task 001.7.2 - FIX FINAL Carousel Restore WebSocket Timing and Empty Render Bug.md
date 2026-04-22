Task 001.7.2 - FIX FINAL Carousel Restore (WebSocket Timing + Empty Render Bug)

OBJECTIVE:
Fix DEFINITIVELY the carousel restore bug in iOS PWA.

Current implementation STILL FAILS because:
- Restore runs during EMPTY render (teams = [])
- sessionStorage is consumed too early
- restoredCarousel is set too early

---

ROOT CAUSE (CONFIRMED):

index.html does:

render({ race_left_sec: 0, teams: [] })

→ renderMobile() runs with EMPTY teams
→ restoredCarousel = true is set HERE ❌
→ sessionStorage is consumed HERE ❌

When real data arrives:
→ restore NEVER runs again

---

REQUIRED FIX (STRICT)

You MUST:

1. ONLY restore when teams.length > 0
2. NEVER set restoredCarousel = true before successful restore
3. NEVER remove sessionStorage before successful restore

---

IMPLEMENTATION

Locate this block in renderMobile():

    if (!restoredCarousel) {
        restoredCarousel = true;
        const savedIndex = sessionStorage.getItem(...)

THIS IS WRONG.

---

REPLACE WITH:

    if (!restoredCarousel && teams.length > 0) {

        const savedIndex = sessionStorage.getItem('esm_active_card');

        if (savedIndex !== null) {

            const targetIndex = parseInt(savedIndex);

            setTimeout(() => {
                const cards = el.querySelectorAll(".carousel-card");

                if (cards.length > 0 && cards[targetIndex]) {

                    cards[targetIndex].scrollIntoView({
                        behavior: 'auto',
                        inline: 'center'
                    });

                    activeCardIndex = targetIndex;

                    document.querySelectorAll(".dot").forEach((d, idx) => {
                        d.classList.toggle("active", idx === activeCardIndex);
                    });

                    sessionStorage.removeItem('esm_active_card');

                    restoredCarousel = true;
                }
            }, 80);

        } else {
            restoredCarousel = true;
        }
    }

---

IMPORTANT DETAILS

- DO NOT touch logic outside this block
- DO NOT change WebSocket
- DO NOT change stints.html
- DO NOT change storage key

---

CRITICAL CHANGE

REMOVE this line from original code:

    restoredCarousel = true;  // ❌ REMOVE FROM TOP

---

VALIDATION

Test EXACTLY this:

1. Swipe to card 3 or 4
2. Click 📋
3. Return

EXPECTED:

→ ALWAYS returns to SAME card  
→ Works even on slow network  
→ Works after refresh  
→ Works consistently on iOS Safari / PWA  

---

GOAL

Restore must happen ONLY when:

✔ DOM is ready  
✔ Cards exist  
✔ Data is loaded  

NEVER before that.

This is the FINAL FIX.

Update docs/checkpoint.md

