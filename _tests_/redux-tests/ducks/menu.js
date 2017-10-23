import Duck from 'reduck'
import { FETCH_MENU } from '../redux/actions'

const initialState = {
  menu: [],
  ready: false
}

const duck = new Duck('menu', initialState)

export const fetchMenu = duck.defineAction(FETCH_MENU, {
  creator () {
    return {
      meta: {
        promise: {
          method: 'GET',
          url: '/menu'
        }
      }
    }
  },
  reducer (state) {
    return {
      ...state,
      ready: false
    }
  },
  resolve (state, { payload }) {
    return {
      ...state,
      menu: payload.data.menu,
      ready: true
    }
  },
  reject (state) {
    return {
      ...state,
      ready: true
    }
  }
})

export default duck.reducer
