/* Tests for the duck instance methods */
import map from "lodash.map";
import filter from "lodash.filter";
import assign from "lodash.assign";
import find from "lodash.find";
import {
  ADD_PRODUCT,
  ADD_ORDER,
  duckProduct,
  productState,
  duckOrder
} from "./test-variables";

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
    reducer(state, { payload }) {
      return {
        ...state,
        products: (state.products || []).concat(payload.newProduct)
      };
    }
  });

  const addProductAction = addProduct({
    name: "Laptop",
    price: "2500",
    SKU: "986236TY",
    quantity: 1
  });

  duckProduct.addReducerCase("*", (state, action) => ({
    ...state
  }));

  const addOrder = duckOrder.defineAction(ADD_ORDER, {
    creator(newOrder) {
      return {
        payload: {
          newOrder
        }
      };
    },
    reducer(state, { payload }) {
      return {
        ...state,
        orders: (state.orders || []).concat(payload.newOrder)
      };
    }
  });

  /* may not be the best example, but I cannot think of anything else that a product duck would want to react to */
  duckProduct.addReducerCase(ADD_ORDER, (state, { payload }) => {
    /* assume orders can only have one item for the sake of simplicity & assumes the ordered
    product is in the products array and none of the quantities are less than 1 */
    const matchedProduct = find(state.products, {
      SKU: payload.newOrder.SKU
    });
    const newQuantity = +matchedProduct.quantity - +payload.newOrder.quantity;
    const replace = p =>
      p.SKU === matchedProduct.SKU
        ? assign(matchedProduct, { quantity: newQuantity })
        : p;
    if (newQuantity === 0) {
      return {
        ...state,
        products: filter(state.products, { SKU: !matchedProduct.SKU })
      };
    }
    return { ...state, products: map(state.products, replace) };
  });

  const newOrderAction = addOrder({
    name: "Laptop",
    price: "2500",
    SKU: "986236TY",
    quantity: 1,
    date: new Date(),
    userId: "63483278gsfjd"
  });

  const state = duckProduct.reducer(productState, addProductAction);
  let everyCaseState = null;

  test(`the creator should return the object that will be passed into the reducer`, () => {
    expect(addProductAction).toEqual({
      payload: {
        newProduct: {
          name: "Laptop",
          price: "2500",
          SKU: "986236TY",
          quantity: 1
        }
      },
      type: "product.ADD_PRODUCT"
    });
  });
  test(`the duck reducer should return the correct state when called with the initial state and action`, () => {
    expect(state).toEqual({
      products: [
        {
          name: "Laptop",
          price: "2500",
          SKU: "986236TY",
          quantity: 1
        }
      ],
      product: {}
    });
  });
  test(`should return the correct state when the added reducer case is dispatched`, () => {
    const newState = duckProduct.reducer(state, newOrderAction);
    expect(newState).toEqual({ products: [], product: {} });
  });
  test(`expect * reducer case to have been called when a defined action is invoked`, () => {
    const spy = jest.spyOn(duckProduct, "reducer");
    const testProduct = addProduct({
      name: "iPhone",
      price: "850",
      SKU: "9QWW236TY",
      quantity: 7
    });
    everyCaseState = duckProduct.reducer(state, testProduct);
    expect(spy).toHaveBeenLastCalledWith(state, testProduct);
  });
  test(`expect * reducer case to have been called when an added reducer case is invoked`, () => {
    const spy = jest.spyOn(duckProduct, "reducer");
    const testOrder = addOrder({
      name: "iPhone",
      price: "850",
      SKU: "9QWW236TY",
      quantity: 2,
      date: new Date(),
      userId: "63483278gsfjd"
    });
    duckProduct.reducer(everyCaseState, testOrder);
    expect(spy).toHaveBeenLastCalledWith(everyCaseState, testOrder);
  });
};

export default duckInstanceTests;
