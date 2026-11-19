import * as urlService from '../services/urlService.js'

// POST /api/shorten
export function shorten(req, res) {
  const result = urlService.validateUrl(req.body?.url)
  if (!result.ok) {
    return res.status(400).json({ error: result.error })
  }

  const created = urlService.createShortLink(result.url)
  res.status(201).json(created)
}

// GET /api/links/:code
export function getDetails(req, res) {
  const link = urlService.getLinkDetails(req.params.code)
  if (!link) {
    return res.status(404).json({ error: 'Short link not found.' })
  }
  res.json(link)
}

// GET /api/links?limit=10
export function listRecent(req, res) {
  // Use 10 by default; keep the value between 1 and 100
  const requested = Number.parseInt(req.query.limit, 10)
  const limit = Number.isNaN(requested) ? 10 : Math.min(Math.max(requested, 1), 100)
  res.json({ links: urlService.getRecentLinks(limit) })
}

// GET /api/stats
export function stats(req, res) {
  res.json(urlService.getStats())
}

// GET /api/stats/activity?days=7
export function activity(req, res) {
  // Use 7 by default; keep the value between 1 and 90
  const requested = Number.parseInt(req.query.days, 10)
  const days = Number.isNaN(requested) ? 7 : Math.min(Math.max(requested, 1), 90)
  res.json({ days, activity: urlService.getActivity(days) })
}

// GET /:code  (redirect)
export function redirect(req, res) {
  const originalUrl = urlService.resolveCode(req.params.code)
  if (!originalUrl) {
    return res.status(404).send('Short link not found.')
  }
  res.redirect(302, originalUrl)
}