const noc2016 = require('../data/noc/2016/noc_2016_unit_groups.json')

/**
 * Requires request param of noc.
 */
exports.getUnitGroup = function (req, res) {
  // Ensure expected type and safeguard against bad parameter.
  const noc = String(req.params.noc)
  if (!noc) {
    return res.status(400).json({
      error: "Request parameter 'noc' was not provided or is not valid.",
    })
  }

  // Get the unit group and handle instances where the noc was not found.
  const unitGroup = noc2016.find((unitGroup) => String(unitGroup.noc) === noc)
  if (!unitGroup) {
    return res.status(404).json({
      error: 'No unit group found for NOC ' + noc + '.',
    })
  }

  // Return the unit group.
  return res.json(unitGroup)
}
