const { describe, expect, it } = require('@jest/globals')

const pushIfUnique = require('../helpers/pushIfUnique')

describe('pushIfUnique(item, value) helper function tests', () => {
  it('should return an array', () => {
    const array = []
    pushIfUnique('test', array)
    expect(array).toBeInstanceOf(Array)
  })
  it('should return an array with the value if it is not already in the array', () => {
    const array = []
    pushIfUnique('test', array)
    expect(array).toEqual(['test'])
  })
  it('should not return an array with the value if it is already in the array', () => {
    const array = ['test', 'test2']
    pushIfUnique('test', array)
    expect(array).toEqual(['test', 'test2'])
  })
  it('should throw an error if no value is provided', () => {
    const array = []
    expect(() => pushIfUnique(null, array)).toThrowError(
      'pushIfUnique() requires an item and an array.'
    )
  })
  it('should throw an error if no array is provided', () => {
    expect(() => pushIfUnique('test', null)).toThrowError(
      'pushIfUnique() requires an item and an array.'
    )
  })
  it('should throw an error if the second argument is not an array', () => {
    expect(() => pushIfUnique('test', 'not an array')).toThrowError(
      `pushIfUnique() expects an array as the second argument. Received: "not an array", of type: string`
    )
  })
  it('should add the value to the array if it is not already in the array', () => {
    const array = ['test', 'test2']
    pushIfUnique('test3', array)
    expect(array).toEqual(['test', 'test2', 'test3'])
  })
  it('should add unique objects to the array if it is not already in the array', () => {
    const array = [{ test: 'test' }, { test: 'test2' }]
    pushIfUnique({ test: 'test3' }, array)
    expect(array).toEqual([
      { test: 'test' },
      { test: 'test2' },
      { test: 'test3' },
    ])
  })
  // it should throw an error if the second argument is not an array
  it('should throw an error if the second argument is not an array', () => {
    expect(() => pushIfUnique('test', 'not an array')).toThrowError(
      `pushIfUnique() expects an array as the second argument. Received: "not an array", of type: string`
    )
  })
})
