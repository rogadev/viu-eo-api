// DATA
const unitGroups = require('../data/noc/2016/noc_2016_unit_groups.json')
const allPrograms = require('../data/viu/all_programs.json')
const searchablePrograms = require('../data/viu/searchable_programs.json') // NOTE: Only using searchable programs. Not all programs will return results.
const { getProgram } = require('../helpers/viu_data.helpers.js')

// HELPERS
const search = require('../helpers/search.helper.js')
const { pushIfUnique, ensureArray } = require('../helpers/array.helpers.js')
const findJobsForUnitGroups = require('../helpers/extract_jobs.helper.js')
const { getOutlook } = require('../helpers/outlook.helpers.js')
const { titleCase } = require('../helpers/string.helpers')

// CONTROLLER FUNCTIONS

/**
 * Receives credential keywords and search keywords, uses them to find NOC unit groups that match the keywords/requirements.
 * @returns An object containing jobs and groups, relevant to the given search.
 */
exports.jobsByCredential = function (req, res) {
  // Required keywords format for search() helper function
  const keywords = {
    credential: [...ensureArray(req.query.credential)],
    search: [...ensureArray(req.query.keywords)],
  }
  // Search the data for matching unit groups
  const result = search(keywords)
  // If result returns with an error property, send error.
  if (result.error) res.status(500).send(result.error)
  // If no error, send the results.
  else res.send(result)
} // WORKING August 12, 2022

/**
 * Receives a program NID as a parameter, uses the NID to extrapolate credential keywords and search keywords. Queries
 * jobs-by-credential and returns the resulting object.
 * @returns An object containing jobs and groups, relevant to the given search.
 */
exports.jobsByProgram = function (req, res) {
  // Check the searchable programs, first. We have some hard coded data, there.
  const foundSearchableProgram =
    searchablePrograms.find(
      (program) => program.nid.toString() === req.params.nid
    ) ?? false

  // Find the program using it's NID - Use searchable program data first, if possible, because it has known keywords and groups.
  const program =
    foundSearchableProgram ??
    allPrograms.find((program) => program.nid.toString() === req.params.nid)

  // Extract NOC searchable keywords (searched using the search() helper function)
  const knownKeywords = program.noc_search_keywords ?? false

  // Extract all known NOC unit groups - this is an array of NOC unit group numbers as strings.
  const knownGroups = program.known_noc_groups ?? false

  // Collector Array
  const jobResults = []

  // Collecting Jobs From Known Keywords - If Any
  if (knownKeywords) {
    const credential = program.credential
    const keywords = {
      credential: [...ensureArray(credential)],
      search: [...ensureArray(knownKeywords)],
    }
    const results = search(keywords)
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

  // TODO - Add the ability to search organically for jobs.

  if (jobResults.length > 0) res.json(jobResults)
  else res.send('No jobs found for this program')
}

/**
 * Find all the jobs related to this unit group and return found array, or send 500 status.
 * @param noc The NOC code to find
 * @returns If found, it will return the array of jobs related to this unit group.
 */
exports.getJobs = (req, res) => {
  const noc = req.params.noc
  if (noc) {
    const { jobs } = unitGroups.find((group) => group.noc === noc)
    if (jobs) res.json(jobs)
  }
  res.status(500).send('Something went wrong')
} // MOTHBALL August 12, 2022

/**
 * Get a list of jobs related to a given NID, including the employment outlook in BC.
 */
exports.getJobsAndOutlook = async (req, res) => {
  // Type validation on NID.
  const NID = Number(req.params.nid) ?? false
  if (!NID)
    return res
      .status(500)
      .send(
        `There was an issue with the NID provided to getJobsAndOutlook(). Must be a valid NID. Must be a number, or string that can be cast to a number. Received: ${req.params.nid}`
      )

  // Find the program using it's NID
  const { result, error } = await getProgram(NID)
  const program = result
  if (error || !program) {
    return res.status(500).send(error ?? `No programs found for NID ${NID}`)
  }

  // Extract NOC searchable keywords (searched using the search() helper function)
  const nocKeywords = searchablePrograms.find(
    (program) => program.nid == NID
  )?.noc_search_keywords

  // Extract all known NOC unit groups - this is an array of NOC unit group numbers as strings.
  const knownGroups = searchablePrograms.find(
    (program) => program.nid == NID
  )?.known_noc_groups

  // Collector Array
  const jobResults = []

  // Only attempt to search if we have keywords to search with
  if (nocKeywords) {
    const credential = program.credential // TODO We used to be upgrading our credential to account for more variations that we sometimes find in the data. Ex. "certificate" might be "red seal" or "apprenticeship program" or "trades school".
    const keywords = {
      credential: [...ensureArray(credential)],
      search: [...ensureArray(nocKeywords)],
    }
    const results = search(keywords)
    if (!results.jobs) {
      return
    }
    results.jobs.forEach((result) => {
      pushIfUnique(jobResults, result)
    })
  }

  // Also add unit group NOC's from the knownGroups if the program we're searching for has any
  if (knownGroups) {
    const jobs = findJobsForUnitGroups(knownGroups)
    jobs.forEach((job) => {
      pushIfUnique(jobResults, job)
    })
  }

  // If we don't have either nocKeywords or knownGroups, we'll have to guess what to search for. This won't be the best outcome.
  if (!nocKeywords && !knownGroups) {
    const credential = program.credential // TODO We used to be expand our credential keywords to include a wide range of variations that we sometimes find in the data. Ex. "certificate" might be "red seal" or "apprenticeship program" or "trades school".
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
    const results = search(keywords)
    results.jobs.forEach((result) => {
      const noc = result.noc
      const jobs = result.jobs
      jobs.forEach((job) => {
        pushIfUnique(jobResults, { noc, title: job })
      })
    })

    // We return 204 No Content if we don't find any jobs, adding a message prop for debugging purposes. This message should clearly describe what to do to render search results.
    if (jobResults.length === 0) {
      return res.status(204).json({
        jobs: [],
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
  res.send({
    jobs: finalResults,
  })
}
