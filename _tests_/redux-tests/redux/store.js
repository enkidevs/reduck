require('jest-localstorage-mock')
// import { applyMiddleware, createStore } from 'redux'
import optimistPromiseMiddleware from 'redux-optimist-promise'
import objectToPromise from 'redux-object-to-promise'
import configureMockStore from 'redux-mock-store'
import { commentsInitialState } from '../ducks/comments'
import { postsInitialState } from '../ducks/posts'
// import rootReducer from './reducers'

let middlewares = [
  objectToPromise({
    axiosOptions: {
      baseURL: 'https://jsonplaceholder.typicode.com'
    },
    tokenOptions: { storage: localStorage, key: 'token-key' }
  }),
  optimistPromiseMiddleware()
]

const mockStore = configureMockStore(middlewares)

const store = mockStore({ ...commentsInitialState, ...postsInitialState })

// const store = createStore(rootReducer, applyMiddleware(...middlewares))

export default store
