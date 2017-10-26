require('jest-localstorage-mock')
import optimistPromiseMiddleware from 'redux-optimist-promise'
import objectToPromise from 'redux-object-to-promise'
import configureMockStore from 'redux-mock-store'

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

export default mockStore
