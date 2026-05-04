### Task 003.3 — Positioning the active driver's balance time 


In the card, the active driver is being displayed like this:

[TIME]
[NAME + BADGE]

Change to:
[NAME + BADGES] [TIME]

Example of desired visual result after the change:

 Driver Name [S] [⏱40s] 01:36:03

- The behavior of the check-in timer should not be changed.
- The timer display logic should not be changed, but it should fit within the line when it appears without pushing other items in the line.

- aligned
- consistent with inactive layout
- responsive
- no break

### Conclusion

The correct adjustment is:

- remove the time from the vertical flow
- place it as the second item in the horizontal flex
- prioritize the name in terms of space

