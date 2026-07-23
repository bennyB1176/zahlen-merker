import { describe, it, expect } from 'vitest';
import { PASSAGES, getPassage } from './passages';

describe('bundled passages', () => {
  it('ships several passages', () => {
    expect(PASSAGES.length).toBeGreaterThanOrEqual(3);
  });

  it('has a computed word count matching the text for every passage', () => {
    for (const p of PASSAGES) {
      expect(p.wordCount).toBe(p.text.trim().split(/\s+/).length);
      expect(p.wordCount).toBeGreaterThan(50);
    }
  });

  it('has unique ids', () => {
    const ids = PASSAGES.map((p) => p.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('has valid comprehension questions (answerIndex within options)', () => {
    for (const p of PASSAGES) {
      expect(p.questions.length).toBeGreaterThanOrEqual(1);
      for (const q of p.questions) {
        expect(q.options.length).toBeGreaterThanOrEqual(2);
        expect(q.answerIndex).toBeGreaterThanOrEqual(0);
        expect(q.answerIndex).toBeLessThan(q.options.length);
      }
    }
  });

  it('looks up a passage by id', () => {
    const first = PASSAGES[0]!;
    expect(getPassage(first.id)).toBe(first);
    expect(getPassage('does-not-exist')).toBeUndefined();
  });
});
