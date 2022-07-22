// ROUTER
const router = require('express').Router()

// MIDDLEWARE
const programMW = require('../../../middleware/program.middleware.js')
const jobsMW = require('../../../middleware/jobs.middleware.js')

// CONTROLLERS
const test = require('../../../controllers/test.controller.js')
const programs = require('../../../controllers/program.controller.js')
const jobs = require('../../../controllers/jobs.controller.js')
const fix = require('../../../controllers/fix.controller.js')

// GET /api/v1/test - Test route.
router.get('/test', test.test)

router.get('/fix', fix.fixData)

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

router.get('/jobs/:nid', jobs.jobsByNid)

// GET /api/v1/jobs/program/:nid - Returns list of all searchable programs.
router.get(
  '/jobs/program/:nid',
  jobsMW.requiresProgramNidParam,
  jobs.jobsByProgram
)

router.get(
  '/jobs/credential',
  jobsMW.requiresCredentialQuery,
  jobs.jobsByCredential
)

//TODO put the middle ware back in

// NESTED ROUTES
router.use('/scrape', require('./scrape'))
router.use('/outlook', require('./outlook'))

// EXPORT
module.exports = router
