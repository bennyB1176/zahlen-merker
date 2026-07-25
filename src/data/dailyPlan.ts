import type { NumberRound, Session } from '../engine/types';

/**
 * A light daily practice prescription. Consistency beats marathon sessions, so
 * the plan is a small, repeatable routine: a few reading-with-quiz passages plus
 * one number-flash set, ~15–20 minutes total.
 */

export const DAILY_READING_GOAL = 3;
export const DAILY_NUMBERS_GOAL = 5;
export const DAILY_MINUTES = '15–20 min';

export interface DailyPlan {
  readingDone: number;
  readingGoal: number;
  numbersDone: number;
  numbersGoal: number;
  readingComplete: boolean;
  numbersComplete: boolean;
  allComplete: boolean;
}

/** The YYYY-MM-DD day key of an ISO timestamp. */
function dayKey(iso: string): string {
  return iso.slice(0, 10);
}

/**
 * Count today's reading sessions and number-flash rounds against the daily
 * goals. Order-independent; `today` is a YYYY-MM-DD day key.
 */
export function computeDailyPlan(
  sessions: Session[],
  numberRounds: NumberRound[],
  today: string,
): DailyPlan {
  const readingDone = sessions.filter((s) => dayKey(s.date) === today).length;
  const numbersDone = numberRounds.filter((r) => dayKey(r.date) === today).length;

  const readingComplete = readingDone >= DAILY_READING_GOAL;
  const numbersComplete = numbersDone >= DAILY_NUMBERS_GOAL;

  return {
    readingDone,
    readingGoal: DAILY_READING_GOAL,
    numbersDone,
    numbersGoal: DAILY_NUMBERS_GOAL,
    readingComplete,
    numbersComplete,
    allComplete: readingComplete && numbersComplete,
  };
}
