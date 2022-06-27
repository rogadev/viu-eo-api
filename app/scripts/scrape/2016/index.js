require('colors')
const fs = require('fs')
const path = require('path')
const puppeteer = require('puppeteer')
const { scrapeLinks } = require('./functions/scrape_links')
const { scrapeData } = require('./functions/scrape_data')

exports.scrape = async () => {
  const browser = await puppeteer.launch()
  // check if noc_2016_unit_group_links.json exists
  let links = []
  if (
    fs.existsSync(path.join(__dirname, './data/noc_2016_unit_group_links.json'))
  ) {
    console.log('Loading links from file...'.magenta)
    links = require('./data/noc_2016_unit_group_links.json')
  } else {
    console.log('Finding links...'.magenta)
    links = await scrapeLinks(browser)
  }

  // use list of links to scrape data
  await scrapeData(browser, links)

  // return
  browser.close()
}
