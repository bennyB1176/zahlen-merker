import { describe, it, expect } from 'vitest';
import { nextTargetWpm, COMPREHENSION_FLOOR, COMPREHENSION_CEILING } from './adaptive';

describe('nextTargetWpm (adaptive progressive overload)', () => {
  it('increases the target when comprehension is strong', () => {
    const next = nextTargetWpm(300, 90);
    expect(next).toBeGreaterThan(300);
  });

  it('decreases the target when comprehension is poor', () => {
    const next = nextTargetWpm(300, 40);
    expect(next).toBeLessThan(300);
  });

  it('holds the target within the comfortable band', () => {
    const mid = Math.round((COMPREHENSION_FLOOR + COMPREHENSION_CEILING) / 2);
    expect(nextTargetWpm(300, mid)).toBe(300);
  });

  it('does not change the target when comprehension is unknown', () => {
    expect(nextTargetWpm(300, null)).toBe(300);
  });

  it('never drops below a sane minimum', () => {
    expect(nextTargetWpm(100, 0)).toBeGreaterThanOrEqual(100);
  });

  it('never jumps above a sane maximum', () => {
    expect(nextTargetWpm(1000, 100)).toBeLessThanOrEqual(1000);
  });

  it('changes by at most ~10% per step', () => {
    const next = nextTargetWpm(400, 100);
    expect(next).toBeLessThanOrEqual(440);
  });
});
