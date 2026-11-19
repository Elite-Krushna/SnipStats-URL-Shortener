import db from '../db/database.js'

// SQLite stores column names in snake_case. This converts a row
// into the shape the rest of the app already expects.
function toLink(row) {
  if (!row) return null
  return {
    code: row.code,
    originalUrl: row.original_url,
    createdAt: row.created_at,
    clicks: row.click_count,
  }
}

// Prepared statements: SQL is written once, values are filled in at run time
const stmts = {
  exists: db.prepare('SELECT 1 FROM links WHERE code = ?'),
  insert: db.prepare(
    'INSERT INTO links (code, original_url, created_at, click_count) VALUES (?, ?, ?, 0)'
  ),
  findByCode: db.prepare('SELECT * FROM links WHERE code = ?'),
  addClickToLink: db.prepare(
    'UPDATE links SET click_count = click_count + 1 WHERE code = ?'
  ),
  insertClickEvent: db.prepare(
    'INSERT INTO click_events (code, clicked_at) VALUES (?, ?)'
  ),
  listRecent: db.prepare('SELECT * FROM links ORDER BY created_at DESC LIMIT ?'),
  totalLinks: db.prepare('SELECT COUNT(*) AS n FROM links'),
  totalClicks: db.prepare('SELECT COUNT(*) AS n FROM click_events'),
}

export function codeExists(code) {
  return stmts.exists.get(code) !== undefined
}

// The PRIMARY KEY on links.code makes SQLite itself reject duplicate codes
export function saveLink({ code, originalUrl }) {
  const createdAt = new Date().toISOString()
  stmts.insert.run(code, originalUrl, createdAt)
  return { code, originalUrl, createdAt, clicks: 0 }
}

export function findByCode(code) {
  return toLink(stmts.findByCode.get(code))
}

// Adds one click to a link and records when it happened.
// Both changes happen together or not at all (a transaction).
export function recordClick(code) {
  db.exec('BEGIN')
  try {
    const result = stmts.addClickToLink.run(code)
    if (result.changes === 0) {
      db.exec('ROLLBACK')
      return
    }
    stmts.insertClickEvent.run(code, new Date().toISOString())
    db.exec('COMMIT')
  } catch (error) {
    db.exec('ROLLBACK')
    throw error
  }
}

// Newest links first
export function listRecent(limit) {
  return stmts.listRecent.all(limit).map(toLink)
}

export function getTotals() {
  return {
    totalLinks: stmts.totalLinks.get().n,
    totalClicks: stmts.totalClicks.get().n,
  }
}
// Counts clicks per calendar day (UTC) since a given date.
// Returns rows like { day: '2026-10-19', clicks: 3 }
export function clicksPerDaySince(sinceIso) {
  return db
    .prepare(
      `SELECT substr(clicked_at, 1, 10) AS day, COUNT(*) AS clicks
       FROM click_events
       WHERE clicked_at >= ?
       GROUP BY day
       ORDER BY day`
    )
    .all(sinceIso)
}