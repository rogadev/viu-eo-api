const unitGroups = require('../data/noc/2016/noc_2016_unit_groups.json')

const ensureArray = (input) => {
  if (Array.isArray(input)) {
    return input
  } else {
    let arr = input.split(',')
    return arr.map((item) => item.trim())
  }
}

const pushIfUnique = (arr, item) => {
  if (!arr.includes(item)) {
    arr.push(item)
  }
}

const search = require('../helpers/search.helper.js')

/**
 * Receives credential keywords and search keywords, uses them to find NOC unit groups that match the keywords/requirements.
 * @returns An object containing jobs and groups, relevant to the given search.
 */
exports.jobsByCredential = function (req, res) {
  const keywords = {
    credential: [...ensureArray(req.query.credential)],
    search: [...ensureArray(req.query.keywords)],
  }

  const result = search(keywords)

  res.send(result)
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

  const jobResults = []
  const groupResults = []

  if (nocKeywords) {
    const credential = program.credential
    const keywords = {
      credential: [...ensureArray(credential)],
      search: [...ensureArray(nocKeywords)],
    }
    const results = search(keywords)
    results.jobs.forEach((result) => pushIfUnique(jobResults, result))
    results.groups.forEach((result) => pushIfUnique(groupResults, result))
  }
  if (knownGroups) {
    knownGroups.forEach((noc) => {
      const groupResult = unitGroups.find(
        (noc) => noc === uGroup.noc.toString()
      )
      if (groupResult) {
        pushIfUnique(groupResults, groupResult)
      }
    })
  }

  const results = {
    jobs: jobResults,
    groups: groupResults,
  }

  res.send(results)
}
