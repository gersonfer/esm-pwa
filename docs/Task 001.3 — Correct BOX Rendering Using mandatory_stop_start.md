Task 001.3 — Correct BOX Rendering Using mandatory_stop_start

Context

Task 001.2 removed incorrect inference logic for BOX state.

However, BOX is still not rendered correctly because the frontend is checking non-existent fields:

team.box
team.is_box
team.flag === "box"

These fields are not part of the real data model.

🚨 CRITICAL RULE

Do NOT guess field names.

Do NOT infer state.

UI must bind to real domain fields already used by the backend.

🧠 Domain Model (MANDATORY UNDERSTANDING)

In ESM:

BOX is NOT a boolean flag.

BOX is defined by:

team.mandatory_stop_start != null

Meaning
```
Field		                        Meaning

mandatory_stop_start                timestamp when BOX started

null                                team is NOT in BOX 
```

Therefore:

BOX state exists ONLY if mandatory_stop_start is present

🎯 Objective

Replace incorrect BOX detection with proper binding to:

team.mandatory_stop_start

🔧 Implementation

Step 1 — Remove incorrect logic

Delete completely:

team.box === true
team.is_box === true
team.flag === "box"

Step 2 — Implement correct BOX detection

Use:

let boxHtml = "";

if (team.mandatory_stop_start) {

Step 3 — Timer calculation

Assume mandatory_stop_start is a timestamp (seconds).

const now = Date.now() / 1000;
const elapsed = Math.floor(now - team.mandatory_stop_start);

const m = Math.floor(elapsed / 60).toString().padStart(2, "0");
const s = (elapsed % 60).toString().padStart(2, "0");

boxHtml = `<span class="badge-box">BOX ${m}:${s}</span>`;

Step 4 — Rendering location

BOX must appear:

Team header (same place as category badge)

Example:

Ferrari [P]   [BOX 04:27]

🚫 Forbidden

* DO NOT use driver fields
* DO NOT use position_time_sec
* DO NOT infer from check_in
* DO NOT create fallback logic

⸻

🧪 Validation (MANDATORY)

Case 1 — Team in BOX

Given:

mandatory_stop_start != null

BOX MM:SS

Case 2 — Team NOT in BOX

Given:

mandatory_stop_start == null

UI must show:

NO BOX

Case 3 — Driver in CHECK-IN

* show ⏱ countdown
* NO BOX unless mandatory_stop_start exists

Case 4 — Team in DECK

* grey card
* NO BOX

🚨 Definition of Done

- BOX is rendered ONLY using mandatory_stop_start
- Timer reflects real elapsed time
- No guessed fields remain
- No regression in UI or logic

🧠 Important Note (for the Agent)

The backend already encodes the domain correctly.

Your job is NOT to interpret it.
Your job is to render it faithfully.


