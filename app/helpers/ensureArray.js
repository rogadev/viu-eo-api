/**
 * Ensures that the given input is an array. If not, input is converted into an array.
 * @param {Array | string} input - Accepts either an array or a string. If a string, it is converted into an array. If the string contains `,` it is split by commas and separated into an array.
 * @returns {string[]} an array.
 */
module.exports = (input) => {
  if (Array.isArray(input)) {
    return input
  } else {
    if (typeof input === 'string' && input.includes(',')) {
      return input.split(',')
    } else {
      return [input]
    }
  }
}
