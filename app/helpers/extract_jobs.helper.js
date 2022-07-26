// HELPERS
const { pushIfUnique, ensureArray } = require('./array.helpers.js')
const { titleCase } = require('./string.helpers.js')

const unitGroups = require('../data/noc/2016/noc_2016_unit_groups.json')

/**
 * Extracts jobs from a given version of NOC unit groups (2016 or 2021), for given a set of NOC numbers.
 * @param {Array<String>} arr - An array of NOC unit group numbers as strings.
 * @returns An array of jobs item objects - ex. [{noc: 1234, titles: ['','','',...]},{...},{...},...]
 */
module.exports = (arr) => {
  const jobResults = []
  const unitGroupsArray = ensureArray([...arr])

  for (const noc of unitGroupsArray) {
    const { jobs } = unitGroups.find((unitGroup) => unitGroup.noc === noc)

    jobs.forEach((job) => {
      pushIfUnique(jobResults, { noc, title: titleCase(job) })
    })
  }

  return jobResults
}

// TODO - test this function!
