import { splitAtPivot } from './orp';
import type { RsvpWord } from './types';

const MS_PER_MINUTE = 60_000;

/**
 * Split text into display tokens. With `chunkSize` > 1, consecutive words are
 * grouped so more than one word flashes at a time (trains a wider perceptual
 * span). Punctuation stays attached to its word.
 */
export function tokenize(text: string, chunkSize = 1): string[] {
  const words = text.trim() === '' ? [] : text.trim().split(/\s+/);
  if (chunkSize <= 1) return words;
  const chunks: string[] = [];
  for (let i = 0; i < words.length; i += chunkSize) {
    chunks.push(words.slice(i, i + chunkSize).join(' '));
  }
  return chunks;
}

/**
 * How long a single token should stay on screen. Starts from the base delay for
 * the target speed, then dwells longer on long words and after punctuation —
 * mirroring how natural reading slows at clause and sentence boundaries, which
 * protects comprehension at speed.
 */
export function wordDelayMs(token: string, targetWpm: number): number {
  const base = MS_PER_MINUTE / targetWpm;
  const len = token.length;
  const lengthFactor = 1 + Math.max(0, len - 6) * 0.05;

  let punctuationFactor = 1;
  if (/[.!?]["')\]]?$/.test(token)) punctuationFactor = 1.8;
  else if (/[,;:]["')\]]?$/.test(token)) punctuationFactor = 1.4;

  return base * lengthFactor * punctuationFactor;
}

/** Build the full RSVP display sequence for a passage. */
export function buildRsvpSequence(
  text: string,
  targetWpm: number,
  chunkSize = 1,
): RsvpWord[] {
  return tokenize(text, chunkSize).map((token) => {
    const parts = splitAtPivot(token);
    return {
      text: token,
      pivotIndex: parts.pivotIndex,
      before: parts.before,
      pivot: parts.pivot,
      after: parts.after,
      durationMs: wordDelayMs(token, targetWpm),
    };
  });
}
