/** Reading practice modes supported by the trainer. */
export type ReadingMode = 'rsvp' | 'highlight';

/** A single word prepared for RSVP display. */
export interface RsvpWord {
  /** The raw token, e.g. "reading," */
  text: string;
  /** Index of the Optimal Recognition Point (pivot) letter within `text`. */
  pivotIndex: number;
  /** Characters before the pivot letter. */
  before: string;
  /** The pivot letter itself. */
  pivot: string;
  /** Characters after the pivot letter. */
  after: string;
  /** How long this word should stay on screen, in milliseconds. */
  durationMs: number;
}

/** A comprehension question (single correct answer). */
export interface Question {
  q: string;
  options: string[];
  answerIndex: number;
}

/** A reading passage bundled with the app or pasted by the user. */
export interface Passage {
  id: string;
  title: string;
  author?: string;
  source: string;
  license: string;
  text: string;
  wordCount: number;
  questions: Question[];
}

/** A recorded practice session (one passage read + optional quiz). */
export interface Session {
  id: string;
  /** ISO timestamp. */
  date: string;
  mode: ReadingMode;
  passageId: string;
  passageTitle: string;
  targetWpm: number;
  wordsRead: number;
  durationMs: number;
  rawWpm: number;
  /** 0–100; null when no quiz was taken (e.g. pasted text). */
  comprehensionPct: number | null;
  /** rawWpm × comprehension fraction; equals rawWpm when no quiz. */
  eWpm: number;
}

/** Persisted user settings & progress counters. */
export interface Settings {
  baselineWpm: number | null;
  currentTargetWpm: number;
  chunkSize: number;
  streak: number;
  lastSessionDate: string | null;
  /** Current adaptive digit-span level for the number-flash drill. */
  numberDigits: number;
  /** How long the number flashes, in milliseconds. */
  numberFlashMs: number;
}

/** One round of the number-flash drill. */
export interface NumberRound {
  id: string;
  /** ISO timestamp. */
  date: string;
  digits: number;
  flashMs: number;
  shown: string;
  typed: string;
  correct: boolean;
}

/** Aggregated number-flash stats for the dashboard. */
export interface NumberStats {
  /** Largest digit count ever recalled correctly. */
  bestSpan: number;
  /** Percent of rounds answered correctly (null when no rounds). */
  accuracyPct: number | null;
  rounds: number;
  /** Best correct span achieved today. */
  todayBest: number;
}
