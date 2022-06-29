const allPrograms = require('../data/viu/program_areas.json')
const searchablePrograms = require('../data/viu/searchable_programs.json')
const programAreas = require('../data/viu/program_areas.json')

const n = (n) => Number.parseInt(n)

/**
 * Find program based on its NID
 */
exports.findOne = function (req, res) {
  const nid = n(req.params.nid)
  const program = searchablePrograms.find((program) => program.nid === nid)
  if (program) {
    res.json(program)
  } else {
    res
      .status(404)
      .send(
        'That program exists, but is not searchable by the VIU career outlooks API.'
      )
  }
}

/**
 * Find area based on its NID
 */
exports.findArea = function (req, res) {
  const nid = req.params.nid
  const area = programAreas.find((area) => n(area.nid) === n(nid))
  if (area) {
    res.json(area)
  } else {
    res.status(404).send('Not found')
  }
}

/**
 * Returns list of all searchable programs
 */
exports.findSearchable = function (req, res) {
  res.json(searchablePrograms)
}

/**
 * Return list of all programs offered at VIU, searchable or otherwise.
 */
exports.findAll = function (req, res) {
  res.json(allPrograms)
}

/**
 * Return area based on program NID
 */
exports.findAreaByProgram = function (req, res) {
  const programNid = req.params.nid
  const area = programAreas.find((area) => n(area.nid) === n(programNid))
  if (area) {
    res.json(area)
  } else {
    res.status(404).send('Not found')
  }
}
