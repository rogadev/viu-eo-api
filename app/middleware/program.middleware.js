/**
 * Checks that nid exists in params. Validates that nid is a number. Works for both program and area nid's.
 */
exports.requiresNidParam = function (req, res, next) {
  console.log(
    'Requires NID Parameter Middleware Run',
    `nid = ${req.params.nid}`
  )
  const messages = []
  if (!req.params.nid) {
    messages.push('Missing nid parameter')
  }
  if (!Number.isInteger(Number.parseInt(req.params.nid))) {
    messages.push('Invalid nid parameter (format)')
  }
  if (!messages.length) return next()

  res.status(400).send({
    error: {
      message: messages.join('\n'),
    },
  })
}

/**
 * Checks to see if program nid exists in list of valid program nids.
 */
exports.validateProgramNidParam = function (req, res, next) {
  const nids = require('../data/viu/all_program_nids.json')
  if (!nids.includes(req.params.nid)) {
    return res.status(400).send('Invalid nid parameter (value)')
  }
  next()
}

/**
 * Checks to see if area nid exists in list of valid area nids.
 */
exports.validateAreaNidParam = function (req, res, next) {
  const nids = require('../data/viu/all_area_nids.json')
  if (!nids.includes(req.params.nid)) {
    return res.status(400).send('Invalid nid parameter (value)')
  }
  next()
}
