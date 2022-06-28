const router = require('express').Router()
const test = require('../../../controllers/test.controller.js')

/**
 * GET /api/v1/test - Test route.
 */
router.get('/test', test.test)

router.use('/scrape', require('./scrape'))

module.exports = router
