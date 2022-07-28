// CACHES
const NodeCache = require('node-cache')
const ttl = 60 * 60 * 24 * 30 * 3 // 3 month time to live
const nationalOutlooksCache = new NodeCache({ stdTTL: ttl })
const provincialOutlooksCache = new NodeCache({ stdTTL: ttl })

// FETCH HEADER - API KEY
const headers = new Headers()
headers.append('USER_KEY', process.env.USER_KEY)

// HELPER FUNCTIONS
const {
  fetchNationalOutlook,
  fetchProvincialOutlook,
  refactorOutlookWithLogicalPotential,
} = require('../helpers/outlook.helpers.js')

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
    }
    res.send(outlook)
  } catch (e) {
    console.error(e)
    res.status(e.status ?? 500).send(e)
  }
}

/**
 * Get the BC Provincial outlook.
 */
exports.bcProvincialOutlook = async function (req, res) {
  const noc = req.params.noc
  const prov = 59
  try {
    let outlook = provincialOutlooksCache.get(`${noc}-${prov}`)
    if (!outlook) {
      const apiResponse = await fetchProvincialOutlook(noc, prov)
      outlook = await apiResponse.json()
      provincialOutlooksCache.set(`${noc}-${prov}`, outlook)
    }
    console.log(outlook.potential)
    res.send(refactorOutlookWithLogicalPotential(outlook))
  } catch (e) {
    console.error(e)
    res.status(e.status ?? 500).send(e)
  }
}
