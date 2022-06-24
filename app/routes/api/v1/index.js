const scrape = require('../../../controllers/scrape.controller.js')

module.exports = (app) => {
  // Express Router
  const router = require('express').Router()

  // GET /api/v1/test - Test route - Route linked to in console when server starts.
  router.get('/test', (_, res) => {
    res.send('Hello World!')
  })

  // TODO: Add routes, use controllers.
  router.get('/scrape/2016', (req, res) => scrape.noc2016(req, res))

  // Connect routes in /api/v1/ to the Express app.
  app.use('/api/v1/', router)
}
