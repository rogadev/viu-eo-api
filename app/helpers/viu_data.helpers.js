/**
 * Fetches the list of programs from VIU using a reverse proxy.
 * @returns Object with 'results' or 'error' properties.
 */
const getPrograms = async () => {
  try {
    const response = await fetch('https://www.viu.ca/program-export-emp-json')
    const results = await response.json()
    return { results }
  } catch (error) {
    return { error }
  }
}

/**
 * Find a given program by it's NID.
 * @param {Number} programNID - The NID of the program to find.
 * @returns {Object} - The program object. Contains 'program' or 'error' properties.
 */
const getProgram = async (programNID) => {
  // Type protection for the NID parameter.
  const nid = Number.parseInt(programNID)
  console.log(nid)

  // Fetch the list of programs from VIU
  const response = await getPrograms()
  const results = response?.results
  const error = response?.error

  // Form the response
  if (results) {
    const program = results.find(
      (result) => Number.parseInt(result.nid) === nid
    )
    return { result: program }
  }
  if (error) {
    return { error }
  }

  // If we get here, something has gone horribly wrong.
  return new Error(
    'Something went very wrong. Contact developer. (Error: viu_data.helpers.js)'
  )
}

module.exports = { getPrograms, getProgram }
