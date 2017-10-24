import mockStore from './redux/store'
import {
  fetchComments,
  commentsInitialState,
  postComment
} from './ducks/comments'
import { postPost, fetchPosts, postsInitialState } from './ducks/posts'
import { FETCH_COMMENTS, FETCH_POSTS, ADD_COMMENT } from './redux/actions'

const middleWare = () => {
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
}

export default middleWare
