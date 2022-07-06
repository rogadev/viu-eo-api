// HELPER PACKAGES
require('dotenv').config()
require('colors')

// EXPRESS APP
const express = require('express')
const App = express()

// MAIN ROUTER
const MainRouter = require('./app/routes')

// MIDDLEWARE
App.use(express.json())

// FALLBACK ROUTE
App.get('/', (req, res) => res.send('Hello.'))

// MAIN ROUTES
App.use('/', MainRouter)

// ERROR HANDLING MIDDLEWARE
App.use(require('./app/middleware/error.middleware.js')) // must come after other app.use statements and routes

// START SERVER
App.listen(process.env.PORT, () => {
  console.log('Server is', 'running'.green, 'on port', '3000'.green)
  console.log(
    'Follow link',
    '(ctrl + click)'.cyan,
    '->'.magenta,
    'http://localhost:3000/api/v1/test'.blue
  )
  console.log(
    'Deployed link',
    '->'.magenta,
    'https://viu-career-outlook.herokuapp.com/api/v1/test'.blue
  )
})
