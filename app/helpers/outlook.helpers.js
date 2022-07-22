// CACHE
const NodeCache = require('node-cache')
const ttl = 60 * 60 * 24 * 30 * 3 // 3 month time to live
const outlooksCache = new NodeCache({ stdTTL: ttl })

// FETCH HEADER - API KEY
const headers = new Headers()
headers.append('USER_KEY', process.env.USER_KEY)

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
    return outlook
  } catch (error) {
    console.error(error)
  }
}

module.exports = { getOutlook }
