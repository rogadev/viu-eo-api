// LOG COLORIZER
const colors = require('colors')

// EXPRESS APP
const express = require('express')
const app = express()

// MIDDLEWARE
app.use(express.json())

// API V1 ROUTES
require('./app/routes/api/v1')(app)

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
