import duckInstanceTests from './duckInstance'
import defineActionInputTests from './defineAction-input'
import addReducerCaseInputTests from './addReducerCase-input'
import duckMethods from './duckMethods'

describe('reduck', () => {
  // force console.error to throw an error -> warning does not throw errors like invariant
  console.error = jest.fn(error => {
    throw new Error(error)
  })
  describe('the duck instance', () => {
    duckInstanceTests()
  })
  describe('the duck instance methods', () => {
    duckMethods()
  })
  describe('invalid defineAction inputs', () => {
    defineActionInputTests()
  })
  describe('invalid addReducerCase inputs', () => {
    addReducerCaseInputTests()
  })
})
