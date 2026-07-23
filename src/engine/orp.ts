/**
 * Optimal Recognition Point (ORP) — the letter the eye should fixate on so a
 * word is recognised with a single fixation. RSVP trainers (Spritz-style) align
 * this "pivot" letter to a fixed point on screen so the eye never moves.
 *
 * The pivot drifts rightward as words get longer, capped so it stays near the
 * front third of the word.
 */
export function pivotIndex(word: string): number {
  const len = word.length;
  if (len <= 1) return 0;
  if (len <= 5) return 1;
  if (len <= 9) return 2;
  if (len <= 13) return 3;
  return 4;
}

export interface PivotParts {
  before: string;
  pivot: string;
  after: string;
  pivotIndex: number;
}

/** Split a word into the characters before / at / after its ORP pivot. */
export function splitAtPivot(word: string): PivotParts {
  const i = pivotIndex(word);
  return {
    before: word.slice(0, i),
    pivot: word.charAt(i),
    after: word.slice(i + 1),
    pivotIndex: i,
  };
}
