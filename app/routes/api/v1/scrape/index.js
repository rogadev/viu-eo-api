const router = require('express').Router()

// Controller
const scrape = require('../../../../controllers/scrape.controller.js')

/**
 * PUT /api/v1/scrape/2016 - Triggers web scrape for 2016 v1.3 NOC data. Replaces existing files.
 */
router.put('/2016', scrape.noc2016)

/**
 * PUT /api/v1/scrape/2021 - Triggers web scrape for 2021 v1.0 NOC data. Replaces existing files.
 */
router.put('/2021', scrape.noc2021) // TODO - add 2021 scrape controller logic

module.exports = router
