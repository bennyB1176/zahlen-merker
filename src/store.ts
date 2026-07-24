import { create } from 'zustand';
import type {
  NumberRound,
  NumberStats,
  Passage,
  ReadingMode,
  Session,
  Settings,
} from './engine/types';
import { countWords, rawWpm, effectiveWpm } from './engine/wpm';
import { scoreQuiz, updateStreak, type QuizResult } from './engine/scoring';
import { nextTargetWpm } from './engine/adaptive';
import {
  checkNumber,
  computeNumberStats,
  nextDigits,
  DIGITS_MIN,
  DIGITS_MAX,
} from './engine/numberflash';
import { computeProgress, emptyProgress, type Progress } from './data/stats';
import { DEFAULT_SETTINGS, type ProgressRepository } from './data/repository';
import { DexieRepository } from './data/dexieRepository';

export type View =
  'library' | 'reader' | 'quiz' | 'results' | 'progress' | 'numbers' | 'about';

export type NumberMode = 'adaptive' | 'manual';

export interface ReadingResult {
  session: Session;
  quiz: QuizResult | null;
  suggestedWpm: number;
}

export interface AppState {
  repo: ProgressRepository;
  ready: boolean;
  settings: Settings;
  sessions: Session[];
  progress: Progress;

  view: View;

  // Active reading session
  passage: Passage | null;
  isCustom: boolean;
  mode: ReadingMode;
  targetWpm: number;
  quizAnswers: number[];
  lastResult: ReadingResult | null;

  init(): Promise<void>;
  setView(view: View): void;
  setMode(mode: ReadingMode): void;
  setTargetWpm(wpm: number): void;
  setChunkSize(size: number): void;

  choosePassage(passage: Passage): void;
  startCustom(title: string, text: string): void;

  /** Called by the reader when the passage has been fully played. */
  finishReading(elapsedMs: number, wordsRead: number): Promise<void>;

  setQuizAnswer(questionIndex: number, optionIndex: number): void;
  submitQuiz(): Promise<void>;

  // Number-flash drill
  numberRounds: NumberRound[];
  numberStats: NumberStats;
  numberMode: NumberMode;
  setNumberMode(mode: NumberMode): void;
  setNumberDigits(digits: number): Promise<void>;
  setNumberFlashMs(ms: number): Promise<void>;
  /** Score, persist, update stats, and (adaptive mode) advance the digit level. */
  recordNumberRound(shown: string, typed: string): Promise<NumberRound>;

  clearProgress(): Promise<void>;
}

const MIN_WPM = 100;
const MAX_WPM = 900;

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

function clampWpm(wpm: number): number {
  return Math.min(MAX_WPM, Math.max(MIN_WPM, wpm));
}

async function persistAndRecord(
  state: AppState,
  set: (partial: Partial<AppState>) => void,
  session: Session,
  quiz: QuizResult | null,
): Promise<void> {
  const suggestedWpm = clampWpm(
    nextTargetWpm(session.targetWpm, session.comprehensionPct),
  );

  const newSettings: Settings = {
    ...state.settings,
    baselineWpm: state.settings.baselineWpm ?? session.rawWpm,
    currentTargetWpm: suggestedWpm,
    streak: updateStreak(state.settings.streak, state.settings.lastSessionDate, today()),
    lastSessionDate: today(),
  };

  await state.repo.addSession(session);
  await state.repo.saveSettings(newSettings);

  const sessions = await state.repo.getSessions();
  set({
    sessions,
    settings: newSettings,
    progress: computeProgress(sessions),
    lastResult: { session, quiz, suggestedWpm },
    view: 'results',
  });
}

export const useStore = create<AppState>((set, get) => ({
  repo: new DexieRepository(),
  ready: false,
  settings: { ...DEFAULT_SETTINGS },
  sessions: [],
  progress: emptyProgress(),

  view: 'library',

  passage: null,
  isCustom: false,
  mode: 'rsvp',
  targetWpm: DEFAULT_SETTINGS.currentTargetWpm,
  quizAnswers: [],
  lastResult: null,

  numberRounds: [],
  numberStats: computeNumberStats([]),
  numberMode: 'adaptive',

  async init() {
    const repo = get().repo;
    const settings = await repo.getSettings();
    const sessions = await repo.getSessions();
    const numberRounds = await repo.getNumberRounds();
    set({
      ready: true,
      settings,
      sessions,
      progress: computeProgress(sessions),
      targetWpm: settings.currentTargetWpm,
      numberRounds,
      numberStats: computeNumberStats(numberRounds, today()),
    });
  },

  setView(view) {
    set({ view });
  },

  setMode(mode) {
    set({ mode });
  },

  setTargetWpm(wpm) {
    set({ targetWpm: clampWpm(wpm) });
  },

  async setChunkSize(size) {
    // Persisted immediately so it survives reloads.
    const settings = { ...get().settings, chunkSize: size };
    set({ settings });
    await get().repo.saveSettings(settings);
  },

  choosePassage(passage) {
    set({
      passage,
      isCustom: false,
      quizAnswers: [],
      lastResult: null,
      targetWpm: get().settings.currentTargetWpm,
      view: 'reader',
    });
  },

  startCustom(title, text) {
    const trimmed = text.trim();
    const passage: Passage = {
      id: `custom-${Date.now()}`,
      title: title.trim() || 'My text',
      source: 'Pasted by you',
      license: 'user-provided',
      text: trimmed,
      wordCount: countWords(trimmed),
      questions: [],
    };
    set({
      passage,
      isCustom: true,
      quizAnswers: [],
      lastResult: null,
      targetWpm: get().settings.currentTargetWpm,
      view: 'reader',
    });
  },

  async finishReading(elapsedMs, wordsRead) {
    const state = get();
    const passage = state.passage;
    if (!passage) return;

    // Pasted text has no quiz: record immediately with comprehension unknown.
    if (state.isCustom || passage.questions.length === 0) {
      const raw = rawWpm(wordsRead, elapsedMs);
      const session: Session = {
        id: crypto.randomUUID(),
        date: new Date().toISOString(),
        mode: state.mode,
        passageId: passage.id,
        passageTitle: passage.title,
        targetWpm: state.targetWpm,
        wordsRead,
        durationMs: elapsedMs,
        rawWpm: raw,
        comprehensionPct: null,
        eWpm: effectiveWpm(raw, null),
      };
      await persistAndRecord(state, set, session, null);
      return;
    }

    // Library passage: go to the comprehension quiz. Stash timing on the passage
    // via quizAnswers reset; timing is recomputed in submitQuiz from these values.
    set({
      view: 'quiz',
      quizAnswers: [],
      // stash reading metrics for submitQuiz
      lastResult: {
        session: {
          id: crypto.randomUUID(),
          date: new Date().toISOString(),
          mode: state.mode,
          passageId: passage.id,
          passageTitle: passage.title,
          targetWpm: state.targetWpm,
          wordsRead,
          durationMs: elapsedMs,
          rawWpm: rawWpm(wordsRead, elapsedMs),
          comprehensionPct: null,
          eWpm: 0,
        },
        quiz: null,
        suggestedWpm: state.targetWpm,
      },
    });
  },

  setQuizAnswer(questionIndex, optionIndex) {
    const answers = [...get().quizAnswers];
    answers[questionIndex] = optionIndex;
    set({ quizAnswers: answers });
  },

  async submitQuiz() {
    const state = get();
    const passage = state.passage;
    const pending = state.lastResult?.session;
    if (!passage || !pending) return;

    const quiz = scoreQuiz(passage.questions, state.quizAnswers);
    const session: Session = {
      ...pending,
      comprehensionPct: quiz.pct,
      eWpm: effectiveWpm(pending.rawWpm, quiz.pct),
    };
    await persistAndRecord(state, set, session, quiz);
  },

  setNumberMode(mode) {
    set({ numberMode: mode });
  },

  async setNumberDigits(digits) {
    const clamped = Math.min(DIGITS_MAX, Math.max(DIGITS_MIN, Math.round(digits)));
    const settings = { ...get().settings, numberDigits: clamped };
    set({ settings });
    await get().repo.saveSettings(settings);
  },

  async setNumberFlashMs(ms) {
    const clamped = Math.min(2000, Math.max(100, Math.round(ms)));
    const settings = { ...get().settings, numberFlashMs: clamped };
    set({ settings });
    await get().repo.saveSettings(settings);
  },

  async recordNumberRound(shown, typed) {
    const state = get();
    const correct = checkNumber(shown, typed);
    const round: NumberRound = {
      id: crypto.randomUUID(),
      date: new Date().toISOString(),
      digits: shown.length,
      flashMs: state.settings.numberFlashMs,
      shown,
      typed,
      correct,
    };
    await state.repo.addNumberRound(round);

    // Adaptive mode nudges the digit level toward the user's threshold.
    let settings = state.settings;
    if (state.numberMode === 'adaptive') {
      settings = {
        ...settings,
        numberDigits: nextDigits(settings.numberDigits, correct),
      };
      await state.repo.saveSettings(settings);
    }

    const numberRounds = await state.repo.getNumberRounds();
    set({
      settings,
      numberRounds,
      numberStats: computeNumberStats(numberRounds, today()),
    });
    return round;
  },

  async clearProgress() {
    await get().repo.clearAll();
    const settings = await get().repo.getSettings();
    set({
      settings,
      sessions: [],
      progress: emptyProgress(),
      targetWpm: settings.currentTargetWpm,
      numberRounds: [],
      numberStats: computeNumberStats([]),
    });
  },
}));
