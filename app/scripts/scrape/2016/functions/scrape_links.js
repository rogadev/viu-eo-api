/**
 * @file: scrape_links.js
 * @author: Ryan Paranich <ryan.paranich@viu.ca>
 * @description: Scrapes links from Stats Canada's 2016 NOC v1.3 for use in scraping unit group specific data.
 * @version: 1.0.0
 *
 * June 27, 2022 - Tested and working. No known bugs.
 *
 */

require('colors') // colorizes log messages
const fs = require('fs')
const path = require('path')

/**
 *
 * @param {Array} listOfLinks - Array of links to scrape
 * @param {puppeteer.Browser} browser - Puppeteer browser instance
 * @returns {undefined} - Returns nothing. Saves links to file.
 */
async function getLinks(listOfLinks, browser) {
  const promiseList = []
  console.log(`Scraping from list of ${listOfLinks.length} links...`.blue)
  for (const broadLink of listOfLinks.flat()) {
    promiseList.push(
      new Promise(async (resolve, reject) => {
        const page = await browser.newPage()
        await page.setDefaultNavigationTimeout(300_000) // pages may time out at default of 30 seconds on unit group links
        await page.goto(broadLink)
        const newLink = await page.$$eval('tbody > tr > th', (trs) => {
          return trs.map((tr) => {
            return tr.querySelector('a').href
          })
        })
        await page.close()
        resolve(newLink)
      })
    )
  }

  const linkList = await Promise.all(promiseList)
  console.log('Complete.'.green)
  return linkList
}

exports.scrapeLinks = async (browser) => {
  console.log('Finding Broad Categories from NOC 2016 homepage...'.magenta)
  const mainPage = await browser.newPage()
  await mainPage.goto(
    'https://www23.statcan.gc.ca/imdb/p3VD.pl?Function=getVD&TVD=1267777'
  )
  const broadCategories = await mainPage.$$eval('tbody > tr > th', (trs) => {
    return trs.map((tr) => {
      return tr.querySelector('a').href
    })
  })
  await mainPage.close()
  console.log('Complete.'.green)

  console.log(
    `Finding Major Groups from ${broadCategories.length} Broad Categories...`
      .magenta
  )
  const majorGroups = await getLinks(broadCategories, browser)
  console.log(
    `Finding Minor Groups from ${majorGroups.length} Major Categories...`
      .magenta
  )
  const minorCategories = await getLinks(majorGroups, browser)
  console.log(
    `Finding Unit Groups from ${minorCategories.length} Minor Categories...`
      .magenta
  )
  const unitGroups = await getLinks(minorCategories, browser)

  try {
    console.log('Saving links to file...'.magenta)
    fs.writeFileSync(
      path.join(__dirname, '../data/noc_2016_unit_group_links.json'),
      JSON.stringify(unitGroups.flat())
    )
  } catch {
    console.log('Error writing file.'.red)
  } finally {
    return console.log('Link Scrape Complete.'.green)
  }
}
