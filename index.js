// LOG COLORIZER
require('colors')

// EXPRESS APP
const express = require('express')
const App = express()

// MAIN ROUTER
const MainRouter = require('./app/routes')

// MIDDLEWARE
App.use(express.json())

// MAIN ROUTES
App.use('/', MainRouter)

// ERROR HANDLING MIDDLEWARE
App.use(require('./app/middleware/error.middleware.js')) // must come after other app.use statements and routes

// START SERVER
App.listen(3000, () => {
  console.log('Server is', 'running'.green, 'on port', '3000'.green)
  console.log(
    'Follow link',
    '(ctrl + click)'.cyan,
    '->'.magenta,
    'http://localhost:3000/api/v1/test'.blue
  )
})
