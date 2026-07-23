import { describe, it, expect } from 'vitest';
import { countWords, rawWpm, effectiveWpm, comprehensionPct } from './wpm';

describe('countWords', () => {
  it('counts whitespace-separated words', () => {
    expect(countWords('the quick brown fox')).toBe(4);
  });

  it('collapses irregular whitespace and newlines', () => {
    expect(countWords('  hello \n\n  world\t! ')).toBe(3);
  });

  it('returns 0 for empty or whitespace-only input', () => {
    expect(countWords('')).toBe(0);
    expect(countWords('   \n ')).toBe(0);
  });
});

describe('rawWpm', () => {
  it('computes words per minute from words and elapsed ms', () => {
    // 300 words in 60_000 ms -> 300 wpm
    expect(rawWpm(300, 60_000)).toBe(300);
    // 100 words in 30_000 ms -> 200 wpm
    expect(rawWpm(100, 30_000)).toBe(200);
  });

  it('rounds to the nearest whole wpm', () => {
    expect(rawWpm(10, 1_000)).toBe(600);
  });

  it('returns 0 when no time has elapsed (guards divide-by-zero)', () => {
    expect(rawWpm(10, 0)).toBe(0);
  });
});

describe('comprehensionPct', () => {
  it('computes percent correct', () => {
    expect(comprehensionPct(3, 4)).toBe(75);
    expect(comprehensionPct(4, 4)).toBe(100);
    expect(comprehensionPct(0, 4)).toBe(0);
  });

  it('returns null when there are no questions', () => {
    expect(comprehensionPct(0, 0)).toBeNull();
  });
});

describe('effectiveWpm', () => {
  it('scales raw wpm by comprehension fraction', () => {
    expect(effectiveWpm(400, 75)).toBe(300);
    expect(effectiveWpm(400, 100)).toBe(400);
    expect(effectiveWpm(400, 0)).toBe(0);
  });

  it('equals raw wpm when comprehension is unknown (no quiz)', () => {
    expect(effectiveWpm(400, null)).toBe(400);
  });
});
