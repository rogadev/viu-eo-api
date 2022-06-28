// ROUTER
const router = require('express').Router()

// CONTROLLERS
const test = require('../../app/controllers/test.controller.js')

// MIDDLEWARE
router.use((req, res, next) => {
  console.log('Time:', Date.now())
  console.log('Request:', req.method, req.url)
  next()
})

// NESTED ROUTES
router.use('/api/v1', require('./api/v1'))

// EXPORT
module.exports = router
