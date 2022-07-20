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
<a href="/api/v1/test">/api/v1/test</a> - Test route.<br>
<a href="/api/v1/fix">/api/v1/fix</a> - Data Fixing Route (mothballed).<br>
<a href="/api/v1/area/3">/api/v1/area/:nid</a> - Returns area based on its NID.<br>
<a href="/api/v1/program/9143">/api/v1/program/:nid</a> - Returns program based on its NID.<br>
<a href="/api/v1/program/area/9143">/api/v1/program/area/:nid</a> - Returns area based on program NID.<br>
<a href="/api/v1/programs">/api/v1/programs</a> - Returns list of all programs offered at VIU.<br>
<a href="/api/v1/programs/searchable">/api/v1/programs/searchable</a> - Returns list of all searchable programs.<br>
<a href="/api/v1/jobs/program/9143">/api/v1/jobs/program/:nid</a> - Returns list of jobs based on a given NID param.<br>
<a href="/api/v1/jobs/credential">/api/v1/jobs/credential</a> - Returns list of jobs based on a given credential and keywords query.<br>
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
