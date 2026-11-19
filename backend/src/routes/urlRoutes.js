import { Router } from 'express'
import * as urlController from '../controllers/urlController.js'

const router = Router()

router.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' })
})

router.post('/api/shorten', urlController.shorten)
router.get('/api/links', urlController.listRecent)
router.get('/api/links/:code', urlController.getDetails)
router.get('/api/stats', urlController.stats)
router.get('/api/stats/activity', urlController.activity)

// Must stay LAST: this pattern matches any single-segment path
router.get('/:code', urlController.redirect)

export default router