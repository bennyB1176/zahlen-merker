import { describe, it, expect } from 'vitest';
import { scoreQuiz, updateStreak } from './scoring';
import type { Question } from './types';

const questions: Question[] = [
  { q: 'Q1', options: ['a', 'b'], answerIndex: 0 },
  { q: 'Q2', options: ['a', 'b'], answerIndex: 1 },
  { q: 'Q3', options: ['a', 'b'], answerIndex: 0 },
  { q: 'Q4', options: ['a', 'b'], answerIndex: 1 },
];

describe('scoreQuiz', () => {
  it('counts correct answers and returns a percentage', () => {
    const result = scoreQuiz(questions, [0, 1, 0, 1]);
    expect(result.correct).toBe(4);
    expect(result.total).toBe(4);
    expect(result.pct).toBe(100);
  });

  it('handles partial correctness', () => {
    const result = scoreQuiz(questions, [0, 0, 0, 0]);
    expect(result.correct).toBe(2);
    expect(result.pct).toBe(50);
  });

  it('treats missing/undefined answers as incorrect', () => {
    const result = scoreQuiz(questions, [0]);
    expect(result.correct).toBe(1);
    expect(result.pct).toBe(25);
  });

  it('returns null pct when there are no questions', () => {
    const result = scoreQuiz([], []);
    expect(result.pct).toBeNull();
    expect(result.total).toBe(0);
  });
});

describe('updateStreak', () => {
  it('starts a streak at 1 when there was no prior session', () => {
    expect(updateStreak(0, null, '2026-07-23')).toBe(1);
  });

  it('increments when the last session was yesterday', () => {
    expect(updateStreak(3, '2026-07-22', '2026-07-23')).toBe(4);
  });

  it('keeps the streak when practising twice on the same day', () => {
    expect(updateStreak(3, '2026-07-23', '2026-07-23')).toBe(3);
  });

  it('resets to 1 when a day was missed', () => {
    expect(updateStreak(5, '2026-07-20', '2026-07-23')).toBe(1);
  });
});
