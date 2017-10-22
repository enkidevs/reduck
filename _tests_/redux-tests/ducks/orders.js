import Duck from 'reduck';
import { ADD_ORDER } from '../redux/actions';

const initialState = {
  orders: []
};

const duck = new Duck('orders', initialState);

export const fetchOrders = duck.defineAction(ADD_ORDER, {
  creator(newOrder) {
    return {
      meta: {
        promise: {
          method: 'POST',
          url: '/orders',
          data: { order: newOrder }
        },
        optimist: true
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

export default duck.reducer;
