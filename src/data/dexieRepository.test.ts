import 'fake-indexeddb/auto';
import { describe, it, expect, beforeEach } from 'vitest';
import { DexieRepository } from './dexieRepository';
import { SpeedReadDB } from './db';
import { DEFAULT_SETTINGS } from './repository';
import type { Session } from '../engine/types';

function makeSession(over: Partial<Session> = {}): Session {
  return {
    id: crypto.randomUUID(),
    date: '2026-07-23T10:00:00.000Z',
    mode: 'rsvp',
    passageId: 'p1',
    passageTitle: 'Test',
    targetWpm: 300,
    wordsRead: 200,
    durationMs: 40_000,
    rawWpm: 300,
    comprehensionPct: 80,
    eWpm: 240,
    ...over,
  };
}

describe('DexieRepository', () => {
  let repo: DexieRepository;
  let db: SpeedReadDB;

  beforeEach(async () => {
    // Fresh, isolated database per test.
    db = new SpeedReadDB(`test-${crypto.randomUUID()}`);
    repo = new DexieRepository(db);
    await repo.clearAll();
  });

  it('returns default settings before anything is saved', async () => {
    expect(await repo.getSettings()).toEqual(DEFAULT_SETTINGS);
  });

  it('persists and reads back a session', async () => {
    const session = makeSession();
    await repo.addSession(session);
    const all = await repo.getSessions();
    expect(all).toHaveLength(1);
    expect(all[0]).toEqual(session);
  });

  it('returns sessions ordered by date', async () => {
    await repo.addSession(makeSession({ date: '2026-07-20T10:00:00.000Z' }));
    await repo.addSession(makeSession({ date: '2026-07-01T10:00:00.000Z' }));
    const dates = (await repo.getSessions()).map((s) => s.date);
    expect(dates).toEqual(['2026-07-01T10:00:00.000Z', '2026-07-20T10:00:00.000Z']);
  });

  it('round-trips settings without leaking the internal id field', async () => {
    const settings = { ...DEFAULT_SETTINGS, baselineWpm: 250, currentTargetWpm: 320 };
    await repo.saveSettings(settings);
    const read = await repo.getSettings();
    expect(read).toEqual(settings);
    expect(read).not.toHaveProperty('id');
  });

  it('overwrites settings on repeated saves (singleton row)', async () => {
    await repo.saveSettings({ ...DEFAULT_SETTINGS, currentTargetWpm: 310 });
    await repo.saveSettings({ ...DEFAULT_SETTINGS, currentTargetWpm: 420 });
    expect((await repo.getSettings()).currentTargetWpm).toBe(420);
  });

  it('persists and reads back number-flash rounds, ordered by date', async () => {
    await repo.addNumberRound({
      id: crypto.randomUUID(),
      date: '2026-07-24T10:00:00.000Z',
      digits: 6,
      flashMs: 400,
      shown: '123456',
      typed: '123456',
      correct: true,
    });
    await repo.addNumberRound({
      id: crypto.randomUUID(),
      date: '2026-07-23T10:00:00.000Z',
      digits: 5,
      flashMs: 400,
      shown: '12345',
      typed: '00000',
      correct: false,
    });
    const rounds = await repo.getNumberRounds();
    expect(rounds.map((r) => r.date)).toEqual([
      '2026-07-23T10:00:00.000Z',
      '2026-07-24T10:00:00.000Z',
    ]);
  });

  it('clears all data', async () => {
    await repo.addSession(makeSession());
    await repo.saveSettings({ ...DEFAULT_SETTINGS, currentTargetWpm: 999 });
    await repo.addNumberRound({
      id: crypto.randomUUID(),
      date: '2026-07-24T10:00:00.000Z',
      digits: 6,
      flashMs: 400,
      shown: '123456',
      typed: '123456',
      correct: true,
    });
    await repo.clearAll();
    expect(await repo.getSessions()).toHaveLength(0);
    expect(await repo.getNumberRounds()).toHaveLength(0);
    expect(await repo.getSettings()).toEqual(DEFAULT_SETTINGS);
  });
});
