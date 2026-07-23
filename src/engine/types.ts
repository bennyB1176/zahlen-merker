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
}
