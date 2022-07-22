/**
 * Ignoring anything inside of brackets, function will title case every word in this string.
 * @param {String} str The string to TitleCase
 * @returns {String} The TitleCased string
 */
exports.titleCase = (str) => {
  return str
    .split(' ')
    .map((word) => {
      if (word.charAt(0) === '(') {
        return word
      }
      return word.charAt(0).toUpperCase() + word.slice(1)
    })
    .join(' ')
}
