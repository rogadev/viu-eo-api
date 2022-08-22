const { describe, expect, it } = require('@jest/globals')

const titleCase = require('../helpers/titleCase')

describe('titleCase(string) helper function tests', () => {
  it('returns a title cased string', () => {
    expect(titleCase('hello world')).toBe('Hello World')
    expect(titleCase('steve jobs')).toBe('Steve Jobs')
    expect(titleCase('purple monkey Dish washer')).toBe(
      'Purple Monkey Dish Washer'
    )
    expect(
      titleCase(
        'no matter HoW LonG the string is, iT should BE returning a Regular TITLE CASED string.'
      )
    ).toBe(
      'No Matter HoW LonG The String Is, IT Should BE Returning A Regular TITLE CASED String.'
    )
  })
  it('ignores anything inside round brackets', () => {
    expect(titleCase('steve jobs (ceo)')).toBe('Steve Jobs (ceo)')
    expect(titleCase('steve jobs (ceo) of apple')).toBe(
      'Steve Jobs (ceo) Of Apple'
    )
  })
})
