/**
 * Push an item to an array, only if the item is unique to that array.
 * @param {any[]} array The array to push the item to.
 * @param {String | Boolean | Number} item Must be a primitive type.
 */
module.exports = (item, array) => {
  // Validate that both properties are defined.
  if (!item || !array) {
    throw new Error('pushIfUnique() requires an item and an array.')
  }

  // First, ensure that our array is, in fact, an array.
  if (!Array.isArray(array)) {
    throw new Error(
      `pushIfUnique() expects an array as the second argument. Received: "${array}", of type: ${typeof array}`
    )
  }

  // If the array does not contain this item, push this item to the array.
  if (!array.includes(item)) {
    array.push(item)
  }
  return array
}
