const unitGroups = require('../data/noc/2016/noc_2016_unit_groups.json')

exports.jobsByCredential = function (req, res) {}

exports.jobsByProgram = function (req, res) {
  res.send(req.params.nid)
}