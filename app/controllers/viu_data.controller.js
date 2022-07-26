/**
 * Fetch VIU's list of programs. We should be able to proxy this data from Express.
 */
exports.getPrograms = async (req, res) => {
  try {
    const result = await fetch('https://www.viu.ca/program-export-emp-json')
    const programs = await result.json()
    res.json(programs)
  } catch (errors) {
    res.status(500).json(errors)
  }
}
