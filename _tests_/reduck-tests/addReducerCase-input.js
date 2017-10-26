/* Tests for invalid input provided to the addReducerCase duck method */
import { DELETE_TODO, UPDATE_TODO, duckTodo } from './test-variables'

const addReducerCaseTestsInvalid = () => {
  test('should throw for a duplicate reducer case when adding a duplicate case that is of type function', () => {
    duckTodo.defineAction(DELETE_TODO, {
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
          items: (state.items || []).filter(item => {
            if (item.id !== payload.newTodoItem) return item
          })
        }
      }
    })
    expect(() => {
      duckTodo.addReducerCase(DELETE_TODO, function reducer (
        state,
        { payload }
      ) {
        return {
          ...state,
          items: (state.items || []).filter(item => {
            if (item.id !== payload.newTodoItem) return item
          })
        }
      })
    }).toThrow(`Warning: Duplicate reducer case for ${DELETE_TODO}`)
  })
  test('should throw duplicate case when adding a duplicate reducer case that is of type object', () => {
    duckTodo.defineAction(UPDATE_TODO, {
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
          items: (state.items || []).map(item => {
            if (item.id === payload.newTodoItem.id) return payload.newTodoItem
            else return item
          })
        }
      }
    })
    expect(() => {
      duckTodo.addReducerCase(UPDATE_TODO, {
        reducer (state, { payload }) {
          return {
            ...state,
            items: (state.items || []).map(item => {
              if (item.id === payload.newTodoItem.id) return payload.newTodoItem
              else return item
            })
          }
        }
      })
    }).toThrow(`Warning: Duplicate case for "${UPDATE_TODO}"`)
  })
}

export default addReducerCaseTestsInvalid
