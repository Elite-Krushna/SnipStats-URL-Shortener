import { DatabaseSync } from 'node:sqlite'
import fs from 'node:fs'
import path from 'node:path'
import { config } from '../config/env.js'

// Make sure the data folder exists
fs.mkdirSync(path.dirname(config.dbPath), { recursive: true })

// Opens the database file (creates it if it doesn't exist yet)
const db = new DatabaseSync(config.dbPath)

// Make SQLite enforce the link between click_events and links
db.exec('PRAGMA foreign_keys = ON;')

// "IF NOT EXISTS" means running this again on restart does no harm
db.exec(`
  CREATE TABLE IF NOT EXISTS links (
    code         TEXT PRIMARY KEY,
    original_url TEXT NOT NULL,
    created_at   TEXT NOT NULL,
    click_count  INTEGER NOT NULL DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS click_events (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    code       TEXT NOT NULL REFERENCES links(code) ON DELETE CASCADE,
    clicked_at TEXT NOT NULL
  );

  CREATE INDEX IF NOT EXISTS idx_links_created_at
    ON links (created_at);
  CREATE INDEX IF NOT EXISTS idx_click_events_code
    ON click_events (code);
  CREATE INDEX IF NOT EXISTS idx_click_events_clicked_at
    ON click_events (clicked_at);
`)

export default db