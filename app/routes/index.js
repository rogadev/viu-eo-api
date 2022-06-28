const router = require('express').Router()
const test = require('../../app/controllers/test.controller.js')

router.use((req, res, next) => {
  console.log('Time:', Date.now())
  console.log('Request:', req.method, req.url)
  next()
})

router.use('/api/v1', require('./api/v1'))

module.exports = router
