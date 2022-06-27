const { scrape } = require('../scripts/scrape/2016/index')

exports.noc2016 = (req, res) => {
  scrape()
  res.send(
    'Scrape has begun. This process may take time. If successful, the data will update in about 15-20 minutes.'
  )
}
