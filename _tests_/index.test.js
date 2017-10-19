import duck from '../src'
// action types
const LOGOUT = 'auth.LOGOUT'
const INVALID = 'INVALID'
const WHOAMI = 'auth.WHOAMI'
const LOGIN = 'auth.LOGIN'

// initial state to use in the duck instance
const initialState = {
  user: {},
  authStatus: 'Unknown'
}

const duckInstance = new duck('auth', initialState)

describe('reduck', () => {
  // force console.error to throw an error -> warning does not throw errors like invariant
  console.error = jest.fn(error => {
    throw new Error(error)
  })
  describe('the duck instance', () => {
    test('should warn for duckname that is not of type string', () => {
      expect(() => {
        new duck({
          duckname: 'auth'
        }, initialState)
      }).toThrow('Warning: First argument of Duck should be a string (name of the Duck)')
    })
    test('should have a defineAction method', () => {
      expect(typeof duckInstance.defineAction).toEqual('function')
    })
    test('should have a addReducerCase method', () => {
      expect(typeof duckInstance.addReducerCase).toEqual('function')
    })
    test('should have a reducer method', () => {
      expect(typeof duckInstance.reducer).toEqual('function')
    })
  })
  describe('the defineAction method', () => {
    /* TODO test trackReducers functionality */
    test('should throw for invalid action name type', () => {
      expect(() => {
          duckInstance.defineAction(["LOGOUT"], {
            creator() {
              return {}
            },
            reducer(state) {
              return initialState
            }
          })
        })
        .toThrow(`Action Type: Expected a string. Got ${["LOGOUT"]} instead`)
    })
    test('should warn for action not prefixed by the duck name', () => {
      expect(() => {
          duckInstance.defineAction(INVALID, {
            creator() {
              return {}
            },
            reducer(state) {
              return initialState
            }
          })
        })
        .toThrow(`Warning: Action Type: Expected a string prefixed by 'auth'. Got '${INVALID}' instead`)
    })
    test('should warn for duplicate actions, and warn for duplicate case as a result of the duplicate action', () => {
      duckInstance.defineAction(WHOAMI, {
        creator() {
          return {}
        },
        reducer(state) {
          return initialState
        }
      })
      expect(() => {
          duckInstance.defineAction(WHOAMI, {
            creator(userData) {
              return {
                payload: {
                  userData
                }
              }
            },
            reducer(state) {
              return initialState
            }
          })
        })
        .toThrow()
    })
    test('should throw for invalid action object', () => {
      const notAnObject = [{
          payload: 'fail'
        },
        {
          state: initialState
        }
      ]
      expect(() => {
          duckInstance.defineAction(LOGOUT, notAnObject)
        })
        .toThrow(`Action Object: Expected an object. Got ${notAnObject} instead`)
    })
    test('should throw for invalid creator method', () => {
      const obj = {
        creator: {
          payload: 'fail'
        },
        reducer(state) {
          return initialState
        }
      }
      expect(() => {
          duckInstance.defineAction(LOGIN, obj)
        })
        .toThrow(`Action creator: Expected a function. Got ${obj} instead`)
    })
  })
  describe('the addReducerCase method', () => {
    /* TODO test trackReducers functionality */
  })
  describe('the duck reducer', () => {
    /* TODO test that the reducer is being created correctly */
  })
})
