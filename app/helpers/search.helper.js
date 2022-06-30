const keywordCombinator = (arr1, arr2) => {
  const results = []
  for (const item1 of arr1) {
    for (const item2 of arr2) {
      results.push([item1, item2])
    }
  }
  return results
}

const pushIfUnique = (arr, item) => {
  if (!arr.includes(item)) {
    arr.push(item)
  }
}

/**
 * Using credential and search keywords, searches for matching NOC unit groups, based on requirements, and returns the results.
 * @param {Object} keywords - An object containing credential keywords and search keywords.
 * @returns An object containing jobs and groups, relevant to the given search.
 */
module.exports = (keywordObject) => {
  const unitGroups = require('../data/noc/2016/noc_2016_unit_groups.json')
  const { credential, search } = keywordObject
  const combinations = keywordCombinator(credential, search)
  const groupResults = []

  for (const keywords in combinations) {
    const result = unitGroups.find((group) => {
      const reqSection = group.sections.find(
        (section) => section.title === 'Employment requirements'
      )
      const requirements = reqSection.items
      return requirements.includes(keywords)
    })
    if (result) {
      pushIfUnique(groupResults, result)
    }
  }

  const results = {
    jobs: [],
    groups: [],
  }

  // At this point, if we have no group results, we can return our empty array.
  if (!(groupResults.length > 0)) {
    console.log('return with no found results')
    return results
  }

  for (const group of groupResults) {
    pushIfUnique(results.groups, group)
    const jobsSection = group.sections.find(
      (section) => section.title === 'Illustrative example(s)'
    )
    const jobs = jobsSection.map((section) => section.items)
    for (const job of jobs) {
      pushIfUnique(results.jobs, job)
    }
  }

  console.log('🚀 ~ file: search.helper.js ~ line 53 ~ results', results)

  return results
}
