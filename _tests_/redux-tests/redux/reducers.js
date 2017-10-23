import { combineReducers } from 'redux'
import menu from '../ducks/menu'
import orders from '../ducks/orders'

export default combineReducers({ menu, orders })
