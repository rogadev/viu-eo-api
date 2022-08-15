/**
 * Basic test route.
 */
exports.test = (_, res) => {
  res.status(200).send({
    message: 'Test route successful.',
  })
}
