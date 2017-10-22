import { applyMiddleware, createStore } from 'redux';
import optimistPromiseMiddleware from 'redux-optimist-promise';
import objectToPromise from 'redux-object-to-promise';

import rootReducer from './reducers';

let middlewares = [
  objectToPromise({
    axiosOptions: { baseURL: '/api', timeout: 10000 }
  }),
  optimistPromiseMiddleware()
];

const store = createStore(rootReducer, applyMiddleware(...middlewares));

export default store;
