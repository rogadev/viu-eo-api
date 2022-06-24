module.exports = (app) => {
  const router = require('express').Router()

  router.get('/test', (req, res) => {
    res.send('Hello World!')
  })

  app.use('/api/v1/', router)
}
