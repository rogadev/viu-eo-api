const colors = require('colors')

const puppeteer = require('puppeteer')
const fs = require('fs/promises')

module.exports = async () => {
  const browser = await puppeteer.launch()
  const page = await browser.newPage()

  let data = []

  // NOC 2021 Version 1.0
  await page.goto(
    'https://www23.statcan.gc.ca/imdb/p3VD.pl?Function=getVD&TVD=1322554'
  )

  const broadLinks = await page.$$eval('tbody > tr > th', (trs) => {
    return trs.map((tr) => {
      return tr.querySelector('a').href
    })
  })

  console.log('Working on Major Group...'.magenta)
  const majorLinks = await getLinks(page, broadLinks)
  console.log('Working on Sub-major Group...'.magenta)
  const subLinks = await getLinks(page, majorLinks)
  console.log('Working on Minor Group...'.magenta)
  const minorLinks = await getLinks(page, subLinks)
  console.log('Working on Unit Group...'.magenta)
  const unitLinks = await getLinks(page, minorLinks)

  async function getLinks(page, listOfLinks) {
    const linkList = []
    for (const broadLink of listOfLinks.flat()) {
      console.log(broadLink)
      await page.goto(broadLink)
      const newLink = await page.$$eval('tbody > tr > th', (trs) => {
        return trs.map((tr) => {
          return tr.querySelector('a').href
        })
      })
      linkList.push(newLink)
    }
    return linkList
  }

  await fs.writeFile(
    './temp/noc_2021_unit_group_links.json',
    JSON.stringify(unitLinks.flat())
  )

  // --------------------------------------- LINKS SCRAPED ---------------------------------------

  const nocLinks = require('./temp/noc_2021_unit_group_links.json')

  // reset scraped data
  data = []

  for (const link of nocLinks) {
    console.log('Attempting: ', link)
    await page.goto(link)
    const obj = await page.evaluate(() => {
      const noc_number = document
        .querySelector(
          'body > main > div.panel.panel-default.mrgn-tp-0.mrgn-bttm-md > div > h2'
        )
        .innerText.substr(0, 5)
      const occupation = document
        .querySelector(
          'body > main > div.panel.panel-default.mrgn-tp-0.mrgn-bttm-md > div > h2'
        )
        .innerText.slice(8)
      const detailGroups = document.querySelectorAll(
        'body > main > div.panel.panel-default.mrgn-tp-0.mrgn-bttm-md > div > ul.list-bullet-none > li'
      )
      const sections = []
      for (const group of detailGroups) {
        const groupName = group.querySelector(
          'p.margin-bottom-none > strong'
        ).innerText
        const groupItems = []
        group.querySelectorAll('ul > li').forEach((node) => {
          const x = node.innerText
          groupItems.push(x)
        })
        sections.push({
          title: groupName,
          items: groupItems,
        })
      }

      return { noc_number, occupation, sections }
    })

    data.push(obj)
  }
  await fs.writeFile('./data/unit_groups.json', JSON.stringify(data))

  browser.close()
}
