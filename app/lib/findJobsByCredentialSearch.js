// HELPERS
const { pushIfUnique } = require('../helpers/array.helpers.js')
const { titleCase } = require('../helpers/string.helpers.js')

// DATA
const allUnitGroups = require('../data/noc/2016/noc_2016_unit_groups.json')

/**
 * Expands the "credential" keywords. Combines credential keywords and search kewords. Searches Stats Canada's NOC data for jobs that match the expanded keywords to job requirements fields. These resulting unit groups jobs are maped out and returned in the results. Returns an error property if encountered.
 * @param {{credential: string[], searchKeywords: string[]}} keywords - An object containing credential keywords and search keywords.
 * @returns an array of job objects related to this search. If no jobs are found, returns an empty array.
 */
module.exports = ({ credential, searchKeywords }) => {
  // Validate that we have both a credential and search terms. Return empty if not. Note: this should be caught by middleware prior to getting here.
  if (!credential.length || !searchKeywords.length)
    throw new Error('Missing credential or search keywords')

  // Filter out unit groups that require years of experience - we want results that are GRADUATE LEVEL ONLY.
  const unitGroups = allUnitGroups.filter(
    ({ requirements }) =>
      !requirements.some((requirement) =>
        requirement.toLowerCase().includes('years of experience')
      )
  )

  // Expand credential to include additional, related keywords. eg. 'degree' => ['diploma', 'certificate', 'college program']
  const expandedCredentialKeywords = expandCredentials(credential)

  // Derive all combinations of credential and search keywords.
  const keywordCombinationsArray = keywordCombinator(
    expandedCredentialKeywords,
    searchKeywords
  )

  // Collector
  const groupResults = []

  // For each keyword combination, search the unit groups for matches.
  for (const group of unitGroups) {
    const { requirements } = group // contains education requirements which we can match the search keywords against.
    // For each combination in our keyword combinations array...
    for (const keywordCombo of keywordCombinationsArray) {
      // ... look through each requirement in the group...
      for (const requirement of requirements) {
        // ...and see if there's a match against the search keywords.
        if (keywordCombo.every((keyword) => requirement.includes(keyword))) {
          // If there's a match, add the group to the collector.
          pushIfUnique(groupResults, group)
        }
      }
    }
  }

  // At this point, if we have no group results, we won't have any jobs. Return an empty array.
  if (!groupResults.length) return []

  // Otherwise, start collecting jobs and respond with the results.
  /** @type {{noc: number, title: string}} */
  const jobResults = []

  // For each group result...
  for (const { noc, jobs } of groupResults) {
    // ... loop through each job in the array of jobs ...
    jobs.forEach((job) => {
      // ... and add the job to the job results array.
      pushIfUnique(jobResults, { noc, title: titleCase(job) })
    })
  }

  // Finally, return our array of job objects.
  return jobResults
}

// HELPER FUNCTIONS

/**
 * keywordCombinator(arr1, arr2) creates every possible combination between two sets of arrays. For the purpose of this project, we use this function to create every possible combination of credential keywords and search keywords.
 * @param {string[]} arr1 - An array of strings
 * @param {string[]} arr2 - An array of strings
 * @returns An array of arrays of strings, each array containing a combination of strings from arr1 and arr2.
 */
function keywordCombinator(arr1, arr2) {
  const results = []
  for (const item1 of arr1) {
    for (const item2 of arr2) {
      pushIfUnique(results, [item1.toLowerCase(), item2.toLowerCase()])
    }
  }
  return results
}

/**
 * When searching NOC requirements fields, the credential terms require expanding to include more than just one word, as the fields beign searched are not standardized.
 * @param {string[]} credentials - Credential keyword(s) to expand.  e.g. ['degree', 'certificate', 'diploma']
 * @returns Expanded credential keyword(s) e.g. ['degree', 'certificate', 'diploma', 'degree certificate', 'degree diploma', 'certificate diploma']
 */
function expandCredentials(credentials) {
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
    if (cred.includes('trades')) {
      result.push(
        'apprenticeship',
        'red seal',
        'trades program',
        'trades school',
        'certificate'
      )
    }
    if (cred.includes('diploma')) {
      result.push('diploma', 'college program', 'college or other program')
    }
  }
  return result
}
