const fs = require('fs/promises')
const path = require('path')
require('colors')

exports.scrapeData = async (browser, links) => {
  console.log('Loaded.'.green)
  console.log('Attempting to scrape data...'.magenta)
  const page = await browser.newPage()
  await page.setDefaultNavigationTimeout(10000)
  const collection = []
  for (const link of links) {
    console.log(`Scraping ${link}...`.magenta)
    await page.goto(link)

    const step1Results = await page.$eval(
      'body > main > div.panel.panel-default.mrgn-tp-0.mrgn-bttm-md > div > h2',
      (el) => el.innerText
    )
    // Result 1 - NOC Number and Unit Group Title
    const noc = step1Results[0].substring(0, 5).trim()
    const title = step1Results[0].substring(6).trim()

    // Result 2 - List of sections

    console.log(noc, title, sections)
  }

  browser.close()
}
