import { describe, it, expect } from 'vitest';
import {
  generateNumber,
  checkNumber,
  nextDigits,
  groupDigits,
  computeNumberStats,
  DIGITS_MIN,
  DIGITS_MAX,
} from './numberflash';
import type { NumberRound } from './types';

describe('generateNumber', () => {
  it('produces a string of exactly `digits` characters', () => {
    for (let d = DIGITS_MIN; d <= DIGITS_MAX; d++) {
      expect(generateNumber(d, () => 0.5)).toHaveLength(d);
    }
  });

  it('never has a leading zero (so it truly has N digits)', () => {
    // rng=0 would map every digit to 0; leading digit must still be 1..9.
    const n = generateNumber(6, () => 0);
    expect(n).toHaveLength(6);
    expect(n[0]).not.toBe('0');
  });

  it('contains only digit characters', () => {
    const n = generateNumber(8, Math.random);
    expect(n).toMatch(/^[0-9]+$/);
  });

  it('clamps requested digit counts into range', () => {
    expect(generateNumber(0, () => 0.5).length).toBe(DIGITS_MIN);
    expect(generateNumber(999, () => 0.5).length).toBe(DIGITS_MAX);
  });
});

describe('checkNumber', () => {
  it('matches identical strings', () => {
    expect(checkNumber('123456', '123456')).toBe(true);
  });

  it('ignores spaces and surrounding whitespace in the typed answer', () => {
    expect(checkNumber('123456', ' 123 456 ')).toBe(true);
  });

  it('rejects a wrong answer', () => {
    expect(checkNumber('123456', '123457')).toBe(false);
  });

  it('rejects empty input', () => {
    expect(checkNumber('123456', '')).toBe(false);
  });
});

describe('nextDigits (adaptive staircase)', () => {
  it('adds a digit after a correct answer', () => {
    expect(nextDigits(6, true)).toBe(7);
  });

  it('removes a digit after a wrong answer', () => {
    expect(nextDigits(6, false)).toBe(5);
  });

  it('never goes below the minimum', () => {
    expect(nextDigits(DIGITS_MIN, false)).toBe(DIGITS_MIN);
  });

  it('never goes above the maximum', () => {
    expect(nextDigits(DIGITS_MAX, true)).toBe(DIGITS_MAX);
  });
});

describe('groupDigits', () => {
  it('groups digits from the left in blocks of three by default', () => {
    expect(groupDigits('123456')).toBe('123 456');
    expect(groupDigits('1234567')).toBe('123 456 7');
  });

  it('supports a custom group size', () => {
    expect(groupDigits('12345678', 4)).toBe('1234 5678');
  });

  it('returns short strings unchanged', () => {
    expect(groupDigits('12')).toBe('12');
  });
});

function round(over: Partial<NumberRound> = {}): NumberRound {
  return {
    id: crypto.randomUUID(),
    date: '2026-07-24T10:00:00.000Z',
    digits: 6,
    flashMs: 400,
    shown: '123456',
    typed: '123456',
    correct: true,
    ...over,
  };
}

describe('computeNumberStats', () => {
  it('returns zeros for no rounds', () => {
    const s = computeNumberStats([]);
    expect(s).toEqual({ bestSpan: 0, accuracyPct: null, rounds: 0, todayBest: 0 });
  });

  it('best span is the largest digit count answered correctly', () => {
    const rounds = [
      round({ digits: 6, correct: true }),
      round({ digits: 9, correct: false }), // wrong -> does not count
      round({ digits: 8, correct: true }),
    ];
    expect(computeNumberStats(rounds).bestSpan).toBe(8);
  });

  it('computes accuracy across all rounds', () => {
    const rounds = [
      round({ correct: true }),
      round({ correct: true }),
      round({ correct: false }),
      round({ correct: false }),
    ];
    expect(computeNumberStats(rounds).accuracyPct).toBe(50);
  });

  it('counts total rounds', () => {
    expect(computeNumberStats([round(), round(), round()]).rounds).toBe(3);
  });

  it('todayBest only counts correct rounds from the given day', () => {
    const rounds = [
      round({ date: '2026-07-24T09:00:00.000Z', digits: 7, correct: true }),
      round({ date: '2026-07-23T09:00:00.000Z', digits: 12, correct: true }),
    ];
    expect(computeNumberStats(rounds, '2026-07-24').todayBest).toBe(7);
  });
});
