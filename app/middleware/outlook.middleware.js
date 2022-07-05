exports.requiresNocParam = function (req, res, next) {
  // noc should be a string that contains 4 characters, each character being a number
  if (!req.params.noc) {
    return res.status(400).send('Missing noc parameter')
  }
  const noc = req.params.noc
  if (noc.length !== 4) {
    return res.status(400).send('Invalid noc parameter (length)')
  }
  if (new RegExp(/^[0-9]*$/gm).test(noc) === false) {
    return res.status(400).send('Invalid noc parameter (format)')
  }
  const validCodes = require('../data/noc/2016/noc_2016_noc_codes.json')
  if (!validCodes.includes(noc)) {
    return res.status(400).send('Invalid noc parameter (value)')
  }
  next()
}

exports.requiresProvinceQuery = function (req, res, next) {
  if (!req.query.province) {
    res.status(400).send('Missing required parameters (province)')
  }
  next()
}
