const ensureArray = require('../../helpers/ensureArray.js')
const findJobsByCredentialSearch = require('../../lib/findJobsByCredentialSearch.js')

/**
 * Receives credential keywords and search keywords, uses them to find NOC unit groups that match the keywords/requirements.
 * @returns An object containing jobs and groups, relevant to the given search.
 */
module.exports = (req, res) => {
  // Required keywords format for search() helper function
  const keywords = {
    credential: req.query.credential,
    searchKeywords: [...ensureArray(req.query.keywords)],
  }
  // Search the data for matching unit groups
  const result = findJobsByCredentialSearch(keywords)
  // If result returns with an error property, send error.
  if (!result.length) {
    return res.status(404).send({ data: {}, message: 'No jobs found' })
  }
  // If no error, send the results.
  res.status(200).send({ data: result, message: 'Jobs found.' })
}
