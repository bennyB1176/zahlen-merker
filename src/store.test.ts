import 'fake-indexeddb/auto';
import { describe, it, expect, beforeEach } from 'vitest';
import { useStore } from './store';
import { DexieRepository } from './data/dexieRepository';
import { SpeedReadDB } from './data/db';
import { DEFAULT_SETTINGS } from './data/repository';
import { PASSAGES } from './data/passages';
import { emptyProgress } from './data/stats';
import { computeNumberStats } from './engine/numberflash';

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
    numberRounds: [],
    numberStats: computeNumberStats([]),
    numberMode: 'adaptive',
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

describe('app store — reading settings', () => {
  beforeEach(freshStore);

  it('clamps words-per-flash (chunk size) to 1–4 and persists it', async () => {
    await useStore.getState().setChunkSize(3);
    expect(useStore.getState().settings.chunkSize).toBe(3);

    await useStore.getState().setChunkSize(0);
    expect(useStore.getState().settings.chunkSize).toBe(1);

    await useStore.getState().setChunkSize(99);
    expect(useStore.getState().settings.chunkSize).toBe(4);
  });

  it('toggles the metronome distractor and persists it', async () => {
    expect(useStore.getState().settings.distractorEnabled).toBe(false);
    await useStore.getState().setDistractor(true);
    expect(useStore.getState().settings.distractorEnabled).toBe(true);

    const persisted = await useStore.getState().repo.getSettings();
    expect(persisted.distractorEnabled).toBe(true);
  });

  it('clamps the distractor BPM into range', async () => {
    await useStore.getState().setDistractorBpm(140);
    expect(useStore.getState().settings.distractorBpm).toBe(140);

    await useStore.getState().setDistractorBpm(5);
    expect(useStore.getState().settings.distractorBpm).toBe(60);

    await useStore.getState().setDistractorBpm(9999);
    expect(useStore.getState().settings.distractorBpm).toBe(240);
  });
});

describe('app store — number-flash drill', () => {
  beforeEach(freshStore);

  it('records a correct round and, in adaptive mode, raises the digit level', async () => {
    const startDigits = useStore.getState().settings.numberDigits;
    const shown = '123456';
    const round = await useStore.getState().recordNumberRound(shown, '123 456');

    expect(round.correct).toBe(true);
    expect(round.digits).toBe(6);
    const state = useStore.getState();
    expect(state.numberRounds).toHaveLength(1);
    expect(state.numberStats.bestSpan).toBe(6);
    expect(state.numberStats.rounds).toBe(1);
    // Adaptive: correct answer bumps the digit level up by one.
    expect(state.settings.numberDigits).toBe(startDigits + 1);
  });

  it('records a wrong round and lowers the digit level (adaptive)', async () => {
    await useStore.getState().setNumberDigits(6);
    await useStore.getState().recordNumberRound('123456', '000000');
    const state = useStore.getState();
    expect(state.numberRounds[0]!.correct).toBe(false);
    expect(state.numberStats.bestSpan).toBe(0);
    expect(state.settings.numberDigits).toBe(5);
  });

  it('does not change the digit level in manual mode', async () => {
    useStore.getState().setNumberMode('manual');
    await useStore.getState().setNumberDigits(7);
    await useStore.getState().recordNumberRound('1234567', '1234567');
    expect(useStore.getState().settings.numberDigits).toBe(7);
  });

  it('clears number rounds with clearProgress', async () => {
    await useStore.getState().recordNumberRound('123456', '123456');
    expect(useStore.getState().numberRounds).toHaveLength(1);
    await useStore.getState().clearProgress();
    expect(useStore.getState().numberRounds).toHaveLength(0);
    expect(useStore.getState().numberStats.rounds).toBe(0);
  });
});
