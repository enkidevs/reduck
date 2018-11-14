import Duck from '../../index'

// action types
export const LOGOUT = 'auth.LOGOUT'
export const INVALID = 'INVALID'
export const WHOAMI = 'auth.WHOAMI'
export const LOGIN = 'auth.LOGIN'
export const ADD_TODO = 'todo.ADD_TODO'
export const DELETE_TODO = 'todo.DELETE_TODO'
export const UPDATE_TODO = 'todo.UPDATE_TODO'
export const ADD_PRODUCT = 'product.ADD_PRODUCT'
export const ADD_ORDER = 'order.ADD_ORDER'

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

export const orderState = {
  orders: []
}

// duck instances
export const duckAuth = new Duck('auth', authState)
export const duckTodo = new Duck('todo', todoState)
export const duckProduct = new Duck('product', productState)
export const duckOrder = new Duck('order', productState)
