const fs = require('fs')
const path = require('path')
const oldData = require('../data/noc/2016/noc_2016_unit_groups.json')

exports.fixData = (req, res) => {
  const collector = []
  for (const unitGroup of oldData) {
    const jobsSection = unitGroup.sections.find((section) =>
      section.title.includes('Illustrative example(s)')
    )
    const exclusionsSection = unitGroup.sections.find((section) =>
      section.title.includes('Exclusion(s)')
    )
    const requirementsSection = unitGroup.sections.find((section) =>
      section.title.includes('Employment requirements')
    )

    const requirements = requirementsSection.items.every(
      (el) => typeof el === 'string'
    )
      ? requirementsSection.items.map((item) => '' + item)
      : requirementsSection.items.map((item) =>
          item.items.map((subItem) => '' + subItem)
        )

    const fixedRequirements = requirements.map((item) => {
      return item
        .toString()
        .replace(/\s+/g, ' ')
        .replace(/[\r\n]/g, '')
        .trim()
    })

    const dutiesSection = unitGroup.sections.find((section) =>
      section.title.includes('Main duties')
    )
    const newUnitGroup = {
      noc: unitGroup.noc,
      title: unitGroup.title,
      jobs: jobsSection.items,
      exclusions: exclusionsSection.items,
      requirements: fixedRequirements,
      duties: dutiesSection.items,
    }
    collector.push(newUnitGroup)
  }

  fs.writeFileSync(
    path.join(__dirname, '../data/noc/2016/new_noc_2016_unit_groups.json'),
    JSON.stringify(collector, null, 2)
  )
  res.send('Done')
}
