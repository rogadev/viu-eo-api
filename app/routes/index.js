// LOG COLORIZATION
require('colors')

// ROUTER
const router = require('express').Router()

// CONTROLLERS
const test = require('../../app/controllers/test.controller.js')

// MIDDLEWARE
router.use((req, res, next) => {
  console.log('Request received:', req.method.green, req.url.blue)
  next()
})

// NESTED ROUTES
router.use('/api/v1', require('./api/v1'))

// EXPORT
module.exports = router
