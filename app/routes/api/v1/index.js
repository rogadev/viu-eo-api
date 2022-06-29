// ROUTER
const router = require('express').Router()

// MIDDLEWARE
const outlookMW = require('../../../middleware/outlook.middleware.js')
const programMW = require('../../../middleware/program.middleware.js')

// CONTROLLERS
const test = require('../../../controllers/test.controller.js')
const programs = require('../../../controllers/program.controller.js')
const outlooks = require('../../../controllers/outlook.controller.js')

// GET /api/v1/test - Test route.
router.get('/test', test.test)

// GET /api/v1/area/:nid - Returns area based on its NID.
router.get(
  '/area/:nid',
  programMW.requiresNidParam,
  programMW.validateAreaNidParam,
  programs.findArea
)

// GET /api/v1/programs/:nid - Returns program based on its NID.
router.get(
  '/program/:nid',
  programMW.requiresNidParam,
  programMW.validateProgramNidParam,
  programs.findOne
)

// GET /api/v1/programs/area/:nid - Returns area based on program NID.
router.get(
  '/program/area/:nid',
  programMW.requiresNidParam,
  programs.findAreaByProgram
)

// GET /api/v1/programs - Returns list of all programs offered at VIU.
router.get('/programs/all', programs.findAll)

// GET /api/v1/programs/searchable - Returns list of all searchable programs.
router.get('/programs/searchable', programs.findSearchable)

// GET /api/v1/national/outlook/:noc - Returns area based on program NID.
router.get(
  '/outlook/national/:noc',
  outlookMW.requiresNocParam,
  outlooks.nationalOutlook
)

// GET /api/v1/provincial/outlook/
router.get(
  '/outlook/provincial/:noc',
  outlookMW.requiresNocParam,
  outlookMW.requiresProvinceQuery,
  outlooks.provincialOutlook
)

// GET /api/v1/regional/outlook/
router.get(
  '/outlook/regional/:noc',
  outlookMW.requiresNocParam,
  outlookMW.requiresRegionQuery,
  outlooks.regionalOutlook
)

// NESTED ROUTES
router.use('/scrape', require('./scrape'))

// EXPORT
module.exports = router
