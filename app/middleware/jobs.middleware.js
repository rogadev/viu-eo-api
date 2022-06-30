/**
 * Checks for 'credential' and 'keywords' query params. If either is missing, returns 400.
 */
exports.requiresCredentialQuery = function (req, res, next) {
  const credential = req.query.credential
  const keywords = req.query.keywords
  if (!credential || !keywords) {
    return res.status(400).send('Missing credential or keywords parameter')
  }
  next()
}

/**
 * Checks for NID in params. If missing, returns 400.
 */
exports.requiresProgramNidParam = function (req, res, next) {
  if (!req.params.nid) {
    return res.status(400).send('Missing nid parameter')
  }
  if (!Number.isInteger(Number.parseInt(req.params.nid))) {
    return res.status(400).send('Invalid nid parameter (format)')
  }
  const programs = require('../data/viu/all_programs.json')
  const validNids = programs.map((program) => program.nid)
  if (!validNids.includes(req.params.nid)) {
    return res.status(400).send('Invalid nid parameter (value)')
  } else {
    const searchablePrograms = require('../data/viu/searchable_programs.json')
    const searchableNids = searchablePrograms.map((program) =>
      program.nid.toString()
    )
    if (!searchableNids.includes(req.params.nid)) {
      return res
        .status(400)
        .send(
          'This program exists but renders no results when searching for related NOC unit groups.'
        )
    }
  }
  next()
}
