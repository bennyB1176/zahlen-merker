import type { NumberRound, NumberStats } from './types';

/**
 * Number-flash drill logic. A number is shown for a fraction of a second, then
 * recalled and typed. This trains perceptual span and visual working memory —
 * you cannot subvocalize 7+ digits in 250 ms, so it also discourages the inner
 * voice. All functions are pure.
 */

export const DIGITS_MIN = 4;
export const DIGITS_MAX = 12;

function clampDigits(digits: number): number {
  return Math.min(DIGITS_MAX, Math.max(DIGITS_MIN, Math.round(digits)));
}

/**
 * Generate a random number string of exactly `digits` digits with a non-zero
 * leading digit. `rng` is injectable (returns [0,1)) for deterministic tests.
 */
export function generateNumber(digits: number, rng: () => number = Math.random): string {
  const n = clampDigits(digits);
  let out = String(1 + Math.floor(rng() * 9)); // leading digit 1..9
  for (let i = 1; i < n; i++) {
    out += String(Math.floor(rng() * 10)); // 0..9
  }
  return out;
}

/** Compare the shown number with what the user typed, ignoring spaces. */
export function checkNumber(shown: string, typed: string): boolean {
  const normalized = typed.replace(/\s+/g, '');
  return normalized.length > 0 && normalized === shown;
}

/**
 * Adaptive staircase: +1 digit after a correct answer, −1 after a wrong one,
 * clamped to the supported range. Converges on the user's threshold span.
 */
export function nextDigits(
  current: number,
  wasCorrect: boolean,
  range: { min: number; max: number } = { min: DIGITS_MIN, max: DIGITS_MAX },
): number {
  const next = wasCorrect ? current + 1 : current - 1;
  return Math.min(range.max, Math.max(range.min, next));
}

/** Format a digit string into space-separated groups for readable display. */
export function groupDigits(numStr: string, size = 3): string {
  if (numStr.length <= size) return numStr;
  const groups: string[] = [];
  for (let i = 0; i < numStr.length; i += size) {
    groups.push(numStr.slice(i, i + size));
  }
  return groups.join(' ');
}

/** Aggregate number-drill rounds into dashboard stats. */
export function computeNumberStats(rounds: NumberRound[], today?: string): NumberStats {
  if (rounds.length === 0) {
    return { bestSpan: 0, accuracyPct: null, rounds: 0, todayBest: 0 };
  }
  const correct = rounds.filter((r) => r.correct);
  const bestSpan = correct.reduce((max, r) => Math.max(max, r.digits), 0);
  const accuracyPct = Math.round((correct.length / rounds.length) * 100);
  const todayBest = today
    ? correct
        .filter((r) => r.date.slice(0, 10) === today)
        .reduce((max, r) => Math.max(max, r.digits), 0)
    : bestSpan;
  return { bestSpan, accuracyPct, rounds: rounds.length, todayBest };
}
