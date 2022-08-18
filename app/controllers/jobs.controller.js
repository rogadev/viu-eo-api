// DATA
const unitGroups = require('../data/noc/2016/noc_2016_unit_groups.json')
const searchablePrograms = require('../data/viu/searchable_programs.json') // NOTE: Only using searchable programs. Not all programs will return results.
const { getProgram } = require('../helpers/viu_data.helpers.js')

// HELPERS
const findJobsByCredentialSearch = require('../lib/findJobsByCredentialSearch.js')
const { pushIfUnique, ensureArray } = require('../helpers/array.helpers.js')
const extractJobsFromUnitGroups = require('../lib/extractJobsFromNocUnitGroups.js')
const { getOutlook } = require('../helpers/outlook.helpers.js')
const { titleCase } = require('../helpers/string.helpers')

// CONTROLLER FUNCTIONS

/**
 * Controller for retrieving a list of jobs by program search.
 */
exports.jobsByProgram = async function (req, res) {
  console.log('jobsByProgram', req.params.nid)
  const searchedNid = req.params.nid

  // Check the searchable programs, first. We have some hard coded data, there.
  const program = searchablePrograms.find(
    ({ nid }) => nid == searchedNid // string to number comparison
  )

  // If there is no program, return a 404.
  if (!program) {
    return res.status(204).send({ data: [], message: 'No jobs found' })
  }

  const { title, noc_search_keywords, known_noc_groups, credential } = program

  // Extract NOC searchable keywords (searched using the search() helper function)
  const knownKeywords = noc_search_keywords

  // Extract all known NOC unit groups - this is an array of NOC unit group numbers as strings.
  const knownGroups = known_noc_groups

  // Collector Array
  const jobResults = []

  // Collecting Jobs From Known Keywords - If Any
  if (knownKeywords) {
    const keywords = {
      credential: [...ensureArray(credential)],
      searchKeywords: [...ensureArray(knownKeywords)],
    }
    const results = findJobsByCredentialSearch(keywords)
    results.forEach((result) => pushIfUnique(jobResults, result))
  }

  // Collecting Jobs From Known Groups - If Any
  if (knownGroups) {
    knownGroups.forEach((knownGroup) => {
      // Search for a matching unit group using the NOC unit group number
      const groupResult = unitGroups.find(
        (unitGroup) => knownGroup === unitGroup.noc.toString()
      )
      // It's possible that there are no group results due to a bad data, or a breaking change, so we'll check for that.
      if (groupResult) {
        const noc = groupResult.noc
        const listOfJobs = groupResult.jobs
        listOfJobs.forEach((title) => {
          pushIfUnique(jobResults, { noc, title: titleCase(title) })
        })
      }
    })
  }

  // Lastly, do an organic search on the program using it's title and credential properties.
  const programKeywords = {
    credential: [...ensureArray(credential)],
    searchKeywords: [...ensureArray(title)],
  }

  const organicSearchResults = findJobsByCredentialSearch(programKeywords)

  if (organicSearchResults.length) {
    organicSearchResults.forEach((organicSearchResult) =>
      pushIfUnique(jobResults, organicSearchResult)
    )
  }

  if (!jobResults.length) {
    return res.status(204).send({ data: [], message: 'No jobs found' })
  }

  res.status(200).send({ data: jobResults, message: 'Jobs found.' })
}

/**
 * Find all the jobs related to this unit group and return found array, or send 500 status.
 * @param noc The NOC code to find
 * @returns If found, it will return the array of jobs related to this unit group.
 */
exports.getJobs = (req, res) => {
  const noc = req.params.noc
  const jobs = []
  if (noc) {
    const { jobs } = unitGroups.find((group) => group.noc === noc)
    if (jobs) {
      jobs.forEach((job) => {
        pushIfUnique(jobs, { noc, title: titleCase(job) })
      })
    }
  }
  if (!jobs.length) {
    return res.status(204).send({ data: [], message: 'No jobs found' })
  }
  return res.status(200).send({ data: jobs, message: 'Jobs found.' })
} // MOTHBALL August 12, 2022

/**
 * Get a list of jobs related to a given NID, including the employment outlook in BC.
 */
exports.getJobsAndOutlook = async (req, res) => {
  // I opted not to do middleware for this route - this is our parameter checking and error handling
  const NID = Number(req.params.nid) ?? false
  if (!NID)
    return res.status(400).send({
      error: {
        message:
          'NID is required and must be a number or string that can be converted to a number.',
      },
    })

  // Find the program using it's NID
  const { result: program, error } = await getProgram(NID)
  if (error || !program) {
    return res.status(400).send({
      error: {
        message: `Could not find a program with nid "${NID}". Check your request and try again.`,
      },
    })
  }

  // NOTE: known keywords and known groups are found on the "searchable" list of VIU programs. Not all programs on the VIU program list will return resutls and not all programs will have known keywords and groups added to them. In the future, it would be advisable to port over these properties from the hard-coded searchable programs list and add them to the program list that we can fetch from VIU data, directly.

  // Extract NOC searchable keywords (searched using the search() helper function)
  /** @type {string[]} */
  const knownKeywords = searchablePrograms.find(
    (program) => program.nid == NID // using equality operator over exact equality operator for loose checking.
  )?.noc_search_keywords

  // Extract all known NOC unit groups - this is an array of NOC unit group numbers as strings.
  /** @type {string[]} */
  const knownGroups = searchablePrograms.find(
    (program) => program.nid == NID // using equality operator over exact equality operator for loose checking.
  )?.known_noc_groups

  // Collector Array
  /** @type {Array<{noc: number, title: string}>} */
  const jobResults = []

  // Only attempt to search if we have keywords to search with
  if (knownKeywords) {
    const credential = program.credential
    const keywords = {
      credential: [...ensureArray(credential)],
      searchKeywords: [...ensureArray(knownKeywords)],
    }
    /** @type {{noc: number, title: string}} */
    const results = findJobsByCredentialSearch(keywords)
    if (!results.length) {
      return
    }
    results.forEach((result) => {
      pushIfUnique(jobResults, result)
    })
  }

  // Also add unit group NOC's from the knownGroups if the program we're searching for has any
  if (knownGroups) {
    const results = extractJobsFromUnitGroups(knownGroups)
    results.forEach((job) => {
      pushIfUnique(jobResults, job)
    })
  }

  // If we don't have either nocKeywords or knownGroups, we'll have to guess what to search for. This won't be the best outcome.
  if (!knownKeywords && !knownGroups) {
    const credential = program.credential
    let programTitle = program?.title
    if (programTitle) programTitle = programTitle.trim()
    let programKeywords = program?.field_viu_search_keywords
    if (programKeywords) programKeywords = programKeywords.split(',')
    const searchkeywords = programKeywords
      ? [...ensureArray(programTitle), ...ensureArray(programKeywords)]
      : [...ensureArray(programTitle)]
    const keywords = {
      credential: [...ensureArray(credential)],
      search: [...ensureArray(searchkeywords)],
    }
    const results = findJobsByCredentialSearch(keywords)
    results.jobs.forEach((result) => {
      const noc = result.noc
      const jobs = result.jobs
      jobs.forEach((job) => {
        pushIfUnique(jobResults, { noc, title: job })
      })
    })

    // We return 204 No Content if we don't find any jobs, adding a message prop for debugging purposes. This message should clearly describe what to do to render search results.
    if (!jobResults.length) {
      return res.status(204).json({
        data: {},
        message:
          'This program NID does not have nocKeywords or knownGroups properties. This makes it very hard to search for. consider adding one or both of these properties to the program.' +
          `(nid: ${NID})`,
      })
    }
  }

  // Extracting a list of NOC's from the jobResults so that we can get the employment outlook for each.
  const applicableNOCs = []
  jobResults.forEach((job) => pushIfUnique(applicableNOCs, job.noc))

  // Getting the employment outlook for each NOC
  const outlooks = []
  for (const noc of applicableNOCs) {
    const outlook = await getOutlook(noc)
    pushIfUnique(outlooks, {
      noc,
      outlook: outlook.potential,
      outlook_verbose: outlook.outlook_verbose,
    })
  }

  // Form response and send.
  const finalResults = []
  jobResults.forEach((job) => {
    const outlook = outlooks.find((outlook) => outlook.noc === job.noc)
    const outlookNumber = outlook.outlook
    const verbose = outlook.outlook_verbose

    const result = {
      noc: job.noc,
      title: titleCase(job.title),
      outlook: outlookNumber,
      outlook_verbose: verbose,
    }
    finalResults.push(result)
  })
  res.status(200).send({
    data: finalResults,
    message: 'Jobs found.',
  })
}
