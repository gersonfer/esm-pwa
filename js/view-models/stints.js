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
 * @param {string} raceStatus - Current race status from snapshot.
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
export function buildStintViewModel(team, raceStatus) {
  // Defensive: handle null/undefined team
  if (!team) return [];

  // ── Historical stints (completed, authoritative) ────────────
  const raw = (team.stint_history || [])
    .filter(s => s.ended_at != null)
    .slice()
    .sort((a, b) => a.started_at - b.started_at);

  const historical = raw.map((s, idx) => {
    const currentDriverId = s.driver_id ?? null;
    const currentDriverName = s.driver_name ?? null;

    // 🔥 encontra o último segmento anterior do mesmo piloto
    const prevSameDriver = [...raw.slice(0, idx)]
      .reverse()
      .find(p => {
        const pId = p.driver_id ?? null;
        const pName = p.driver_name ?? null;

        if (currentDriverId != null && pId != null) {
          return String(pId) === String(currentDriverId);
        }

        if (currentDriverName != null && pName != null) {
          return pName.trim().toLowerCase() === currentDriverName.trim().toLowerCase();
        }

        return false;
      });

    // 🎯 REGRA FINAL
    let duration;

    if (prevSameDriver && prevSameDriver.balance_sec != null) {
      // segmentos seguintes → usa saldo anterior
      duration = prevSameDriver.balance_sec;
    } else {
      // primeiro segmento → total do stint
      duration = s.duration_sec ?? null;
    }

    return {
      driver_name: s.driver_name,
      driver_id: s.driver_id ?? null,
      started_at: s.started_at ?? null,
      ended_at: s.ended_at ?? null,
      duration_sec: duration,
      balance_sec: s.balance_sec ?? null,
      _active: false
    };
  });

  // ── Race status gate ─────────────────────────────────────────
  const normalizedStatus = String(raceStatus || "").toLowerCase();
  const raceFinished =
    normalizedStatus === "finished" ||
    normalizedStatus === "race_over" ||
    normalizedStatus === "stopped" ||
    normalizedStatus === "ended" ||
    normalizedStatus === "completed";

  // ── Active stint (live, derived from driver state) ──────────
  const activeDriver = (team.drivers || []).find(d => d.check_in);

  // No active driver or race already ended → only historical rows
  if (!activeDriver || raceFinished) return historical;

  const elapsed = Math.max(
    0,
    (activeDriver.stint_duration_sec || 0) - (activeDriver.stint_left_sec || 0)
  );

  const balance = activeDriver.stint_left_sec || 0;

  // If balance reached zero, do not show as active anymore
  if (balance === 0) return historical;

  return [
    ...historical,
    {
      driver_name: activeDriver.name || "Desconhecido",
      driver_id: activeDriver.driver_id ?? null,
      started_at: null,
      ended_at: null,
      duration_sec: elapsed,
      balance_sec: balance,
      _active: true
    }
  ];
}