import { randomInt } from 'node:crypto'
import { config } from '../config/env.js'
import * as urlRepository from '../repositories/urlRepository.js'

const CODE_CHARS = 'abcdefghijkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789'

// Makes a random 6-character code and retries if it already exists
function generateShortCode(length = 6) {
  let code
  do {
    code = ''
    for (let i = 0; i < length; i++) {
      code += CODE_CHARS[randomInt(CODE_CHARS.length)]
    }
  } while (urlRepository.codeExists(code))
  return code
}

// Returns { ok: true, url } or { ok: false, error }
export function validateUrl(input) {
  if (typeof input !== 'string' || input.trim() === '') {
    return { ok: false, error: 'Please enter a URL.' }
  }

  let value = input.trim()
  if (value.length > 2048) {
    return { ok: false, error: 'That URL is too long (max 2048 characters).' }
  }

  // If the user typed "example.com" with no scheme, assume https://
  if (!/^[a-zA-Z][a-zA-Z0-9+.-]*:/.test(value)) {
    value = `https://${value}`
  }

  let parsed
  try {
    parsed = new URL(value)
  } catch {
    return { ok: false, error: 'That does not look like a valid URL.' }
  }

  // Safety: only allow http and https (blocks javascript:, data:, file:, etc.)
  if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
    return { ok: false, error: 'Only http:// and https:// links are allowed.' }
  }

  // The host needs a dot, e.g. "example.com" (also allow "localhost")
  if (!parsed.hostname.includes('.') && parsed.hostname !== 'localhost') {
    return { ok: false, error: 'That does not look like a valid web address.' }
  }
    // Don't allow shortening our own short links (prevents redirect loops)
  if (parsed.origin === new URL(config.baseUrl).origin) {
    return { ok: false, error: 'That is already a short link from this service.' }
  }

  return { ok: true, url: parsed.href }
}

// Creates and saves a short link for an already-validated URL
export function createShortLink(validUrl) {
  const code = generateShortCode()
  const link = urlRepository.saveLink({ code, originalUrl: validUrl })
  return {
    code: link.code,
    shortUrl: `${config.baseUrl}/${link.code}`,
    originalUrl: link.originalUrl,
  }
}

// Returns the original URL for a code (and counts the click), or null
export function resolveCode(code) {
  const link = urlRepository.findByCode(code)
  if (!link) return null
  urlRepository.recordClick(code)
  return link.originalUrl
}
// Turns a stored link into the shape we send to the frontend
function toPublicLink(link) {
  return {
    code: link.code,
    shortUrl: `${config.baseUrl}/${link.code}`,
    originalUrl: link.originalUrl,
    createdAt: link.createdAt,
    clicks: link.clicks,
  }
}

export function getLinkDetails(code) {
  const link = urlRepository.findByCode(code)
  return link ? toPublicLink(link) : null
}

export function getRecentLinks(limit) {
  return urlRepository.listRecent(limit).map(toPublicLink)
}

export function getStats() {
  return urlRepository.getTotals()
}
// Clicks per day for the last N days, including days with 0 clicks
export function getActivity(days) {
  // Start of the first day in the range (UTC)
  const start = new Date()
  start.setUTCHours(0, 0, 0, 0)
  start.setUTCDate(start.getUTCDate() - (days - 1))

  const rows = urlRepository.clicksPerDaySince(start.toISOString())
  const byDay = new Map(rows.map((row) => [row.day, row.clicks]))

  const result = []
  for (let i = 0; i < days; i++) {
    const date = new Date(start)
    date.setUTCDate(start.getUTCDate() + i)
    const day = date.toISOString().slice(0, 10)
    result.push({ day, clicks: byDay.get(day) || 0 })
  }
  return result
}