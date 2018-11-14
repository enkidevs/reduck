/* Tests for invalid input provided to the defineAction duck method */
import {
  LOGOUT,
  LOGIN,
  INVALID,
  WHOAMI,
  ADD_TODO,
  authState,
  duckAuth,
  duckTodo
} from './test-variables'

const defineActionInputTests = () => {
  test('should throw for invalid action name type', () => {
    expect(() => {
      duckAuth.defineAction(['LOGOUT'], {
        creator () {
          return {}
        },
        reducer (state) {
          return authState
        }
      })
    }).toThrow(`Action Type: Expected a string. Got ${['LOGOUT']} instead`)
  })
  test('should warn for action not prefixed by the duck name', () => {
    expect(() => {
      duckAuth.defineAction(INVALID, {
        creator () {
          return {}
        },
        reducer (state) {
          return authState
        }
      })
    }).toThrow(
      `Warning: Action Type: Expected a string prefixed by 'auth'. Got '${INVALID}' instead`
    )
  })
  test('should warn for duplicate actions, and warn for duplicate case as a result of the duplicate action', () => {
    duckAuth.defineAction(WHOAMI, {
      creator () {
        return {}
      },
      reducer (state) {
        return authState
      }
    })
    expect(() => {
      duckAuth.defineAction(WHOAMI, {
        creator (userData) {
          return {
            payload: {
              userData
            }
          }
        },
        reducer (state) {
          return authState
        }
      })
    }).toThrow()
  })
  test('should throw for invalid action object', () => {
    const notAnObject = [
      {
        payload: 'fail'
      },
      {
        state: authState
      }
    ]
    expect(() => {
      duckAuth.defineAction(LOGOUT, notAnObject)
    }).toThrow(`Action Object: Expected an object. Got ${notAnObject} instead`)
  })
  test('should throw for invalid creator method', () => {
    const obj = {
      creator: {
        payload: 'fail'
      },
      reducer (state) {
        return authState
      }
    }
    expect(() => {
      duckAuth.defineAction(LOGIN, obj)
    }).toThrow(`Action creator: Expected a function. Got ${obj} instead`)
  })
  test('should throw for a reducer case with incorrect mapping', () => {
    expect(() => {
      duckTodo.defineAction(ADD_TODO, {
        creator (newTodoItem) {
          return {
            payload: {
              newTodoItem
            }
          }
        },
        reducer (state, { payload }) {
          return {
            ...state,
            items: (state.items || []).concat(payload.newTodoItem)
          }
        },
        resolveMe (state, { payload }) {
          return {
            ...state,
            items: payload.data.items,
            ready: true
          }
        }
      })
    }).toThrow('Unknown reducer mapping "resolveMe"')
  })
}

export default defineActionInputTests
