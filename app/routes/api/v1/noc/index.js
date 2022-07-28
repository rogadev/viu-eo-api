// ROUTER
const router = require('express').Router()

// MIDDLEWARE
const {
  requiresNocParam,
} = require('../../../../middleware/outlook.middleware.js') // using outlook middleware because it does the same thing. No point in rewriting it.

// CONTROLLERS
const noc = require('../../../../controllers/noc.controller.js')

// GET /api/v1/noc/:noc - Get the unit group for the given NOC.
router.get('/:noc', requiresNocParam, noc.getUnitGroup)

// EXPORT
module.exports = router
