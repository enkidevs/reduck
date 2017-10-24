/* Tests for duck middleware */

import mockStore from './redux/store'
import commentReducer, {
  fetchComments,
  commentsInitialState,
  postComment
} from './ducks/comments'
import postReducer, {
  postPost,
  fetchPosts,
  postsInitialState
} from './ducks/posts'
import {
  FETCH_COMMENTS,
  FETCH_POSTS,
  ADD_COMMENT,
  UPDATE_COMMENT
} from './redux/actions'

const middleWare = () => {
  describe('tests that the middleware handles resolves and rejects correctly', () => {
    test('should have the resolved fetch comments action in the store log', () => {
      const store = mockStore(commentsInitialState)
      return store
        .dispatch(fetchComments())
        .then(() => {
          const actions = store.getActions()
          expect.assertions(2)
          expect(actions[0].type).toEqual(FETCH_COMMENTS)
          expect(actions[1].type).toEqual(`${FETCH_COMMENTS}_RESOLVED`)
        })
        .catch(err => console.error(err.message))
    })
    test('should have the rejected fetch posts action in the store log', () => {
      const store = mockStore(postsInitialState)
      return store
        .dispatch(fetchPosts())
        .then(() => {})
        .catch(() => {
          const actions = store.getActions()
          expect.assertions(2)
          expect(actions[0].type).toEqual(FETCH_POSTS)
          expect(actions[1].type).toEqual(`${FETCH_POSTS}_REJECTED`)
        })
    })
    test('should resolve with data when using redux optimist', () => {
      const store = mockStore(postsInitialState)
      const newPost = {
        title: 'Testing with Jest',
        body: 'This is a test with Jest',
        userId: 1
      }
      return store
        .dispatch(postPost(newPost))
        .then(res => res.data)
        .then(data => {
          expect.assertions(2)
          expect(data).toEqual({
            title: 'Testing with Jest',
            body: 'This is a test with Jest',
            userId: 1,
            id: 101
          })
          expect(store.getActions()[1].optimist.type).toEqual('COMMIT')
        })
        .catch(err => console.error(err.message))
    })
    test('redux optimist should reject with invalid api endpoint', () => {
      const store = mockStore(commentsInitialState)
      const newComment = {
        postId: 1,
        name: 'id labore ex et quam laborum',
        email: 'Eliseo@gardner.biz',
        body:
          'laudantium enim quasi est quidem magnam voluptate ipsam eos\ntempora quo.'
      }
      return store
        .dispatch(postComment(newComment))
        .then(() => {})
        .catch(() => {
          const actions = store.getActions()
          expect.assertions(2)
          // actions[0] is the initial ADD_COMMENT action
          expect(actions[1].type).toEqual(`${ADD_COMMENT}_REJECTED`)
          expect(actions[1].optimist.type).toEqual('REVERT')
        })
    })
  })
  describe('tests resolve and reject reducer cases update state correctly when using middleware', () => {
    test('should return the initial state', () => {
      expect(commentReducer(undefined, {})).toEqual({
        comments: [],
        ready: false
      })
    })
    test('should update state for FETCH_COMMENTS_RESOLVED', () => {
      expect(
        commentReducer([], {
          type: `${FETCH_COMMENTS}_RESOLVED`,
          payload: {
            data: [
              { comment: 'my favorite!', username: '@emily' },
              { comment: 'love this!', username: '@samantha' }
            ]
          }
        })
      ).toEqual({
        comments: [
          { comment: 'my favorite!', username: '@emily' },
          { comment: 'love this!', username: '@samantha' }
        ],
        ready: true
      })
    })
    test('should not change the comments on the state for rejected UPDATE_COMMENT action', () => {
      expect(
        commentReducer(
          {
            comments: [
              { comment: 'my favorite!', username: '@emily' },
              { comment: 'love this!', username: '@samantha' }
            ],
            ready: false
          },
          {
            type: `${UPDATE_COMMENT}_REJECTED`,
            payload: {
              Error: 'Request failed with status code 404'
            }
          }
        )
      ).toEqual({
        comments: [
          { comment: 'my favorite!', username: '@emily' },
          { comment: 'love this!', username: '@samantha' }
        ],
        ready: true
      })
    })
  })
}

export default middleWare
