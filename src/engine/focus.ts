/**
 * Focus / anti-subvocalization helpers.
 *
 * Subvocalization — silently "saying" each word — caps reading speed at roughly
 * talking speed. Two independent counters live here:
 *
 * 1. A **speed push**: past ~450 WPM the inner voice physically cannot keep up,
 *    so recognition has to go visual. `pushTargetWpm` jumps to that threshold.
 * 2. A **metronome distractor**: a steady beat occupies the articulatory loop
 *    (articulatory suppression). `beatIntervalMs` converts BPM to a delay the
 *    audio hook schedules on.
 */

/** WPM at/above which sustained subvocalization becomes impractical. */
export const SUBVOCAL_THRESHOLD_WPM = 450;

/** Default / bounds for the metronome distractor, in beats per minute. */
export const DEFAULT_DISTRACTOR_BPM = 120;
export const DISTRACTOR_BPM_MIN = 60;
export const DISTRACTOR_BPM_MAX = 240;

/**
 * Raise a target speed to at least the subvocalization threshold, leaving
 * already-fast targets untouched. Callers clamp to their own WPM range.
 */
export function pushTargetWpm(current: number): number {
  return Math.max(current, SUBVOCAL_THRESHOLD_WPM);
}

/** Milliseconds between metronome beats for a given BPM (bpm is clamped first). */
export function beatIntervalMs(bpm: number): number {
  const safe = Math.min(DISTRACTOR_BPM_MAX, Math.max(DISTRACTOR_BPM_MIN, bpm));
  return 60000 / safe;
}

/** Clamp a requested BPM into the supported range. */
export function clampBpm(bpm: number): number {
  return Math.min(DISTRACTOR_BPM_MAX, Math.max(DISTRACTOR_BPM_MIN, Math.round(bpm)));
}
