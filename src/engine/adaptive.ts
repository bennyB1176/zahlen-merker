/**
 * Adaptive progressive overload. Speed only climbs while comprehension holds in
 * a comfortable band; it backs off when understanding drops. This encodes the
 * core evidence-based rule: train speed *at the edge of* — not beyond —
 * comprehension.
 */

/** Below this comprehension %, slow down. */
export const COMPREHENSION_FLOOR = 70;
/** At or above this comprehension %, it's safe to speed up. */
export const COMPREHENSION_CEILING = 85;

const MIN_WPM = 100;
const MAX_WPM = 1000;
const INCREASE = 1.1; // +10%
const DECREASE = 0.95; // -5%

function clamp(wpm: number): number {
  return Math.min(MAX_WPM, Math.max(MIN_WPM, wpm));
}

/**
 * Suggest the next target WPM given the current target and the comprehension %
 * just achieved. Returns the current target unchanged when comprehension is
 * unknown (no quiz) or within the comfortable band.
 */
export function nextTargetWpm(current: number, comprehension: number | null): number {
  if (comprehension === null) return clamp(current);
  if (comprehension >= COMPREHENSION_CEILING)
    return clamp(Math.round(current * INCREASE));
  if (comprehension < COMPREHENSION_FLOOR) return clamp(Math.round(current * DECREASE));
  return clamp(current);
}
