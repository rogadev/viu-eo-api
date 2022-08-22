// HELPERS
const keywordCombinator = require('../../helpers/keywordCombinator.js')
const pushIfUnique = require('../../helpers/pushIfUnique.js')
const pushUniqueJobObject = require('../../helpers/pushUniqueJobObject.js')
const ensureArray = require('../../helpers/ensureArray.js')

// DATA
const nocData = require('../../data/noc/2016/noc_2016_unit_groups.json')
const allProgramNids = require('../../data/viu/all_program_nids.json')
const allPrograms = require('../../data/viu/searchable_programs.json')

module.exports = (req, res) => {
  const programNid = req.params.nid

  // Does this NID exist?
  if (!allProgramNids.includes(programNid))
    return res.status(200).send({ data: [], message: 'No jobs found' })

  // Get the program data
  const program = allPrograms.find(
    (program) => program.nid === Number(programNid)
  )

  // Split out the title and credential properties and validate them
  const programTitle = program.title
  const programCredential = program.credential
  if (!programTitle || !programCredential)
    throw new Error(
      `This program seems to be missing data. Evaluating title & credential (Title: ${programTitle} Credential: ${programCredential})`
    )

  // Break out search keywords and known NOC codes
  const programKeywords = program?.noc_search_keywords ?? false
  const programNocCodes = program?.known_noc_groups ?? false

  // Collector array for all the jobs we find
  let jobsCollector = []

  // Check program properties for known NOC searchable keywords and groups.
  if (programKeywords) {
    const foundJobs = addJobsWithKeywordsAndCredential(
      programKeywords,
      programCredential,
      jobsCollector
    )
    // jobsCollector.push(...foundJobs)
  }
  console.log(
    `${jobsCollector.length} jobs found after evaluating for known NOC keywords`
  )

  if (programNocCodes) {
    addJobsFromKnownGroups(programNocCodes, jobsCollector)
    console.log(
      `${jobsCollector.length} jobs found after evaluating for known NOC groups`
    )
  }

  // Do an organic search for this program's title and credential.
  console.log(`Searching for jobs for ${program.title}, ${program.credential}`)
  addJobsWithKeywordsAndCredential(
    [program.title],
    program.credential,
    jobsCollector
  )
  console.log(
    `${jobsCollector.length} jobs found after evaluating for program title and credential`
  )

  // If we haven't found any jobs, return program details, an empty array of jobs, and a message.
  if (!jobsCollector.length)
    return res.status(200).send({
      data: { program, jobs: [] },
      message: `No jobs found for ${program.title}. Try contacting the web department to help us improve search results.`,
    })

  // If we have found jobs, return program details and the array of jobs.
  res.status(200).send({
    data: {
      program,
      jobs: jobsCollector,
    },
    message: 'Jobs found.',
  })
}

/**
 * Add jobs to the collector array based on the given keywords.
 * @param {string[]} keywordsArray
 * @param {string} credentialString
 * @param {object[]} collectorArray
 */
function addJobsWithKeywordsAndCredential(
  keywordsArray,
  credentialString,
  collectorArray
) {
  console.log(
    `Evaluating for known keywords: ${keywordsArray} & ${credentialString}`
  )
  const initialLength = collectorArray.length
  const expandedCredentialsArray = expandCredentials(credentialString)
  const keywordsCombinations = keywordCombinator(
    keywordsArray,
    expandedCredentialsArray
  )

  // Check every unit group in the noc data...
  nocData.forEach((group) => {
    const noc = group.noc
    // if none of this group requirements does not include "years of experience"
    let experienceRequired = false
    group.requirements.forEach((requirement) => {
      if (requirement.includes('years of experience')) {
        experienceRequired = true
      }
    })
    if (!experienceRequired) {
      // ... look at each item in the requirements property of the group...
      group.requirements.forEach((requirement) => {
        // ... and check if it matches any of the keywords combinations.
        keywordsCombinations.forEach(([keyword, credential]) => {
          // If it does, add each of the group's jobs to the collector array, as follows
          if (requirement.includes(keyword) && requirement.includes(credential))
            group.jobs.forEach((title) => {
              collectorArray = pushUniqueJobObject(
                { noc, title },
                collectorArray
              )
            })
        })
      })
    }
  })
  console.log(`${collectorArray.length - initialLength} jobs found`)
  return collectorArray
}

/**
 * Add jobs to the collector array based on the given NOC groups.
 * @param {string[]} groups
 * @param {object[]} collector
 */
function addJobsFromKnownGroups(groups, collector) {
  console.log('Known groups found:', groups)
  groups.forEach((noc) => {
    const group = nocData.find((group) => group.noc === noc)
    if (group) {
      group.jobs.forEach((title) => {
        collector = pushUniqueJobObject({ noc, title }, collector)
      })
    }
  })
  return collector
}

/**
 * Expands on the credential string and returns an array that includes all possible variations commonly found in NOC data.
 * @param {string} credential
 */
function expandCredentials(credential) {
  // console.log(`Expanding credential: ${credential}`)
  const credentials = []
  switch (credential.toLowerCase().trim()) {
    case 'degree':
      credentials.push(
        'degree',
        'diploma',
        'university program',
        'university or college'
      )
      break
    case 'diploma':
      credentials.push('diploma', 'college program', 'college or other program')
      break
    case 'certificate':
      credentials.push(
        'certificate',
        'school programs',
        'school program',
        'apprenticeship',
        'red seal',
        'trades program',
        'trades school'
      )
    case 'trades':
      credentials.push(
        'trades school',
        'trades program',
        'trades certificate',
        'trades diploma',
        'trades degree',
        'trades university',
        'trades college',
        'trade school',
        'trade program',
        'trade certificate',
        'trade diploma',
        'trade degree',
        'red seal'
      )
    default:
      break
  }
  // console.log(`Expanded credentials: ${credentials}`)
  return credentials
}
