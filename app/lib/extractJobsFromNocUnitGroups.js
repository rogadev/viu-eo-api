// HELPERS
const ensureArray = require('../helpers/ensureArray')
const pushIfUnique = require('../helpers/pushIfUnique')
const titleCase = require('../helpers/titleCase.js')

// DATA
const allNocUnitGroups = require('../data/noc/2016/noc_2016_unit_groups.json')

/**
 * Extracts jobs from a given version of NOC unit groups (2016 or 2021), for given a set of NOC numbers.
 * @param {string[]} arr - An array of NOC unit group numbers as strings.
 * @returns An array of jobs item objects - ex. [{noc: 1234, titles: ['','','',...]},{...},{...},...]
 */
module.exports = (arr) => {
  const unitGroupsArray = ensureArray([...arr])

  const jobResults = []

  for (const unitGroupNoc of unitGroupsArray) {
    const { noc, jobs } = allNocUnitGroups.find(
      (unitGroup) =>
        /** @type {string} */ unitGroup.noc ===
        /** @type {string} */ unitGroupNoc
    )
    jobs.forEach(({ jobTitle }) => {
      pushIfUnique(jobResults, { noc, title: titleCase(jobTitle) })
    })
  }

  return jobResults
}
