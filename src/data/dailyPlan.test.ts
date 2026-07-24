import { describe, it, expect } from 'vitest';
import {
  computeDailyPlan,
  DAILY_READING_GOAL,
  DAILY_NUMBERS_GOAL,
} from './dailyPlan';
import type { NumberRound, Session } from '../engine/types';

function makeSession(date: string): Session {
  return {
    id: crypto.randomUUID(),
    date,
    mode: 'rsvp',
    passageId: 'p1',
    passageTitle: 'Test',
    targetWpm: 300,
    wordsRead: 200,
    durationMs: 40_000,
    rawWpm: 300,
    comprehensionPct: 80,
    eWpm: 240,
  };
}

function makeRound(date: string): NumberRound {
  return {
    id: crypto.randomUUID(),
    date,
    digits: 5,
    flashMs: 400,
    shown: '12345',
    typed: '12345',
    correct: true,
  };
}

const TODAY = '2026-07-24';

describe('computeDailyPlan', () => {
  it('reports nothing done for empty input', () => {
    const plan = computeDailyPlan([], [], TODAY);
    expect(plan.readingDone).toBe(0);
    expect(plan.numbersDone).toBe(0);
    expect(plan.allComplete).toBe(false);
    expect(plan.readingGoal).toBe(DAILY_READING_GOAL);
    expect(plan.numbersGoal).toBe(DAILY_NUMBERS_GOAL);
  });

  it('counts only today items and ignores other days', () => {
    const sessions = [
      makeSession(`${TODAY}T09:00:00.000Z`),
      makeSession(`${TODAY}T18:00:00.000Z`),
      makeSession('2026-07-23T10:00:00.000Z'),
    ];
    const rounds = [
      makeRound(`${TODAY}T09:05:00.000Z`),
      makeRound('2026-07-20T10:00:00.000Z'),
    ];
    const plan = computeDailyPlan(sessions, rounds, TODAY);
    expect(plan.readingDone).toBe(2);
    expect(plan.numbersDone).toBe(1);
  });

  it('flags completion when goals are met', () => {
    const sessions = Array.from({ length: DAILY_READING_GOAL }, () =>
      makeSession(`${TODAY}T09:00:00.000Z`),
    );
    const rounds = Array.from({ length: DAILY_NUMBERS_GOAL }, () =>
      makeRound(`${TODAY}T09:05:00.000Z`),
    );
    const plan = computeDailyPlan(sessions, rounds, TODAY);
    expect(plan.readingComplete).toBe(true);
    expect(plan.numbersComplete).toBe(true);
    expect(plan.allComplete).toBe(true);
  });

  it('is not complete when only one goal is met', () => {
    const sessions = Array.from({ length: DAILY_READING_GOAL }, () =>
      makeSession(`${TODAY}T09:00:00.000Z`),
    );
    const plan = computeDailyPlan(sessions, [], TODAY);
    expect(plan.readingComplete).toBe(true);
    expect(plan.numbersComplete).toBe(false);
    expect(plan.allComplete).toBe(false);
  });
});
