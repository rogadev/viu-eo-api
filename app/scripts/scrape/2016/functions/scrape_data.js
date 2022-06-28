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

    const results = await page.$eval(
      'body > main > div.panel.panel-default.mrgn-tp-0.mrgn-bttm-md > div > h2',
      (el) => el.innerText
    )
    // Result 1 - NOC Number and Unit Group Title
    const noc = results.substring(0, 5).trim()
    const title = results.substring(6).trim()
    console.log(noc, title)

    // Result 2 - List of sections
    const sections = await page.evaluate(() => {
      const sectionNodes = []
      document
        .querySelectorAll(
          'body > main > div.panel.panel-default.mrgn-tp-0.mrgn-bttm-md > div > ul.list-bullet-none > li'
        )
        .forEach((el) => {
          sectionNodes.push(el)
        })

      const sections = []
      for (const sectionNode of sectionNodes) {
        // count number of ul's in sectionNode
        const ulCount = sectionNode.querySelectorAll('ul').length
        if (ulCount > 1) {
          const subSectionNodes = sectionNode.querySelectorAll('ul')
          const subSections = []
          for (const subSection of subSectionNodes) {
            const subSectionTitle = subSection.previousElementSibling.innerText
            const subSectionItems = []
            subSection
              .querySelectorAll('ul > li')
              .forEach((el) => subSectionItems.push(el.innerText))

            subSections.push({
              title: subSectionTitle,
              items: subSectionItems,
            })
          }
          sections.push({
            title: sectionNode.querySelector('p > strong').innerText,
            subSections: subSections,
          })
        } else {
          const items = []
          sectionNode
            .querySelectorAll('li')
            .forEach((el) => items.push(el.innerText))
          sections.push({
            title: sectionNode.querySelector('p > strong').innerText,
            items,
          })
        }
      }
      return sections
    })
    collection.push(sections)
  }

  fs.writeFile(
    path.join(__dirname, '../data/noc_2016_unit_groups.json'),
    JSON.stringify(collection)
  )

  browser.close()
  return collection
}
