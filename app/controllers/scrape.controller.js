// SCRAPE SCRIPT
const { scrape } = require('../scripts/scrape/2016/index')

/**
 * NOC 2016 v1.3 Scrape Controller
 * Triggers web scrape for 2016 v1.3 NOC data. Replaces existing files.
 * Responds with a success message, sent ahead of async scrape.
 */
exports.noc2016 = (req, res) => {
  scrape()
  res.send(
    'Scrape has begun. This process may take time. If successful, the data will update in about 15-20 minutes.'
  )
}
/**
 * NOC 2021 v1.0 Scrape Controller
 * Triggers web scrape for 2016 v1.3 NOC data. Replaces existing files.
 * Responds with a success message, sent ahead of async scrape.
 *
 * NOTE: This route is not yet implemented. (June 28, 2022)
 */
exports.noc2021 = (req, res) => {
  res.send('Scrape for 2021 has not yet been implemented.')
}
