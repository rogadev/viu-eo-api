const unitGroups = require('../data/noc/2016/noc_2016_unit_groups.json')

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
