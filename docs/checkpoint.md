Project: esm-live-pwa

Task 001 — Live UI Refactor (Stint-Centric Design)
Status: **COMPLETED**

### Summary of Completed Work
- **UI Refinement**: Implemented the validated mock rules. Changed team color to thin top border only, increased font size for active driver timers, and displayed stint balance for inactive drivers.
- **State Visualization**: Converted internal driver states (`check_in`) to subtle visual badges (`CHECK-IN` and `BOX`) accompanied by their respective positional timers and countdowns.
- **Responsive Layout**: Replaced the desktop CSS grid constraints to utilize `grid-template-columns: repeat(auto-fit, minmax(340px, 1fr))` and `max-content` rows, allowing dynamic scaling without empty gaps or truncation.
- **Data Integrity Preserved**: Performed changes strictly inside the `renderDriverCard` and layout functions in `index.html` and matching classes in `styles.css`. No WebSocket handlers, timing calculations, or JavaScript model structures were altered.

Task 001.1 — Live PWA UI Refinement (Final Polishing)
Status: **COMPLETED**

### Summary of Completed Work
- **Domain Alignment**: Restructured state indicators to reflect their proper domain levels. Moved `BOX` and `DECK` states strictly to the Team header level. Confined `CHECK-IN` strictly to the Driver level.
- **Visual Encoding**: Replaced legacy emoji-based indicators (team stars ⭐ and driver medals ●) with minimalist, unified letter badges (`[P] [S] [A] [L]`, `[P] [G] [S] [B]`).
- **Noise Reduction**: Completely eliminated progress bars and redundant BOX badges from driver rows, shifting focus entirely onto the numbers.
- **Layout Consistency**: Standardized driver layouts based on activity state. Active drivers present a dominant large stint balance with an optional inline positional timer (`⏱ 11s`). Inactive drivers concisely show their name, skill badge, and remaining stint balance.
- **Header Refinement**: Increased the prominence of the main race timer (`1.4rem`) while keeping track badges compact.

Task 001.2 — Fix BOX State Rendering (Remove Invalid Inference)
Status: **COMPLETED**

### Summary of Completed Work
- **Logic Correction**: Fully removed the UI-layer inference that falsely derived a `BOX` state when no driver was checked in.
- **Strict Data Binding**: Rewrote the team header logic to render the `BOX` state exclusively when explicitly commanded by the backend payload (using `team.is_box`, `team.box`, or `team.flag`).
- **Timer Handling**: Pit timers are now safely drawn only if explicitly provided (`team.box_timer` or `team.box_time`), otherwise rendering a clean `BOX` badge without guessing values from inactive drivers.

Task 001.3 — Correct BOX Rendering Using mandatory_stop_start
Status: **COMPLETED**

### Summary of Completed Work
- **Strict Domain Binding**: Replaced the speculative explicit field checks (`team.box`, `team.is_box`, `team.flag`) with the actual backend field `team.mandatory_stop_start`. The `BOX` state now perfectly aligns with the server data model.
- **Timestamp Calculation**: Refactored the pit timer to calculate elapsed time dynamically using `Math.floor(Date.now() / 1000 - team.mandatory_stop_start)`, rendering correctly formatted `MM:SS` logic directly inside the team header.
- **No Regressions**: Checked-in driver logic and Decked team logic remains intact and purely distinct from pit status.

Task 001.4 — UI Refinements (No WebSocket Changes)
Status: **COMPLETED**

### Summary of Completed Work
- **Driver Skill Badges**: Ensured the driver skill badge (e.g. `[P]`, `[S]`) is always rendered for both active and inactive drivers to preserve hierarchy and constant domain visibility.
- **Stint Balance Color Logic**: Enhanced the `renderDriverCard` color-coding to reflect exact threshold bounds: `>= 300s` is Green (`var(--ok)`), `< 300s` is Yellow (`var(--warn)`), `<= 120s` is Red (`var(--alert)`), and `0s` blinks Red but exclusively if the main race status is `running`. 
- **Mobile Portrait Optimization**: Reduced the overall vertical card padding and margin boundaries, decreasing unnecessary internal white-space and allowing much more of the card content to be visible vertically without needing to scroll.
- **Mobile Landscape Grid Fix**: Upgraded the `#carousel` wrapper to utilize standard `flex` gaps and mathematically robust padding logic (`calc(50% - 6px)`), allowing exactly two completely clean non-overflowing cards to sit side-by-side perfectly.

Task 001.5 — Final UI Refinements
Status: **COMPLETED**

### Summary of Completed Work
- **Consistent Driver Skills**: Validated that `medals(d.skill)` correctly applies to both Active and Inactive driver rows across the board.
- **DECK Status Label**: Explicitly mapped the `team.deck` state to visually push a `[DECK]` badge to the far right corner of the team header, complementing the greyed-out card styling.
- **Stints Link Evolution**: Minimized the old full-text "Stints" button into a sleek, transparent clipboard icon (`📋`) bound dynamically to the bottom-left of every team card.
- **Portrait Vertical Spacing**: Introduced the `.drivers-container` wrapper to dynamically handle spacing within the `.carousel-card`. Using targeted `@media` queries exclusively for mobile portrait, the active driver and timer rows are now perfectly distributed inside the card's height, eradicating the compressed "top-heavy" look while explicitly leaving the landscape twin-grid untouched.

Task 001.6 — Standardizing UI of stints.html (PWA Viewer)
Status: **COMPLETED**

### Summary of Completed Work
- **Card Layout Uniformity**: Wrapped the content of `stints.html` inside a new `.stints-card` element, sharing the identical shadow, background, layout dimensions, and dynamic top border color mapping as `index.html`.
- **Typographic & Hierarchy Synchronization**: Swapped the clunky text-based "<- Race" back button for a minimalist, SVG-based caret button that feels significantly cleaner, mapping to the new streamlined aesthetic constraints.
- **Color Re-Mapping**: Addressed the anomalous legacy yellow tint embedded in `.stint-header` by overriding it with the native design token `rgba(255, 255, 255, 0.05)`, removing visual friction across pages.
- **Responsive Padding Integrity**: Included specific logic in the `@media (max-width: 899px)` block to constrain card paddings dynamically, so mobile views preserve the consistent flow and padding density seen natively in `index.html`.
