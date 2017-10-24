import Duck from '../../../src'
import { ADD_POST } from '../redux/actions'

export const postsInitialState = {
  posts: []
}

const duck = new Duck('posts', postsInitialState)

export const postPosts = duck.defineAction(ADD_POST, {
  creator (newPost) {
    return {
      meta: {
        promise: {
          method: 'POST',
          url: '/posts',
          data: {
            title: 'Testing with Jest',
            body:
              'Lorem ipsum dolor sit amet, quo no congue mentitum. Soleat posidonium eos ne, clita argumentum in usu. Justo debet mei eu, ea iriure scriptorem vituperatoribus vix. Nam te choro oblique dissentias, has ridens evertitur id.',
            userId: 1
          }
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

export default duck.reducer
