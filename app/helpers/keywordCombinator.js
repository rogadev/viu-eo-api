const ensureArray = require('./ensureArray')

/**
 *
 * @param {[]} arr1
 * @param {[]} arr2
 */
module.exports = (arr1, arr2) => {
  // console.log(`Expanding keyword arrays: ${arr1} and ${arr2}`)
  if (!arr1 || !arr2)
    throw new Error('Expected properties for this function were not provided.')

  const combinations = []
  for (const item of ensureArray(arr1)) {
    for (const item2 of ensureArray(arr2)) {
      combinations.push([item, item2])
    }
  }
  const expandedResults = combinations.map((combo) =>
    combo.map((item) => item.toLowerCase())
  )
  // console.log(`Expanded keyword combinations: ${expandedResults}`)
  return expandedResults
}
