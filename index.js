// HELPER PACKAGES
require('dotenv').config()
require('colors')

// EXPRESS APP
const express = require('express')
const App = express()

// MAIN ROUTER
const MainRouter = require('./app/routes')

// MIDDLEWARE
const cors = require('cors')
App.use(express.json())
App.use(cors())
// TODO may need to fix this. Still blocking cross-origin requests.

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
<a href="/api/v1/jobs/9143">/api/v1/jobs</a> - Returns list of all jobs with related employment outlook details.<br>
`)
)

// MAIN ROUTES
App.use('/', MainRouter)

// ERROR HANDLING MIDDLEWARE
App.use(require('./app/middleware/error.middleware.js')) // must come after other app.use statements and routes

// START SERVER
App.listen(process.env.PORT, () => {
  console.log('Server is', 'running'.green, 'on port', process.env.PORT.green)
  console.log(
    'Dev link',
    '(ctrl + click)'.cyan,
    '->'.magenta,
    `http://localhost:${process.env.PORT}`.blue
  )
  console.log(
    'Deployed link',
    '->'.magenta,
    'https://viu-career-outlook.herokuapp.com/api/v1/test'.blue
  )
})
