// ── Stint View Model ───────────────────────────────────────────
// Composes historical stint data (immutable, event-driven) with
// live driver state (mutable, real-time) into a flat display array.
//
// This is a FRONTEND-ONLY composition layer.
// The backend snapshot remains a pure transport — no computation,
// inference, or reconstruction happens server-side.
//
// Architectural rules:
//   1. Historical stints come from team.stint_history (authoritative)
//   2. Active stint comes from team.drivers (live state)
//   3. Virtual stint is NOT persisted — exists only in the UI layer
//   4. Completed stints are never modified after event capture

/**
 * Build a flat array of stint rows for display.
 *
 * @param {Object} team - Snapshot team object from WebSocket.
 * @param {Array}  team.stint_history - Historical stint records (immutable).
 * @param {Array}  team.drivers - Live driver state (mutable).
 * @returns {Array<Object>} Flat array of stint view models.
 *
 * Each returned object has:
 *   - driver_name: string
 *   - driver_id: number|null
 *   - duration_sec: number|null
 *   - balance_sec: number|null
 *   - started_at: number|null
 *   - ended_at: number|null
 *   - _active: boolean (true only for the live stint)
 */
export function buildStintViewModel(team) {
  // Defensive: handle null/undefined team
  if (!team) return [];

  // ── Historical stints (completed, authoritative) ────────────
  const historical = (team.stint_history || [])
    .filter(s => s.ended_at != null)            // only finished stints
    .slice()                                     // shallow clone
    .sort((a, b) => a.started_at - b.started_at); // chronological

  // ── Active stint (live, derived from driver state) ──────────
  const activeDriver = (team.drivers || []).find(d => d.check_in);

  if (!activeDriver) return historical;         // no one driving

  const elapsed = Math.max(
    0,
    (activeDriver.stint_duration_sec || 0) - (activeDriver.stint_left_sec || 0)
  );
  const balance = activeDriver.stint_left_sec || 0;

  return [
    ...historical,
    {
      driver_name: activeDriver.name || "Desconhecido",
      driver_id: activeDriver.driver_id || null,
      started_at: null,                         // unknown from snapshot
      ended_at: null,                           // still active
      duration_sec: elapsed,                    // live derived value
      balance_sec: balance,                     // live derived value
      _active: true                             // UI marker
    }
  ];
}
