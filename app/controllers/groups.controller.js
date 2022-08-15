// DATA
const unitGroups = require('../data/noc/2016/noc_2016_unit_groups.json')

// HELPERS
const { ensureArray } = require('../helpers/array.helpers.js')

/**
 *
 * NOTE:
 * None of the controllers in this file are implemented in routes at this time. August 12, 2022
 *
 */

/**
 * Get one unit group, based on NOC, passed as a param.
 * @param noc The NOC code to search. Searches NOC 2016 V1.3 as of July 7, 2022
 * @returns The unit group, if found, or 500 error with message.
 */
exports.getGroup = (req, res) => {
  const noc = req.params.noc
  const result = unitGroups.find((group) => group.noc === noc)
  if (result) {
    return res.status(200).send({
      data: result,
      message: 'Unit group found',
    })
  }
  res.status(400).send({
    data: {},
    message: `Could not find a unit group with noc ${noc}. Check your request and try again.`,
  })
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
  if (results) {
    return res.status(200).send({
      data: results,
      message: 'Unit groups found',
    })
  }
  res.status(400).send({
    data: {},
    message: `Could not find any unit groups with nocs ${nocs}. Check your request and try again.`,
  })
}
