import 'fake-indexeddb/auto';
import { describe, it, expect, beforeEach } from 'vitest';
import { useStore } from './store';
import { DexieRepository } from './data/dexieRepository';
import { SpeedReadDB } from './data/db';
import { DEFAULT_SETTINGS } from './data/repository';
import { PASSAGES } from './data/passages';
import { emptyProgress } from './data/stats';

async function freshStore() {
  const repo = new DexieRepository(new SpeedReadDB(`store-${crypto.randomUUID()}`));
  await repo.clearAll();
  useStore.setState({
    repo,
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
  });
  await useStore.getState().init();
}

describe('app store — reading flow', () => {
  beforeEach(freshStore);

  it('runs a full library flow: read → quiz → recorded session', async () => {
    const passage = PASSAGES[0]!;
    useStore.getState().choosePassage(passage);
    expect(useStore.getState().view).toBe('reader');

    await useStore.getState().finishReading(30_000, passage.wordCount);
    expect(useStore.getState().view).toBe('quiz');

    // Answer every question correctly.
    passage.questions.forEach((q, i) =>
      useStore.getState().setQuizAnswer(i, q.answerIndex),
    );
    await useStore.getState().submitQuiz();

    const state = useStore.getState();
    expect(state.view).toBe('results');
    expect(state.sessions).toHaveLength(1);
    const s = state.sessions[0]!;
    expect(s.comprehensionPct).toBe(100);
    expect(s.eWpm).toBe(s.rawWpm); // 100% comprehension -> eWpm equals raw
    expect(state.progress.totalSessions).toBe(1);
    expect(state.settings.streak).toBe(1);
  });

  it('lowers effective WPM when comprehension is poor', async () => {
    const passage = PASSAGES[0]!;
    useStore.getState().choosePassage(passage);
    await useStore.getState().finishReading(20_000, passage.wordCount);
    // Answer everything wrong (pick an index that is never the answer).
    passage.questions.forEach((q, i) =>
      useStore.getState().setQuizAnswer(i, q.answerIndex === 0 ? 1 : 0),
    );
    await useStore.getState().submitQuiz();

    const s = useStore.getState().sessions[0]!;
    expect(s.comprehensionPct).toBe(0);
    expect(s.eWpm).toBe(0);
  });

  it('records custom pasted text with no quiz (comprehension unknown)', async () => {
    useStore.getState().startCustom('Notes', 'one two three four five six seven eight');
    expect(useStore.getState().view).toBe('reader');
    expect(useStore.getState().isCustom).toBe(true);

    await useStore.getState().finishReading(4_000, 8);
    const state = useStore.getState();
    expect(state.view).toBe('results');
    const s = state.sessions[0]!;
    expect(s.comprehensionPct).toBeNull();
    expect(s.eWpm).toBe(s.rawWpm);
  });

  it('clears progress', async () => {
    const passage = PASSAGES[0]!;
    useStore.getState().choosePassage(passage);
    await useStore.getState().finishReading(30_000, passage.wordCount);
    passage.questions.forEach((q, i) =>
      useStore.getState().setQuizAnswer(i, q.answerIndex),
    );
    await useStore.getState().submitQuiz();
    expect(useStore.getState().sessions).toHaveLength(1);

    await useStore.getState().clearProgress();
    expect(useStore.getState().sessions).toHaveLength(0);
    expect(useStore.getState().progress.totalSessions).toBe(0);
  });
});
