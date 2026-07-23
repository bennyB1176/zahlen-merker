import { SpeedReadDB } from './db';
import { DEFAULT_SETTINGS, type ProgressRepository } from './repository';
import type { Session, Settings } from '../engine/types';

/** Local-first repository backed by IndexedDB (Dexie). */
export class DexieRepository implements ProgressRepository {
  private db: SpeedReadDB;

  constructor(db: SpeedReadDB = new SpeedReadDB()) {
    this.db = db;
  }

  async addSession(session: Session): Promise<void> {
    await this.db.sessions.put(session);
  }

  async getSessions(): Promise<Session[]> {
    return this.db.sessions.orderBy('date').toArray();
  }

  async getSettings(): Promise<Settings> {
    const row = await this.db.settings.get('singleton');
    if (!row) return { ...DEFAULT_SETTINGS };
    const { id: _id, ...settings } = row;
    return settings;
  }

  async saveSettings(settings: Settings): Promise<void> {
    await this.db.settings.put({ id: 'singleton', ...settings });
  }

  async clearAll(): Promise<void> {
    await this.db.transaction('rw', this.db.sessions, this.db.settings, async () => {
      await this.db.sessions.clear();
      await this.db.settings.clear();
    });
  }
}
