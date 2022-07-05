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

const expandCredentials = (credentials) => {
  const result = []
  for (let cred of credentials) {
    cred = cred.toLowerCase().trim()

    if (cred.includes('degree')) {
      result.push(
        'degree',
        'university program',
        'university or college',
        "bachelor's",
        "master's",
        'doctoral'
      )
    }
    if (cred.includes('certificate')) {
      result.push(
        'certificate',
        'school programs',
        'school program',
        'apprenticeship',
        'red seal',
        'trades program',
        'trades school'
      )
    }
    if (cred.includes('diploma')) {
      result.push('diploma', 'college program', 'college or other program')
    }
  }
  return result
}

/**
 * Using credential and search keywords, searches for matching NOC unit groups, based on requirements, and returns the results.
 * @param {Object} keywords - An object containing credential keywords and search keywords.
 * @returns An object containing jobs and groups, relevant to the given search.
 */
module.exports = (keywordObject) => {
  const unitGroups = require('../data/noc/2016/noc_2016_unit_groups.json')
  const { credential, search: searchTerms } = keywordObject
  const expandedCredentialTermsArray = expandCredentials(credential)
  const keywordCombinationsArray = keywordCombinator(
    expandedCredentialTermsArray,
    searchTerms
  )

  // Collector
  const groupResults = []

  for (const group of unitGroups) {
    for (const keywordCombo of keywordCombinationsArray) {
      // One keyword combo will be a combination of credential and search terms (e.g. ['degree', 'programming'])

      // Break out each group's requirement's into an array
      const groupRequirements = group.sections.find((section) =>
        section.title.includes('Employment requirements')
      )
      const rawRequirements = groupRequirements.items
      // There is an issue with requirements - formatting did not remove + signs or \n characters. This breaks array functions.
      const requirements = rawRequirements.reduce((items, item) => {
        return [...items, ('' + item).replace(/[\r\n]/gm, '').trim()]
      }, [])
      // For every requirement, check if it matches the keyword combo
      for (const requirement of requirements) {
        if (keywordCombo.every((keyword) => requirement.includes(keyword))) {
          pushIfUnique(groupResults, group)
        }
      }
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

  const jobs = []

  for (const group of groupResults) {
    pushIfUnique(results.groups, group)
    const jobSection = group.sections.find((section) =>
      section.title.includes('Illustrative example(s)')
    )
    jobs.push({
      noc: group.noc,
      jobs: jobSection.items,
    })
  }

  results.jobs = jobs

  return results
}
