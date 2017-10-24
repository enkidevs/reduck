import Duck from '../../../src'
import { FETCH_COMMENTS } from '../redux/actions'

export const commentsInitialState = {
  comments: [],
  ready: false
}

const duck = new Duck('comments', commentsInitialState)

export const fetchComments = duck.defineAction(FETCH_COMMENTS, {
  creator () {
    return {
      meta: {
        promise: {
          method: 'GET',
          url: '/posts/1/comments'
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
      comments: payload.data.comments,
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
