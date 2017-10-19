import duckInstanceTests from './duckInstance-tests'
import defineActionTests from './defineAction-tests'
import addReducerCaseTests from './addReducerCase-tests'

describe('reduck', () => {
  // force console.error to throw an error -> warning does not throw errors like invariant
  console.error = jest.fn(error => {
    throw new Error(error)
  })
  describe('the duck instance', () => {
    duckInstanceTests()
  })
  describe('the defineAction method', () => {
    defineActionTests()
  })
  describe('the addReducerCase method', () => {
    addReducerCaseTests()
  })
  describe('the duck reducer', () => {
    /* TODO test that the reducer is being created correctly */
  })
})
