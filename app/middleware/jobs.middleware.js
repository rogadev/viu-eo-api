const { getViuPrograms } = require('../stores')

/**
 * Checks for 'credential' and 'keywords' query params. If either is missing, returns 400.
 * @query {Array<String>} credential - Credential keywords to search for.
 * @query {Array<String>} keywords - Keywords to search for. Related to field or area.
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
 * @param {String} nid - NID to verify.
 */
exports.requiresProgramNidParam = function (req, res, next) {
  const messages = []

  if (!req.params.nid) {
    messages.push(
      'NID is required and must be a number or string that can be converted to a number.'
    )
  }

  if (messages.length) {
    return res.status(400).send(messages)
  }

  next()
}
