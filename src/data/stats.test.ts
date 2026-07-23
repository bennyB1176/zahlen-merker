import { describe, it, expect } from 'vitest';
import { computeProgress, emptyProgress } from './stats';
import type { Session } from '../engine/types';

function makeSession(over: Partial<Session>): Session {
  return {
    id: crypto.randomUUID(),
    date: '2026-07-23T10:00:00.000Z',
    mode: 'rsvp',
    passageId: 'p1',
    passageTitle: 'Test',
    targetWpm: 300,
    wordsRead: 200,
    durationMs: 40_000,
    rawWpm: 300,
    comprehensionPct: 80,
    eWpm: 240,
    ...over,
  };
}

describe('computeProgress', () => {
  it('returns an empty summary for no sessions', () => {
    expect(computeProgress([])).toEqual(emptyProgress());
  });

  it('aggregates totals across sessions', () => {
    const sessions = [
      makeSession({ wordsRead: 100, eWpm: 200 }),
      makeSession({ wordsRead: 250, eWpm: 300 }),
    ];
    const p = computeProgress(sessions);
    expect(p.totalSessions).toBe(2);
    expect(p.totalWords).toBe(350);
    expect(p.bestEWpm).toBe(300);
  });

  it('uses the oldest session as baseline and newest as latest', () => {
    const sessions = [
      makeSession({ date: '2026-07-01T10:00:00.000Z', eWpm: 180 }),
      makeSession({ date: '2026-07-20T10:00:00.000Z', eWpm: 260 }),
    ];
    const p = computeProgress(sessions);
    expect(p.baselineEWpm).toBe(180);
    expect(p.latestEWpm).toBe(260);
    expect(p.improvementPct).toBe(44); // (260-180)/180 -> 44%
  });

  it('is order-independent (sorts by date internally)', () => {
    const a = makeSession({ date: '2026-07-01T10:00:00.000Z', eWpm: 180 });
    const b = makeSession({ date: '2026-07-20T10:00:00.000Z', eWpm: 260 });
    expect(computeProgress([b, a]).baselineEWpm).toBe(180);
  });

  it('averages comprehension, ignoring sessions without a quiz', () => {
    const sessions = [
      makeSession({ comprehensionPct: 100 }),
      makeSession({ comprehensionPct: 50 }),
      makeSession({ comprehensionPct: null }),
    ];
    expect(computeProgress(sessions).avgComprehension).toBe(75);
  });

  it('builds a chronological trend series of effective WPM', () => {
    const sessions = [
      makeSession({ date: '2026-07-20T10:00:00.000Z', eWpm: 260 }),
      makeSession({ date: '2026-07-01T10:00:00.000Z', eWpm: 180 }),
    ];
    const trend = computeProgress(sessions).trend;
    expect(trend.map((t) => t.eWpm)).toEqual([180, 260]);
  });
});
