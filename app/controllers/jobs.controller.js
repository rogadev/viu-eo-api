const unitGroups = require('../data/noc/2016/noc_2016_unit_groups.json')

const ensureArray = (input) => {
  if (Array.isArray(input)) {
    return input
  } else {
    let arr = input.split(',')
    return arr.map((item) => item.trim())
  }
}

/**
 * Receives credential keywords and search keywords, uses them to find NOC unit groups that match the keywords/requirements.
 * @returns An object containing jobs and groups, relevant to the given search.
 */
exports.jobsByCredential = function (req, res) {
  const keywords = {
    credential: [...ensureArray(req.query.credential)],
    search: [...ensureArray(req.query.keywords)],
  }

  res.send(keywords)
}

/**
 * Receives a program NID as a parameter, uses the NID to extrapolate credential keywords and search keywords. Queries
 * jobs-by-credential and returns the resulting object.
 * @returns An object containing jobs and groups, relevant to the given search.
 */
exports.jobsByProgram = function (req, res) {
  const programs = require('../data/viu/searchable_programs.json')
  const program = programs.find(
    (program) => program.nid.toString() === req.params.nid
  )
  const nocKeywords = program.noc_search_keywords
    ? program.noc_search_keywords
    : null
  const knownGroups = program.known_noc_groups ? program.known_noc_groups : null

  const results = []

  // TODO - Finish implementation

  if (nocKeywords) {
    // Search keywords
    // Push results to results array
  }
  if (knownGroups) {
    // Retrieve results from known groups
    // Push results to results array
  }

  res.send(program)
}
