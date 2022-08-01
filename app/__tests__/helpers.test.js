const { describe, expect, test } = require('jest')
// const requestWithSupertest = require('../config/tests.config.js')
const arrayHelpers = require('../helpers/array.helpers.js')

describe('Array Helpers', () => {
  describe('pushIfUnique()', () => {
    test('Pushes if unique', () => {
      const arr = [1, 2, 3]
      arrayHelpers.pushIfUnique(arr, 4)
      expect(arr).toEqual([1, 2, 3, 4])
    }, 30000)
    test('Does not push if duplicate', () => {
      const arr = [1, 2, 3]
      arrayHelpers.pushIfUnique(arr, 3)
      expect(arr).toEqual([1, 2, 3])
    }, 30000)
  })
})
