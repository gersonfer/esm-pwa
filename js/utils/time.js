// ── Time formatting utilities ──────────────────────────────────
// Pure functions, no side effects, defensive null checks.

/**
 * Format seconds as HH:MM:SS.
 * Returns "--:--:--" for non-number or negative input.
 */
export function formatTime(sec) {
  if (typeof sec !== "number") return "--:--:--";
  sec = Math.max(0, sec | 0);
  const h = String(Math.floor(sec / 3600)).padStart(2, "0");
  const m = String(Math.floor((sec % 3600) / 60)).padStart(2, "0");
  const s = String(sec % 60).padStart(2, "0");
  return `${h}:${m}:${s}`;
}

/**
 * Alias for formatTime — legacy compatibility.
 */
export const fmt = formatTime;

