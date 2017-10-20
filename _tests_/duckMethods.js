/* Tests for the duck instance methods */
import {
  ADD_PRODUCT,
  duckProduct,
  productState
} from './test-variables'

const duckInstanceTests = () => {
  // action creator
  const addProduct = duckProduct.defineAction(ADD_PRODUCT, {
    creator(newProduct) {
      return {
        payload: {
          newProduct
        }
      };
    },
    reducer(state, {
      payload
    }) {
      return {
        ...state,
        products: (state.products || []).concat(payload.newProduct)
      }
    }
  })
  const addProductAction = addProduct({
    name: 'Laptop',
    price: '2500',
    SKU: '986236TY'
  })
  test('the creator should return the object that will be passed into the reducer', () => {
    expect(addProductAction)
      .toEqual({
        payload: {
          newProduct: {
            name: 'Laptop',
            price: '2500',
            SKU: '986236TY'
          }
        },
        type: 'product.ADD_PRODUCT'
      })
  })
  test('the duck reducer should return the correct state when called with the initial state and action', () => {
    const returnedState = duckProduct.reducer(productState, addProductAction)
    expect(returnedState)
      .toEqual({
        products: [{
          name: 'Laptop',
          price: '2500',
          SKU: '986236TY'
        }],
        product: {}
      })
  })
}

export default duckInstanceTests
