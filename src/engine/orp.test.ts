import { describe, it, expect } from 'vitest';
import { pivotIndex, splitAtPivot } from './orp';

describe('pivotIndex (Optimal Recognition Point)', () => {
  it('places the pivot at 0 for a single character', () => {
    expect(pivotIndex('a')).toBe(0);
  });

  it('places the pivot on the first letter for 2–5 char words', () => {
    // Spritz-style ORP: short words pivot on the 2nd character (index 1).
    expect(pivotIndex('cat')).toBe(1);
    expect(pivotIndex('read')).toBe(1);
    expect(pivotIndex('quick')).toBe(1);
  });

  it('moves the pivot rightward for longer words', () => {
    expect(pivotIndex('reading')).toBe(2); // 6–9 chars -> index 2
    expect(pivotIndex('comprehension')).toBe(3); // 10–13 chars -> index 3
  });

  it('never returns an index outside the word', () => {
    for (const w of ['a', 'to', 'the', 'extraordinarily', 'antidisestablishment']) {
      const i = pivotIndex(w);
      expect(i).toBeGreaterThanOrEqual(0);
      expect(i).toBeLessThan(w.length);
    }
  });

  it('treats the empty string safely', () => {
    expect(pivotIndex('')).toBe(0);
  });
});

describe('splitAtPivot', () => {
  it('splits a word into before / pivot / after around the ORP', () => {
    const parts = splitAtPivot('reading');
    expect(parts.before + parts.pivot + parts.after).toBe('reading');
    expect(parts.pivot).toHaveLength(1);
    expect(parts.pivotIndex).toBe(2);
    expect(parts.pivot).toBe('a');
  });

  it('handles the empty string without throwing', () => {
    const parts = splitAtPivot('');
    expect(parts).toEqual({ before: '', pivot: '', after: '', pivotIndex: 0 });
  });
});
