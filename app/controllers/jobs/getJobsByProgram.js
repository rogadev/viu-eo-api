const {
  pushIfUnique,
  keywordCombinator,
  ensureArray,
} = require('../../helpers/array.helpers.js')

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

  // Collector array for all the jobs we find
  const jobs = []

  // Check program properties for known NOC searchable keywords and groups.
  if (program?.noc_search_keywords)
    addJobsFromKnownKeywords(
      program.noc_search_keywords,
      program.credential,
      jobs
    )
  console.log(
    `${jobs.length} jobs found after evaluating for known NOC keywords`
  )
  if (program?.known_noc_groups)
    addJobsFromKnownGroups(program.known_noc_groups, jobs)
  console.log(`${jobs.length} jobs found after evaluating for known NOC groups`)

  // Do an organic search for this program's title and credential.
  addJobsFromTitleAndCredential(program.title, program.credential, jobs)
  console.log(
    `${jobs.length} jobs found after evaluating for program title and credential`
  )

  // If we haven't found any jobs, return program details, an empty array of jobs, and a message.
  if (!jobs.length)
    return res.status(200).send({
      data: { program, jobs: [] },
      message: `No jobs found for ${program.title}. Try contacting the web department to help us improve search results.`,
    })

  // If we have found jobs, return program details and the array of jobs.
  res.status(200).send({
    data: {
      program,
      jobs: [],
    },
    message: 'Jobs found.',
  })
}

/**
 * Add jobs to the collector array based on the given keywords.
 * @param {string[]} kwArr
 * @param {string} cred
 * @param {object[]} collector
 */
function addJobsFromKnownKeywords(kwArr, cred, collector) {
  console.log(`Evaluating for known keywords: ${kwArr} & ${cred}`)
  const initialLength = collector.length
  const credentials = expandedCredential(cred)
  const keywords = keywordCombinator(kwArr, credentials)
  addJobsFromTitleAndCredential(keywords, cred, collector)
  const resultsDelta = collector.length - initialLength
  console.log(`${resultsDelta} jobs found after evaluating for known keywords`)
}

/**
 * Add jobs to the collector array based on the given NOC groups.
 * @param {string[]} groups
 * @param {object[]} collector
 */
function addJobsFromKnownGroups(groups, collector) {
  console.log('Known groups found:', groups)
}

/**
 * Add jobs to the collector array based on the given title and credential.
 * @param {string} titleString
 * @param {string | string[]} credentialArray
 * @param {object[]} collector
 */
function addJobsFromTitleAndCredential(
  titleString,
  credentialArray,
  collector
) {
  const title = titleString.toLowerCase()
  const credentials = ensureArray(credentialArray).forEach((credential) => {
    return expandedCredential(credential)
  })
}

/**
 * Expands on the credential string and returns an array that includes all possible variations commonly found in NOC data.
 * @param {string} credential
 */
function expandedCredential(credential) {
  const credentials = []
  switch (credential.toLowerCase()) {
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
      credentials.push(credential)
      credentials.push('certificate')
      credentials.push('diploma')
      credentials.push('degree')
      credentials.push('trades')
      break
  }
}
