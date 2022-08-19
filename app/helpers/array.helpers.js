/**
 * Only pushes an item to the array if it is not already in the array.
 * @param {Array} arr - The array where we will try to put our item.
 * @param {*} item - The item we want to put in the array.
 */
const pushIfUnique = (arr, item) => {
  // First, ensure that our array is, in fact, an array.
  if (!Array.isArray(arr)) {
    throw new Error(
      `pushIfUnique() expects an array as the first argument. Received: ${arr}`
    )
  }

  // If the array does not contain this item, push this item to the array.
  if (!arr.includes(item)) {
    arr.push(item)
  }
}

/**
 * Ensures that the given input is an array. If not, input is converted into an array.
 * @param {Array | string} input - Accepts either an array or a string. If a string, it is converted into an array. If the string contains `,` it is split by commas and separated into an array.
 * @returns {string[]} an array.
 */
const ensureArray = (input) => {
  if (Array.isArray(input)) {
    return input
  } else {
    let arr = input.split(',')
    return arr.map((item) => item.trim())
  }
}

const keywordCombinator = (arr1, arr2) => {
  const combined = []
  arr1.forEach((item1) => {
    arr2.forEach((item2) => {
      pushIfUnique([item1.toLowerCase(), item2.toLowerCase()], combined)
    })
  })
  return combined
}

module.exports = {
  pushIfUnique,
  ensureArray,
  keywordCombinator,
}
