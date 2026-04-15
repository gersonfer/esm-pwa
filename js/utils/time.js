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

/**
 * Format a Unix timestamp (seconds) as HH:MM:SS wall-clock time.
 * Returns "—" for falsy input.
 */
export function fmtTs(ts) {
  if (!ts) return "—";
  const d = new Date(ts * 1000);
  const hh = String(d.getHours()).padStart(2, "0");
  const mm = String(d.getMinutes()).padStart(2, "0");
  const ss = String(d.getSeconds()).padStart(2, "0");
  return `${hh}:${mm}:${ss}`;
}
