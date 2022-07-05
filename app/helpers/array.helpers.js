/**
 * Checks to see if the given item is already in the array. If not, we'll push the item into the array - effectively preventing duplicates.
 * @param {Array} arr - The array where we will try to put our item.
 * @param {*} item - The item we want to put in the array.
 */
exports.pushIfUnique = (arr, item) => {
  if (!arr.includes(item)) {
    arr.push(item)
  }
}

/**
 * Ensures that the given input is an array. If not, input is converted into an array.
 * @param {*} input - A thing you'd like to ensure is an array.
 * @returns Returns an array of the thing you passed in.
 */
exports.ensureArray = (input) => {
  if (Array.isArray(input)) {
    return input
  } else {
    let arr = input.split(',')
    return arr.map((item) => item.trim())
  }
}
