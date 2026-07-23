import Dexie, { type Table } from 'dexie';
import type { Session, Settings } from '../engine/types';

interface SettingsRow extends Settings {
  id: 'singleton';
}

/** IndexedDB schema (via Dexie). One sessions table + a singleton settings row. */
export class SpeedReadDB extends Dexie {
  sessions!: Table<Session, string>;
  settings!: Table<SettingsRow, string>;

  constructor(name = 'speedread') {
    super(name);
    this.version(1).stores({
      sessions: 'id, date, passageId',
      settings: 'id',
    });
  }
}
