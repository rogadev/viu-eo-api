module.exports = (app) => {
  // Express Router
  const router = require('express').Router()

  // GET /api/v1/test - Test route - Route linked to in console when server starts.
  router.get('/test', (_, res) => {
    res.send('Hello World!')
  })

  // Connect routes in /api/v1/ to the Express app.
  app.use('/api/v1/', router)
}
