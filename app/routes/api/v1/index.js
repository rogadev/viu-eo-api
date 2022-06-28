// ROUTER
const router = require('express').Router()

// CONTROLLERS
const test = require('../../../controllers/test.controller.js')

// GET /api/v1/test - Test route.
router.get('/test', test.test)

// NESTED ROUTES
router.use('/scrape', require('./scrape'))

// EXPORT
module.exports = router
