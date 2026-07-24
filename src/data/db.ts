import Dexie, { type Table } from 'dexie';
import type { NumberRound, Session, Settings } from '../engine/types';

interface SettingsRow extends Settings {
  id: 'singleton';
}

/**
 * IndexedDB schema (via Dexie): a sessions table, a singleton settings row, and
 * (v2) a numberRounds table for the number-flash drill.
 */
export class SpeedReadDB extends Dexie {
  sessions!: Table<Session, string>;
  settings!: Table<SettingsRow, string>;
  numberRounds!: Table<NumberRound, string>;

  constructor(name = 'speedread') {
    super(name);
    this.version(1).stores({
      sessions: 'id, date, passageId',
      settings: 'id',
    });
    this.version(2).stores({
      sessions: 'id, date, passageId',
      settings: 'id',
      numberRounds: 'id, date',
    });
  }
}
