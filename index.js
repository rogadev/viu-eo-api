// HELPER PACKAGES
require('dotenv').config()
require('colors')

// EXPRESS APP
const express = require('express')
const app = express()

// MAIN ROUTER
const MainRouter = require('./app/routes')

// MIDDLEWARE
const cors = require('cors')
app.use(express.json())
app.use(cors())

// FALLBACK ROUTE
app.get('/', (_, res) =>
  res.send(`
<a href="/api/v1/test">/api/v1/test</a> - Test route.<br>
<a href="/api/v1/fix">/api/v1/fix</a> - Data Fixing Route (mothballed).<br>
<a href="/api/v1/area/3">/api/v1/area/:nid</a> - Returns area based on its NID.<br>
<a href="/api/v1/program/9143">/api/v1/program/:nid</a> - Returns program based on its NID.<br>
<a href="/api/v1/program/area/9143">/api/v1/program/area/:nid</a> - Returns area based on program NID.<br>
<a href="/api/v1/programs/all">/api/v1/programs/all</a> - Returns list of all programs offered at VIU.<br>
<a href="/api/v1/programs/searchable">/api/v1/programs/searchable</a> - Returns list of all searchable programs.<br>
<a href="/api/v1/jobs/program/9143">/api/v1/jobs/program/:nid</a> - Returns list of jobs based on a given NID param.<br>
<a href="/api/v1/jobs-by-credential?credential=degree&keywords=computer+science">/api/v1/jobs-by-credential</a> - Returns list of jobs based on a given credential and keywords query.<br>
<a href="/api/v1/jobs/9143">/api/v1/jobs</a> - Returns list of all jobs with related employment outlook details.<br>
`)
)

// MAIN ROUTES
app.use('/', MainRouter)

// ERROR HANDLING MIDDLEWARE
app.use(require('./app/middleware/error.middleware.js')) // must come after other app.use statements and routes

// START SERVER
const port = process.env.PORT || 3000
app.listen(port, () => {
  console.log('Server is', 'running'.green, 'on port', `${port}`.green)
  console.log(
    'Dev link',
    '(ctrl + click)'.cyan,
    '->'.magenta,
    `http://localhost:${port}`.blue
  )
  console.log(
    'Deployed link',
    '->'.magenta,
    'https://viu-career-outlook.herokuapp.com/api/v1/test'.blue
  )
})
