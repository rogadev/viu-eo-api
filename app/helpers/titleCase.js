/**
 * Ensures that a given string is in title case. This function ignores anything inside of round brackets.
 * @param {string} string to be title cased
 * @returns title cased string
 */
module.exports = (string) => {
  {
    return string
      .split(' ')
      .map((word) => {
        if (word.charAt(0) === '(') {
          return word
        }
        return word.charAt(0).toUpperCase() + word.slice(1)
      })
      .join(' ')
  }
}
