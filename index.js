// LOG COLORIZER
const colors = require('colors')

// EXPRESS APP
const express = require('express')
const app = express()

// ROUTER
const routes = require('./app/routes')

// MIDDLEWARE
app.use(express.json())

// API V1 ROUTES
app.use('/', routes)

// START SERVER
app.listen(3000, () => {
  console.log('Server is', 'running'.green, 'on port', '3000'.green)
  console.log(
    'Follow link',
    '(ctrl + click)'.cyan,
    '->'.magenta,
    'http://localhost:3000/api/v1/test'.blue
  )
})
