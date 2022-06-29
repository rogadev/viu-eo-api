/**
 * Used to query the LMI Employment Outlook API for nation-wide outlooks for a given NOC unit group code. LMI-EO uses NOC 2016 v1.3.
 * @param noc The NOC code of the relevant unit group.
 * @returns The national outlook data for the given unit group.
 */
exports.nationalOutlook = function (req, res) {
  const noc = req.params.noc
  // example query: GET https://lmi-outlooks-esdc-edsc-apicast-production.api.canada.ca/clmix-wsx/gcapis/outlooks/ca?noc=1111
  res.send(noc)
}

/**
 * Used to query the LMI Employment Outlook API for provincial outlooks for a given NOC unit group code. LMI-EO uses NOC 2016 v1.3.
 * @param noc  The NOC code of the relevant unit group.
 * @query province The province code of the relevant unit group.
 * @returns The provincial outlook data for the given unit group.
 */
exports.provincialOutlook = function (req, res) {
  const noc = req.query.noc
  const rpt = 1 // 1 = Provincial/Territorial, 2 = Economic Region
  const rgn = req.query.province
  const lang = 'en'
  // example query: GET https://lmi-outlooks-esdc-edsc-apicast-production.api.canada.ca/clmix-wsx/gcapis/outlooks?noc=1111&rtp=1&rid=10
}

/**
 * Used to query the LMI Employment Outlook API for regional outlooks for a given NOC unit group code. LMI-EO uses NOC 2016 v1.3.
 * @param noc  The NOC code of the relevant unit group.
 * @query province The province code of the relevant unit group.
 * @returns The provincial outlook data for the given unit group.
 */
exports.regionalOutlook = function (req, res) {
  const noc = req.query.noc
  const rpt = 2 // 2 = Economic Region, 1 = Provincial/Territorial
  const rgn = req.query.region
  const lang = 'en'
  // example query: GET https://lmi-outlooks-esdc-edsc-apicast-production.api.canada.ca/clmix-wsx/gcapis/outlooks?noc=1111&rtp=1&rid=10
}
