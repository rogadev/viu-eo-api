// LOG COLORIZATION
require('colors')

// ROUTER
const router = require('express').Router()

// CONTROLLERS
const test = require('../../app/controllers/test.controller.js')

// ROUTER MIDDLEWARE
router.use((req, res, next) => {
  console.log('Request:', req.method.green, req.url.blue)
  next()
})

// NESTED ROUTES
router.use('/api/v1', require('./api/v1'))

// DEFAULT ROUTE HANDLING
router.use((req, res) => {
  res.status(404).send('404: Page not found')
})

// EXPORT
module.exports = router
