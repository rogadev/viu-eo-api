// ROUTER
const router = require('express').Router()

// CONTROLLERS
const scrape = require('../../../../controllers/scrape.controller.js')

// PUT /api/v1/scrape/2016 - Triggers web scrape for 2016 v1.3 NOC data. Replaces existing files.
router.put('/2016', scrape.noc2016)

// PUT /api/v1/scrape/2021 - Triggers web scrape for 2021 v1.0 NOC data. Replaces existing files.
router.put('/2021', scrape.noc2021) // TODO - add 2021 scrape controller logic

// PUT /api/v1/scrape/2022 - Triggers reading noc unit group data and listing all valid NOC codes. Replaces existing files.
router.put('/unit-groups', (req, res) => {
  const fs = require('fs')
  const path = require('path')
  const raw = require('../../../../data/noc/2016/noc_2016_unit_groups.json')
  const unitGroups = raw.reduce((codes, unitGroup) => {
    return [...codes, unitGroup.noc]
  }, [])
  fs.writeFileSync(
    path.join(__dirname, '../../../../data/noc/2016/noc_2016_noc_codes.json'),
    JSON.stringify(unitGroups, null, 2)
  )
})

// EXPORT
module.exports = router
