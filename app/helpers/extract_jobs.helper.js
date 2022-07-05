// DATA
const unitGroups = require('../data/noc/2016/noc_2016_unit_groups.json')

// HELPERS
const { pushIfUnique, ensureArray } = require('./array.helpers.js')

/**
 * Extracts jobs from a given version of NOC unit groups (2016 or 2021), for given a set of NOC numbers.
 * @param {Array} arr - An array of NOC unit group numbers as strings.
 * @param {Number} nocVersion - The NOC version to use. 2016 by default. 2021 also available.
 * @returns An array of jobs item objects - ex. [{noc: 1234, titles: ['','','',...]},{...},{...},...]
 */
module.exports = (arr, nocVersion = 2016) => {
  const unitGroupsArray = [...arr]
  const unitGroups =
    nocVersion === 2021
      ? require('../data/noc/2021/noc_2021_unit_groups.json')
      : require('../data/noc/2016/noc_2016_unit_groups.json')

  const jobs = []

  for (const unitGroup of unitGroups) {
    if (unitGroupsArray.find((ug) => ug.noc === unitGroup.noc)) {
      const jobsSection = unitGroup.sections.find((section) =>
        section.title.includes('Illustrative example(s)')
      )
      for (const job of jobsSection.items) {
        const item = {
          noc: unitGroup.noc,
          titles: [],
        }
        pushIfUnique(jobs, item)
      }
    }
  }

  return jobs
}
