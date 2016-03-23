# reduck

[![build](https://travis-ci.org/enkidevs/reduck.svg)](https://travis-ci.org/enkidevs/reduck)
[![dependencies](https://david-dm.org/enkidevs/reduck.svg)](https://david-dm.org/enkidevs/reduck)
[![devDependencies](https://david-dm.org/enkidevs/reduck/dev-status.svg)](https://david-dm.org/enkidevs/reduck#info=devDependencies)

Opinionated way to create reducers and action creators.

  * Unlocks some specifically designed tooling ([eslint-plugin-duck](https://github.com/enkidevs/eslint-plugin-duck)) to speed up the development process by catching as early as possible potential errors
  * Reduce the boilerplate

Works well with [redux-optimist-promise](https://github.com/mathieudutour/redux-optimist-promise).

## Installation

```bash
  npm install --save reduck
```

## Usage

```js
import Duck from 'reduck'

import {
  FETCH_TODOS,
  LOGOUT,
} from '../actions';

const initialState = {
  items: [],
  ready: false,
};

const duck = new Duck('todo', initialState);

export const fetchTodos = duck.defineAction(FETCH_TODOS, {
  creator() {
    return {
      meta: {
        promise: {url: '/todo'}
      }
    }
  },
  resolve(state, {payload}) {
    return {
      ...state,
      items: payload.data.items,
      ready: true,
    };
  },
  reject(state) {
    return {
      ...state,
      ready: true,
    };
  },
});

// action defined in another duck but this duck still want to react to it
duck.addReducerCase(LOGOUT, () => {
  return initialState;
});

export default duck.reducer;

```

## License

  MIT
