// NODECACHE
const NodeCache = require('node-cache')

// HELPER FUNCTIONS
const { getPrograms } = require('../helpers/viu_data.helpers.js')

// VIU CACHES
const viuCacheTTL = 60 * 60 * 24 // 1 day
const viuProgramsCache = new NodeCache({ stdTTL: viuCacheTTL })

// OUTLOOK CACHES
// TODO implement these other caches
// const outlookCacheTTL = 60 * 60 * 24 * 30 * 3 // 3 month time to live
// const nationalOutlooksCache = new NodeCache({ stdTTL: outlookCacheTTL })
// const provincialOutlooksCache = new NodeCache({ stdTTL: outlookCacheTTL })

// CACHE FUNCTION

/**
 * Uses caching to get programs from VIU. Fetches new data from VIU if cache expired.
 * @returns {Promise<Array<Object>>} - Returns a promise that resolves to an array of programs.
 */
exports.getViuPrograms = async () => {
  const programs = viuProgramsCache.get('programs')
  if (programs) {
    return programs
  }
  try {
    const { results } = await getPrograms()
    if (results) viuProgramsCache.set('programs', results)
    return results
  } catch (e) {
    console.error(e)
  }
}
