import Duck from '../src'

// action types
export const LOGOUT = 'auth.LOGOUT'
export const INVALID = 'INVALID'
export const WHOAMI = 'auth.WHOAMI'
export const LOGIN = 'auth.LOGIN'
export const ADD_TODO = 'todo.ADD_TODO'
export const DELETE_TODO = 'todo.DELETE_TODO'
export const UPDATE_TODO = 'todo.UPDATE_TODO'
export const ADD_PRODUCT = 'product.ADD_PRODUCT'
export const DELETE_PRODUCT = 'product.DELETE_PRODUCT'
export const UPDATE_PRODUCT = 'product.UPDATE_PRODUCT'

// initial state to use in the duck instances
export const authState = {
  user: {},
  authStatus: 'Unknown'
}
export const todoState = {
  items: [],
  ready: false
}
export const productState = {
  products: [],
  product: {}
}

// duck instances
export const duckAuth = new Duck('auth', authState)
export const duckTodo = new Duck('todo', todoState)
export const duckProduct = new Duck('product', productState)
