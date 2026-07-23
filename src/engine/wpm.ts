/** Reading-speed and comprehension math. All functions are pure. */

const MS_PER_MINUTE = 60_000;

/** Count whitespace-separated words in a block of text. */
export function countWords(text: string): number {
  const trimmed = text.trim();
  if (trimmed === '') return 0;
  return trimmed.split(/\s+/).length;
}

/** Words per minute, rounded. Guards against divide-by-zero. */
export function rawWpm(words: number, elapsedMs: number): number {
  if (elapsedMs <= 0) return 0;
  return Math.round((words * MS_PER_MINUTE) / elapsedMs);
}

/**
 * Comprehension as a percentage (0–100), or null when no questions were asked
 * (e.g. pasted text with no quiz).
 */
export function comprehensionPct(correct: number, total: number): number | null {
  if (total <= 0) return null;
  return Math.round((correct / total) * 100);
}

/**
 * Effective WPM — the headline KPI. Raw speed scaled by how much was actually
 * understood, so reading fast without comprehension does not inflate the score.
 * When comprehension is unknown, effective speed equals raw speed.
 */
export function effectiveWpm(raw: number, comprehension: number | null): number {
  if (comprehension === null) return raw;
  return Math.round((raw * comprehension) / 100);
}
