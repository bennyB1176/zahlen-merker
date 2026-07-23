import type { Session } from '../engine/types';

export interface TrendPoint {
  date: string;
  eWpm: number;
  rawWpm: number;
  comprehensionPct: number | null;
}

export interface Progress {
  totalSessions: number;
  totalWords: number;
  bestEWpm: number;
  baselineEWpm: number;
  latestEWpm: number;
  improvementPct: number;
  avgComprehension: number | null;
  trend: TrendPoint[];
}

export function emptyProgress(): Progress {
  return {
    totalSessions: 0,
    totalWords: 0,
    bestEWpm: 0,
    baselineEWpm: 0,
    latestEWpm: 0,
    improvementPct: 0,
    avgComprehension: null,
    trend: [],
  };
}

/** Derive dashboard metrics from a set of sessions (order-independent). */
export function computeProgress(sessions: Session[]): Progress {
  if (sessions.length === 0) return emptyProgress();

  const sorted = [...sessions].sort((a, b) => a.date.localeCompare(b.date));
  const first = sorted[0]!;
  const last = sorted[sorted.length - 1]!;

  const totalWords = sorted.reduce((sum, s) => sum + s.wordsRead, 0);
  const bestEWpm = sorted.reduce((max, s) => Math.max(max, s.eWpm), 0);

  const withQuiz = sorted.filter(
    (s): s is Session & { comprehensionPct: number } => s.comprehensionPct !== null,
  );
  const avgComprehension =
    withQuiz.length === 0
      ? null
      : Math.round(
          withQuiz.reduce((sum, s) => sum + s.comprehensionPct, 0) / withQuiz.length,
        );

  const improvementPct =
    first.eWpm === 0 ? 0 : Math.round(((last.eWpm - first.eWpm) / first.eWpm) * 100);

  return {
    totalSessions: sorted.length,
    totalWords,
    bestEWpm,
    baselineEWpm: first.eWpm,
    latestEWpm: last.eWpm,
    improvementPct,
    avgComprehension,
    trend: sorted.map((s) => ({
      date: s.date,
      eWpm: s.eWpm,
      rawWpm: s.rawWpm,
      comprehensionPct: s.comprehensionPct,
    })),
  };
}
