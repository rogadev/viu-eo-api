// CACHES
const NodeCache = require('node-cache')
const ttl = 60 * 60 * 24 * 30 * 3 // 3 month time to live
const nationalOutlooksCache = new NodeCache({ stdTTL: ttl })
const provincialOutlooksCache = new NodeCache({ stdTTL: ttl })

// FETCH HEADER - API KEY
const headers = new Headers()
headers.append('USER_KEY', process.env.USER_KEY)

// LOCAL FUNCTIONS

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

// CONTROLLER FUNCTIONS
// TODO - extract controller functions into helper functions.

/**
 * Used to query the LMI Employment Outlook API for nation-wide outlooks for a given NOC unit group code. LMI-EO uses NOC 2016 v1.3.
 * Caches data for up to 1 month. Uses cache for faster response times and reduced API calls.
 * Middleware should catch most bad requests before they hit the API.
 * @param noc The NOC code of the relevant unit group.
 * @returns The national outlook data for the given unit group.
 */
exports.nationalOutlook = async function (req, res) {
  const noc = req.params.noc
  try {
    let outlook = nationalOutlooksCache.get(noc)
    if (!outlook) {
      const apiResponse = await fetchNationalOutlook(noc)
      outlook = await apiResponse.json()
      nationalOutlooksCache.set(noc, outlook)
      // console.log(`Cached national outlook for ${noc}`)
    } else {
      // console.log(`Using cached national outlook for ${noc}`)
    }
    res.send(outlook)
  } catch (e) {
    console.error(e)
    res.status(e.status ?? 500).send(e)
  }
}

/**
 * Used to query the LMI Employment Outlook API for provincial outlooks for a given NOC unit group code. LMI-EO uses NOC 2016 v1.3.
 * Caches data for up to 1 month. Uses cache for faster response times and reduced API calls.
 * Middleware should catch most bad requests before they hit the API.
 * @param noc  The NOC code of the relevant unit group.
 * @query province The province code of the relevant unit group.
 * @returns The provincial outlook data for the given unit group.
 */
exports.provincialOutlook = async function (req, res) {
  const noc = req.params.noc
  const prov = req.query.province
  try {
    let outlook = provincialOutlooksCache.get(`${noc}-${prov}`)
    if (!outlook) {
      const apiResponse = await fetchProvincialOutlook(noc, prov)
      outlook = await apiResponse.json()
      provincialOutlooksCache.set(`${noc}-${prov}`, outlook)
      // console.log(`Cached provincial outlook for ${noc}-${prov}`)
    } else {
      // console.log(`Using cached provincial outlook for ${noc}-${prov}`)
    }
    res.send(outlook)
  } catch (e) {
    console.error(e)
    res.status(e.status ?? 500).send(e)
  }
}
