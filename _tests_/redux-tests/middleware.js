import store from './redux/store'
import { fetchComments } from './ducks/comments'
import { postPosts } from './ducks/posts'
const middleWare = () => {
  test('should resolve with the data', () => {
    store
      .dispatch(fetchComments())
      .then(() => {
        expect.assertions(2)
        expect(store.getActions()[0].type).toEqual('comments.FETCH_COMMENTS')
        expect(store.getActions()[1].type).toEqual(
          'comments.FETCH_COMMENTS_RESOLVED'
        )
      })
      .catch(err => console.log(err))
  })
}

export default middleWare
