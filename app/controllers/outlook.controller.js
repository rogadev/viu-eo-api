const headers = new Headers()
headers.append('USER_KEY', process.env.USER_KEY)

/**
 * Uses the LMI Employment Outlook API to query for the national outlook for a given NOC unit group code. LMI-EO uses NOC 2016 v1.3.
 * @param {String} noc The NOC code of the relevant unit group.
 * @returns Array of outlook objects containing provincial code and "ootential" metric. Potential describes outlook as a number from 0-3, 3 being best.
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
 * Uses the LMI Employment Outlook API to query for the regional outlook for a given NOC unit group code. LMI-EO uses NOC 2016 v1.3.
 * @param {String} noc The NOC code of the relevant unit group.
 * @param {String} regionId The region code relevant to this search.
 * @returns Object containing key value pairs of data related to the outlook of the given unit group in the given region.
 */
const fetchRegionalOutlook = async (noc, regionId) => {
  // example query: GET https://lmi-outlooks-esdc-edsc-apicast-production.api.canada.ca/clmix-wsx/gcapis/outlooks?noc=1111&rtp=1&rid=10
  return await fetch(
    `https://lmi-outlooks-esdc-edsc-apicast-production.api.canada.ca/clmix-wsx/gcapis/outlooks?noc=${noc}&rtp=2&rid=${regionId}&lang=en`,
    { headers: headers }
  )
}

/**
 * Used to query the LMI Employment Outlook API for nation-wide outlooks for a given NOC unit group code. LMI-EO uses NOC 2016 v1.3.
 * Middleware should catch most bad requests before they hit the API.
 * @param noc The NOC code of the relevant unit group.
 * @returns The national outlook data for the given unit group.
 */
exports.nationalOutlook = async function (req, res) {
  const noc = req.params.noc
  try {
    const apiResponse = await fetchNationalOutlook(noc)
    const result = await apiResponse.json()
    res.send(result)
  } catch (e) {
    console.error(e)
    res.status(e.status ? e.status : 500).send(e)
  }
}

/**
 * Used to query the LMI Employment Outlook API for provincial outlooks for a given NOC unit group code. LMI-EO uses NOC 2016 v1.3.
 * Middleware should catch most bad requests before they hit the API.
 * @param noc  The NOC code of the relevant unit group.
 * @query province The province code of the relevant unit group.
 * @returns The provincial outlook data for the given unit group.
 */
exports.provincialOutlook = async function (req, res) {
  const noc = req.params.noc
  const prov = req.query.province
  try {
    const apiResponse = await fetchProvincialOutlook(noc, prov)
    const result = await apiResponse.json()
    res.send(result)
  } catch (e) {
    console.error(e)
    res.status(e.status ? e.status : 500).send(e)
  }
}

/**
 * Used to query the LMI Employment Outlook API for regional outlooks for a given NOC unit group code. LMI-EO uses NOC 2016 v1.3.
 * Middleware should catch most bad requests before they hit the API.
 * @param noc  The NOC code of the relevant unit group.
 * @query province The province code of the relevant unit group.
 * @returns The provincial outlook data for the given unit group.
 */
exports.regionalOutlook = async function (req, res) {
  const noc = req.params.noc
  const rgn = req.query.region
  try {
    const apiResponse = await fetchRegionalOutlook(noc, rgn)
    const result = await apiResponse.json()
    res.send(result)
  } catch (e) {
    console.error(e)
    res.status(e.status ? e.status : 500).send(e)
  }
}
