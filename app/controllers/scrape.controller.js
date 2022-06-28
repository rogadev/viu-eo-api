const { scrape } = require('../scripts/scrape/2016/index')

exports.noc2016 = (req, res) => {
  scrape()
  res.send(
    'Scrape has begun. This process may take time. If successful, the data will update in about 15-20 minutes.'
  )
}

exports.noc2021 = (req, res) => {
  res.send('Scrape for 2021 has not yet been implemented.')
}
