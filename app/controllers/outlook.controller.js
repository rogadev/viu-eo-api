exports.nationalOutlook = function (req, res) {
  const noc = req.params.noc
  // example query: GET https://lmi-outlooks-esdc-edsc-apicast-production.api.canada.ca/clmix-wsx/gcapis/outlooks/ca?noc=1111
}

exports.provincialOutlook = function (req, res) {
  const noc = req.query.noc
  const rpt = 1 // 1 = Provincial/Territorial, 2 = Economic Region
  const rgn = req.query.region
  const lang = 'en'
  // example query: GET https://lmi-outlooks-esdc-edsc-apicast-production.api.canada.ca/clmix-wsx/gcapis/outlooks?noc=1111&rtp=1&rid=10
}

exports.regionalOutlook = function (req, res) {
  const noc = req.query.noc
  const rpt = 2 // 1 = Provincial/Territorial, 2 = Economic Region
  const rgn = req.query.region
  const lang = 'en'
  // example query: GET https://lmi-outlooks-esdc-edsc-apicast-production.api.canada.ca/clmix-wsx/gcapis/outlooks?noc=1111&rtp=1&rid=10
}
