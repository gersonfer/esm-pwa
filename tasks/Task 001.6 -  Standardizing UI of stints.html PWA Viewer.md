PROMPT — Task 001.6: Standardizing UI of stints.html (PWA Viewer)

OBJECTIVE:
Standardize the visual design of stints.html to match EXACTLY the design system used in index.html.

IMPORTANT:
This is a VISUAL/CSS task only.
DO NOT modify:
- JavaScript logic
- Data structure
- Event handling
- Rendering logic

ONLY adjust:
- CSS
- Classes
- Colors
- Spacing
- Typography

---

1. DESIGN ALIGNMENT (MANDATORY)

stints.html must follow the SAME visual rules as index.html:

- Background colors
- Card styles
- Border radius
- Shadows
- Typography scale
- Color variables (use existing CSS variables from styles.css)

DO NOT create new color palette.
REUSE existing tokens (e.g., --ok, --warn, --alert, etc).

---

2. CARD STRUCTURE

- Apply same card layout used for team cards in index.html:
  - Dark background
  - Subtle shadow
  - Rounded corners
  - Internal padding consistency

- Maintain spacing rhythm identical to index.html

---

3. TEXT & HIERARCHY

- Titles, labels, and values must follow same hierarchy:
  - Primary: bold, high contrast
  - Secondary: muted text
  - Timing values: same font weight/style as timers in index.html

---

4. COLORS

- Use EXACT same colors:
  - Background
  - Text primary/secondary
  - Highlight (yellow/orange)
  - Status colors (green/yellow/red)

- Remove any inconsistent or legacy colors from stints.html

---

5. BUTTONS / INTERACTIONS

- Any buttons or clickable elements:
  - Must visually match index.html (minimalist style)
  - No bulky buttons
  - Prefer icon-based where applicable

---

6. SPACING & RESPONSIVENESS

- Maintain same spacing philosophy:
  - Balanced vertical spacing
  - No “top-heavy” layout

- Ensure mobile portrait:
  - Content is well distributed vertically
  - No compression at the top

- Landscape:
  - Keep consistent density with index.html

---

7. CONSISTENCY CHECKLIST

Before finishing, validate:

- stints.html looks like a natural extension of index.html
- No visual “break” when navigating between pages
- Same design language across:
  - colors
  - spacing
  - typography
  - components

---

DELIVERABLE:

- Updated stints.html
- Updated styles.css (if needed, but reuse as much as possible)
- ZERO logic changes

---

GOAL:

User should not perceive stints.html as a separate screen,
but as a continuation of the same UI system.
