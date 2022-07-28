// CACHE
const NodeCache = require('node-cache')
const ttl = 60 * 60 * 24 * 30 * 2 // 2 month time to live
const outlooksCache = new NodeCache({ stdTTL: ttl })

// FETCH HEADER - API KEY
const headers = new Headers()
headers.append('USER_KEY', process.env.USER_KEY)

/**
 *
 * @param {Number} noc - The NOC code to search for.
 * @returns outlook data related to the NOC code.
 */
const getOutlook = async (noc) => {
  try {
    let outlook = outlooksCache.get(noc)
    if (!outlook) {
      console.log(`Not cached - fetching outlook for ${noc}`)
      const response = await fetch(
        `https://lmi-outlooks-esdc-edsc-apicast-production.api.canada.ca/clmix-wsx/gcapis/outlooks?noc=1111&rtp=1&rid=59&lang=en`,
        {
          headers: headers,
        }
      )
      outlook = await response.json()
      outlooksCache.set(noc, outlook)
    } else {
      console.log(`Using cached outlook for ${noc}`)
    }
    outlook = refactorOutlookWithLogicalPotential(outlook)
    return outlook
  } catch (error) {
    return new Error(error)
  }
}

/**
 * The LMI-EO API uses a silly outlook potential rating schema where 0 is undetermined, 1 is good, 2 is limited, and 3 is fair. This function converts the outlook potential value to a more logical format. 3 is good, 2 is fair, 1 is limited, 0 is undetermined. Additionally adds a verbose description of the outlook potential.
 * @param {Number} outlook - The outlook data to fix.
 * @returns The fixed outlook data with corrected potential value.
 */
function refactorOutlookWithLogicalPotential(outlook) {
  const potential = outlook.potential
  let newPotential
  switch (Number(potential)) {
    case 1:
      newPotential = 3
      break
    case 2:
      newPotential = 1
      break
    case 3:
      newPotential = 2
      break
    default:
      newPotential = 0
  }
  return {
    ...outlook,
    potential: newPotential,
    outlook_verbose: verbifyOutlookValue(newPotential),
  }
}

/**
 * Uses the LMI Employment Outlook API to query for the national outlook for a given NOC unit group code. LMI-EO uses NOC 2016 v1.3.
 * @param {String} noc The NOC code of the relevant unit group.
 * @returns Array of outlook objects containing provincial code and "potential" metric. Potential describes outlook as a number from 0-3, 3 being best.
 */
const fetchNationalOutlook = async (noc) => {
  // example query: GET https://lmi-outlooks-esdc-edsc-apicast-production.api.canada.ca/clmix-wsx/gcapis/outlooks/ca?noc=1111
  return await fetch(
    `https://lmi-outlooks-esdc-edsc-apicast-production.api.canada.ca/clmix-wsx/gcapis/outlooks/ca?noc=${noc}`,
    { headers: headers }
  )
}

/**
 * Uses the LMI Employment Outlook API to query for the provincial outlook for a given NOC unit group code. LMI-EO uses NOC 2016 v1.3.
 * @param {String} noc The NOC code of the relevant unit group.
 * @param {String} provinceId The province code relevant to this search.
 * @returns Object containing key value pairs of data related to the outlook of the given unit group in the given province.
 */
const fetchProvincialOutlook = async (noc, provinceId) => {
  // example query: GET https://lmi-outlooks-esdc-edsc-apicast-production.api.canada.ca/clmix-wsx/gcapis/outlooks?noc=1111&rtp=1&rid=10
  return await fetch(
    `https://lmi-outlooks-esdc-edsc-apicast-production.api.canada.ca/clmix-wsx/gcapis/outlooks?noc=${noc}&rtp=1&rid=${provinceId}&lang=en`,
    { headers: headers }
  )
}

/**
 * Verifies an outlook potential value form 0 to 3.
 * @param {Number} potential - The outlook potential, represented as a value from 0 to 3.
 * @returns The verbose description of the outlook potential.
 */
const verbifyOutlookValue = (potential) => {
  switch (Number(potential)) {
    case 1:
      return 'Limited'
    case 2:
      return 'Fair'
    case 3:
      return 'Good'
    default:
      return 'Undetermined'
  }
}

module.exports = {
  getOutlook,
  fetchNationalOutlook,
  fetchProvincialOutlook,
  verbifyOutlookValue,
  refactorOutlookWithLogicalPotential,
}
