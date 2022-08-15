// ROUTER
const router = require('express').Router()

// MIDDLEWARE
const outlookMW = require('../../../../middleware/outlook.middleware.js')

// CONTROLLERS
const outlooks = require('../../../../controllers/outlook.controller.js')

// GET /api/v1/outlook/:noc - Get the unit group for the given NOC.
router.get('/:noc', outlooks.bcProvincialOutlook)

// GET /api/v1/national/outlook/:noc - Returns area based on program NID.
router.get(
  '/national/:noc',
  outlookMW.requiresNocParam,
  outlooks.nationalOutlook
)

// GET /api/v1/outlook/provincial/:noc - Returns area based on NOC unit group.
router.get(
  '/provincial/:noc',
  outlookMW.requiresNocParam,
  outlookMW.requiresProvinceQuery,
  outlooks.provincialOutlook
)

module.exports = router
