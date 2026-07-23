import type { Session, Settings } from '../engine/types';

export const DEFAULT_SETTINGS: Settings = {
  baselineWpm: null,
  currentTargetWpm: 300,
  chunkSize: 1,
  streak: 0,
  lastSessionDate: null,
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
  clearAll(): Promise<void>;
}
