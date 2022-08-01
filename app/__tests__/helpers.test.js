const { describe, expect, it } = require('jest')

const requestWithSupertest = require('../config/tests.config.js')
const arrayHelpers = require('../helpers/array.helpers.js')

describe('Array Helpers', () => {
  describe('pushIfUnique()', () => {
    it('Pushes if unique', () => {
      const arr = [1, 2, 3]
      arrayHelpers.pushIfUnique(arr, 4)
      expect(arr).toEqual([1, 2, 3, 4])
    })
    it('Does not push if duplicate', () => {
      const arr = [1, 2, 3]
      arrayHelpers.pushIfUnique(arr, 3)
      expect(arr).toEqual([1, 2, 3])
    })
  })
})
