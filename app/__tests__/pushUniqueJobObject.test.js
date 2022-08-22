const { describe, expect, it } = require('@jest/globals')

const pushUniqueJobObject = require('../helpers/pushUniqueJobObject')

describe('pushUniqueJobObject(item, value) helper function tests', () => {
  it('should return an array', () => {
    const array = []
    pushUniqueJobObject({ noc: 'test', title: 'test' }, array)
    expect(array).toBeInstanceOf(Array)
  })
  it('should return an array with the value if it is not already in the array', () => {
    const array = []
    pushUniqueJobObject({ noc: 'test', title: 'test' }, array)
    expect(array).toEqual([{ noc: 'test', title: 'test' }])
  })

  it('should not return an array with the value if it is already in the array', () => {
    const array = [
      { noc: 'test', title: 'test' },
      { noc: 'test2', title: 'test2' },
    ]
    pushUniqueJobObject({ noc: 'test', title: 'test' }, array)
    expect(array).toEqual([
      { noc: 'test', title: 'test' },
      { noc: 'test2', title: 'test2' },
    ])
  })

  it('should throw an error if no value is provided', () => {
    const array = []
    expect(() => pushUniqueJobObject(null, array)).toThrowError(
      'pushUniqueJobObject() requires an item and an array.'
    )
  })

  it('should throw an error if no array is provided', () => {
    expect(() =>
      pushUniqueJobObject({ noc: 'test', title: 'test' }, null)
    ).toThrowError()
  })

  it('should throw an error if the second argument is not an array', () => {
    expect(() =>
      pushUniqueJobObject({ noc: 'test', title: 'test' }, 'not an array')
    ).toThrowError()
  })

  it('should throw an error if the first argument is not an object', () => {
    expect(() =>
      pushUniqueJobObject('not an object', [{ noc: 'test', title: 'test' }])
    ).toThrowError()
  })

  it('should throw an error if the first argument is an object, but not with the proper format', () => {
    expect(() =>
      pushUniqueJobObject({ number: 'test', name: 'test' }, [
        { noc: 'test', title: 'test' },
      ])
    ).toThrowError()
  })
})
