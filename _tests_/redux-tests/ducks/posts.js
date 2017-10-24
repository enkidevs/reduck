import Duck from '../../../src'
import { ADD_POST, FETCH_POSTS } from '../redux/actions'

export const postsInitialState = {
  posts: []
}

const duck = new Duck('posts', postsInitialState)

export const postPost = duck.defineAction(ADD_POST, {
  creator (newPost) {
    return {
      meta: {
        promise: {
          method: 'POST',
          url: '/posts',
          data: { ...newPost }
        },
        optimist: true
      }
    }
  },
  reducer (state, { payload }) {
    return {
      ...state,
      comments: (state.posts || []).concat(payload.newPost)
    }
  }
})

export const fetchPosts = duck.defineAction(FETCH_POSTS, {
  creator () {
    return {
      meta: {
        promise: {
          method: 'GET',
          url: '/posts/fail'
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
      posts: payload.data,
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
