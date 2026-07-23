import { describe, it, expect } from 'vitest';
import { tokenize, buildRsvpSequence, wordDelayMs } from './rsvp';

describe('tokenize', () => {
  it('splits text into word tokens, preserving punctuation on the token', () => {
    expect(tokenize('Hello, world!')).toEqual(['Hello,', 'world!']);
  });

  it('handles multiple spaces and newlines', () => {
    expect(tokenize('a\n\nb   c')).toEqual(['a', 'b', 'c']);
  });

  it('returns an empty array for empty input', () => {
    expect(tokenize('   ')).toEqual([]);
  });

  it('groups words into chunks when chunkSize > 1', () => {
    expect(tokenize('one two three four five', 2)).toEqual([
      'one two',
      'three four',
      'five',
    ]);
  });
});

describe('wordDelayMs', () => {
  it('returns the base delay for a target wpm', () => {
    // 300 wpm -> 60_000 / 300 = 200ms base
    expect(wordDelayMs('cat', 300)).toBeCloseTo(200, 0);
  });

  it('adds extra dwell time for longer words', () => {
    const shortD = wordDelayMs('cat', 300);
    const longD = wordDelayMs('extraordinarily', 300);
    expect(longD).toBeGreaterThan(shortD);
  });

  it('adds extra dwell time after sentence-ending punctuation', () => {
    const plain = wordDelayMs('word', 300);
    const ending = wordDelayMs('end.', 300);
    expect(ending).toBeGreaterThan(plain);
  });
});

describe('buildRsvpSequence', () => {
  it('builds one entry per token with pivot + duration', () => {
    const seq = buildRsvpSequence('The quick fox', 300, 1);
    expect(seq).toHaveLength(3);
    const first = seq[0]!;
    expect(first.text).toBe('The');
    expect(first.before + first.pivot + first.after).toBe('The');
    expect(first.durationMs).toBeGreaterThan(0);
  });

  it('total duration scales inversely with target wpm', () => {
    const slow = buildRsvpSequence('one two three four five', 200, 1);
    const fast = buildRsvpSequence('one two three four five', 600, 1);
    const sum = (s: { durationMs: number }[]) => s.reduce((a, w) => a + w.durationMs, 0);
    expect(sum(slow)).toBeGreaterThan(sum(fast));
  });

  it('returns an empty sequence for empty text', () => {
    expect(buildRsvpSequence('', 300, 1)).toEqual([]);
  });
});
