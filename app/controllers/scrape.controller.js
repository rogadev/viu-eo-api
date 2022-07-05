// SCRAPE SCRIPT
const scrape2016 = require('../scripts/scrape/2016')
const scrape2021 = require('../scripts/scrape/2021')

/**
 * NOC 2016 v1.3 Scrape Controller
 * Triggers web scrape for 2016 v1.3 NOC data. Replaces existing files.
 * Responds with a success message, sent ahead of async scrape.
 */
exports.noc2016 = (req, res) => {
  scrape2016()
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
  scrape2021()
  res.send(
    'Scrape has begun. This process may take time. If successful, the data will update in about 15-20 minutes.'
  )
}
