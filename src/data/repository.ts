import type { NumberRound, Session, Settings } from '../engine/types';

export const DEFAULT_SETTINGS: Settings = {
  baselineWpm: null,
  currentTargetWpm: 300,
  chunkSize: 1,
  streak: 0,
  lastSessionDate: null,
  numberDigits: 5,
  numberFlashMs: 400,
  distractorEnabled: false,
  distractorBpm: 120,
};

/**
 * Storage seam for all persisted data. The app depends only on this interface,
 * so the local-first Dexie/IndexedDB implementation can later be swapped for (or
 * complemented by) a cloud-sync adapter without touching the UI.
 */
export interface ProgressRepository {
  addSession(session: Session): Promise<void>;
  getSessions(): Promise<Session[]>;
  getSettings(): Promise<Settings>;
  saveSettings(settings: Settings): Promise<void>;
  addNumberRound(round: NumberRound): Promise<void>;
  getNumberRounds(): Promise<NumberRound[]>;
  clearAll(): Promise<void>;
}
