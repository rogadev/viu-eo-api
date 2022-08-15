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

/**
 * Used to query the LMI Employment Outlook API for nation-wide outlooks for a given NOC unit group code. LMI-EO uses NOC 2016 v1.3.
 * Caches data for up to 1 month. Uses cache for faster response times and reduced API calls.
 * Middleware should catch most bad requests before they hit the API.
 * @param noc The NOC code of the relevant unit group.
 * @returns The national outlook data for the given unit group.
 */
exports.nationalOutlook = async function (req, res) {
  const noc = req.params.noc

  if (!noc || typeof noc !== 'string') {
    return res.status(400).send({
      data: {},
      message: `Request parameter 'noc' was not provided or is not valid - ${noc}`,
    })
  }

  try {
    let outlook = nationalOutlooksCache.get(noc)
    if (!outlook) {
      const apiResponse = await fetchNationalOutlook(noc)
      outlook = await apiResponse.json()
      nationalOutlooksCache.set(noc, outlook)
    }
    return res.status(200).send({
      data: outlook,
      message: 'National outlook found.',
    })
  } catch (e) {
    console.error(e)
    res.status(e.status ?? 500).send({ error: e })
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
      if (!outlook)
        throw new Error(
          'No provincial outlook found after fetching form Government of Canada LMI-EO API.'
        )
      provincialOutlooksCache.set(`${noc}-${prov}`, outlook)
    }
    res.status(200).send(outlook)
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
  console.log(`Getting BC Provincial outlook for ${noc}`)
  const prov = 59
  try {
    let outlook = provincialOutlooksCache.get(`${noc}-${prov}`)
    if (!outlook) {
      const apiResponse = await fetchProvincialOutlook(noc, prov)
      outlook = await apiResponse.json()
      if (!outlook)
        throw new Error(
          'No provincial outlook found after fetching form Government of Canada LMI-EO API.'
        )
      provincialOutlooksCache.set(`${noc}-${prov}`, outlook)
    }
    res.status(200).send({ data: refactorOutlookWithLogicalPotential(outlook) })
  } catch (e) {
    console.error(e)
    res.status(e.status ?? 500).send(e)
  }
}
