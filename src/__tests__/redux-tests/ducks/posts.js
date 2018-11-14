import Duck from '../../../index'
import { ADD_POST, FETCH_POSTS, UPDATE_POST } from '../redux/actions'

export const postsInitialState = {
  posts: [],
  ready: false
}

const duck = new Duck('posts', postsInitialState)

export const postPost = duck.defineAction(ADD_POST, {
  creator (newPost) {
    return {
      payload: {
        newPost
      },
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
      posts: (state.posts || []).concat(payload.newPost),
      ready: true
    }
  }
})

export const updatePost = duck.defineAction(UPDATE_POST, {
  creator (updatedPost) {
    return {
      payload: { updatedPost },
      meta: {
        promise: {
          method: 'PUT',
          url: '/posts/fail',
          data: { ...updatedPost }
        },
        optimist: true
      }
    }
  },
  reducer (state, { payload }) {
    return {
      ...state,
      posts: (state.posts || []).map(post => {
        if (post.id === payload.updatedPost.id) return payload.updatedPost
        else return post
      }),
      ready: true
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
