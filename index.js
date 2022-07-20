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
App.get('/', (req, res) =>
  res.send(`
/api/v1/test - Test route.
/api/v1/fix - Data Fixing Route (mothballed).
/api/v1/area/:nid - Returns area based on its NID.
/api/v1/program/:nid - Returns program based on its NID.
/api/v1/program/area/:nid - Returns area based on program NID.
/api/v1/programs - Returns list of all programs offered at VIU.
/api/v1/programs/searchable - Returns list of all searchable programs.
/api/v1/jobs/program/:nid - Returns list of all searchable programs.
/api/v1/jobs/credential - Returns list of jobs based on a given credential and keywords query.
`)
)

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
