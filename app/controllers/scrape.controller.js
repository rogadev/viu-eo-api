module.exports = function noc2016(_, res) {
  const { scrape } = require('../scripts/scrape/scrape_noc_2016_v1_3.js')
  scrape()
  res.send('Scraping NOC 2016 v1.3 - complete!')
}
