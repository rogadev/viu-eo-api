// DATA
const unitGroups = require('../data/noc/2016/noc_2016_unit_groups.json')

// HELPERS
const { ensureArray } = require('../helpers/array.helpers.js')

/**
 * Get one unit group, based on NOC, passed as a param.
 * @param noc The NOC code to search. Searches NOC 2016 V1.3 as of July 7, 2022
 * @returns The unit group, if found, or 500 error with message.
 */
exports.getGroup = (req, res) => {
  const noc = req.params.noc
  const result = unitGroups.find((group) => group.noc === noc)
  if (result) {
    res.json(result)
  }
  res.status(500).send('Something went wrong.')
}

/**
 * Get all unit groups, based on NOC, passed in as query string.
 * @query nocs Array or list of NOC codes to return. Searches NOC 2016 V1.3 as of July 7, 2022
 * @returns list of NOC codes
 */
exports.getGroups = (req, res) => {
  const nocs = ensureArray(req.query.nocs)
  const results = unitGroups.reduce((acc, curr) => {
    const result = nocs.includes(curr.noc)
    if (result) return [...acc, curr]
    return [...acc]
  }, [])
  if (results) res.json(results)
  res.status(500).send('Something went wrong')
}
