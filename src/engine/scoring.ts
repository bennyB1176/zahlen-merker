import type { Question } from './types';
import { comprehensionPct } from './wpm';

export interface QuizResult {
  correct: number;
  total: number;
  pct: number | null;
}

/** Score a comprehension quiz. Missing answers count as incorrect. */
export function scoreQuiz(questions: Question[], answers: number[]): QuizResult {
  let correct = 0;
  questions.forEach((question, i) => {
    if (answers[i] === question.answerIndex) correct += 1;
  });
  return {
    correct,
    total: questions.length,
    pct: comprehensionPct(correct, questions.length),
  };
}

const MS_PER_DAY = 86_400_000;

function daysBetween(from: string, to: string): number {
  const a = Date.parse(`${from}T00:00:00Z`);
  const b = Date.parse(`${to}T00:00:00Z`);
  return Math.round((b - a) / MS_PER_DAY);
}

/**
 * Update the daily practice streak.
 * - No prior session -> streak of 1.
 * - Same day -> unchanged.
 * - Consecutive day -> +1.
 * - Gap of 2+ days -> reset to 1.
 */
export function updateStreak(
  currentStreak: number,
  lastSessionDate: string | null,
  today: string,
): number {
  if (lastSessionDate === null) return 1;
  const gap = daysBetween(lastSessionDate, today);
  if (gap === 0) return currentStreak;
  if (gap === 1) return currentStreak + 1;
  return 1;
}
