// DATA
const allPrograms = require('../data/viu/program_areas.json')
const searchablePrograms = require('../data/viu/searchable_programs.json')
const programAreas = require('../data/viu/program_areas.json')

// LOCAL FUNCTIONS
/**
 * Turn the string you pass in into a number, provided it contains a valid int.
 * @param {String} n - The item to numberify
 * @returns {Number} - The numberified number
 */
const numberify = (n) => Number.parseInt(n)

// CONTROLLER FUNCTIONS
/**
 * Find program based on its NID. Searches only through searchable programs - these are programs which correspond to a host of job opportunities upon graduation, which are therefore searchable via LMI-EO API.
 */
exports.findOne = function (req, res) {
  const nid = numberify(req.params.nid)
  const program = searchablePrograms.find((program) => program.nid === nid)
  if (!program) {
    return res.status(204).send()
  }
  return res.status(200).send({
    data: program,
    message: 'Program found',
  })
}

/**
 * Find area based on its NID
 */
exports.findArea = function (req, res) {
  /** @type {number} */
  const nid = Number.parseInt(req.params.nid)

  if (!nid || typeof nid !== 'number') {
    return res.status(400).send({
      error: `Request parameter 'nid' was not provided or is not valid. Parameter provided: ${nid}`,
    })
  }

  const area = programAreas.find(
    (area) => numberify(area.nid) === numberify(nid)
  )

  if (!area) {
    return res.status(204).send()
  }

  res.status(200).send({
    data: area,
    message: 'Area found',
  })
}

/**
 * Returns list of all searchable programs
 */
exports.findSearchable = function (req, res) {
  res
    .status(200)
    .send({ data: searchablePrograms, message: 'Searchable programs found' })
}

/**
 * Return list of all programs offered at VIU, searchable or otherwise.
 */
exports.findAll = async function (req, res) {
  try {
    const result = await fetch('https://www.viu.ca/program-export-emp-json')
    const programs = await result.json()
    if (!programs) {
      return res.status(204).send({
        message: 'No programs found',
        data: {},
      })
    }
    res.status(200).send({
      data: programs,
      message: 'Programs found',
    })
  } catch (errors) {
    res.status(500).send({ error: errors })
  }
}

/**
 * Return area based on program NID
 */
exports.findAreaByProgram = async function (req, res) {
  console.log('findAreaByProgram', req.params.nid)
  const programNid = Number.parseInt(req.params.nid)

  if (!programNid || typeof programNid !== 'number') {
    return res.status(400).send({
      error: {
        message: `Request parameter 'nid' was not provided or is not valid. Parameter provided: ${programNid}`,
      },
    })
  }

  try {
    const result = await fetch('https://www.viu.ca/program-export-emp-json')
    const programs = await result.json()

    const program = programs.find((program) => program.nid == programNid)
    const areaNid = program.program_area
    const area = programAreas.find(({ nid }) => nid == areaNid)

    if (!area) {
      return res.status(204).send({
        message: 'No area found',
        data: {},
      })
    }

    res.status(200).send({
      data: area,
      message: 'Area found',
    })
  } catch (errors) {
    res.status(500).send({ error: errors })
  }
}
