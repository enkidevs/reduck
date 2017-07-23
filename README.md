# reduck

[![build](https://travis-ci.org/enkidevs/reduck.svg)](https://travis-ci.org/enkidevs/reduck)
[![dependencies](https://david-dm.org/enkidevs/reduck.svg)](https://david-dm.org/enkidevs/reduck)
[![devDependencies](https://david-dm.org/enkidevs/reduck/dev-status.svg)](https://david-dm.org/enkidevs/reduck#info=devDependencies)

Opinionated way to create reducers and action creators.

  * Unlocks some specifically designed tooling ([eslint-plugin-duck](https://github.com/enkidevs/eslint-plugin-duck)) to speed up the development process by catching as early as possible potential errors
  * Reduce the boilerplate

Ducks are a modular way to keep your redux action creators and reducers in the same place, simplifying the repo's structure and the development process. Some explanation on why this is beneficial can be found [here](https://github.com/erikras/ducks-modular-redux) and [here](https://medium.freecodecamp.com/scaling-your-redux-app-with-ducks-6115955638be).

## Installation

```bash
  npm install --save reduck
```

## Usage

*actions.js*
```js
// We define our action types here so that they can easily be used by different ducks
export const FETCH_TODOS = 'todo.FETCH_TODOS';
export const ADD_TODO = 'todo.ADD_TODO';
export const LOGOUT = 'auth.LOGOUT';
```

*ducks/todos.js*
```js
import Duck from 'reduck'

import {
  ADD_TODO,
  FETCH_TODOS,
  LOGOUT,
} from '../actions'

// define an initial state to use in the Duck's initialization
const initialState = {
  items: [],
  ready: false
};

const duck = new Duck('todo', initialState);

export const addTodo = duck.defineAction(ADD_TODO, {
  creator(newTodoItem) {
    return {
      payload: { newTodoItem }
    };
  },
  reducer(state, { payload }) {
    return {
      ...state,
      items: (state.items || []).concat(payload.newTodoItem)
    }
  }
})

// action defined in another duck but this duck still wants to react to it
duck.addReducerCase(LOGOUT, {
  reducer() {
    return initialState;
  }
})

export default duck.reducer
```

*ducks/auth.js*
```js
import Duck from 'reduck'
import { LOGOUT } from '../actions'

const initialState = {
  user: {},
  authStatus: 'Unknown'
}

const duck = new Duck('auth', initialState);

duck.defineAction(LOGOUT, {
  creator() {
    return {} // Data is not necessary in this case
  },
  reducer(state) {
    return initialState
  }
})

export default duck.reducer;
```

*reducer.js*
```js
import { combineReducers } from 'redux'

import auth from './ducks/auth'
import todos from './ducks/todos'

export default combineReducers({
  auth, todos,
})
```

### API

`constructor(duckName, initialState)`
- `duckName`: Given name of the duck
- `initialState`: the state that the duck will be initialized with
- returns a 'duck' object that provides the following methods:

**Methods**

`defineAction(actionType: String, reducerCases: Object)`
- `actionType` is the type of the action. Can be whatever you choose as long as it follows the format: `<duck-name>/<some-action-name>`.
This helps with tracking defined actions in each duck.

- `reducerCases` consist of:
  * `creator(actionArgs)`
  The creator accepts any arguments related to the action being performed and then returns the object that will be passed to the action's reducers. The object consists of mainly `payload` (the payload that will be handled by the reducers) and `meta` (data that will be used by middleware).
  _Note:_The creator **must** be present in the `defineAction` method.
  * `reducer(state, { payload })`
  The reducer function receives the payload sent by the `creator` and the duck's current `state`. It then calculates the next state and returns it.

_Note:_ The API allows for more cases to be added at your convenience. An example of such cases is discussed further in the **Middleware** section.

`addReducerCases(actionName: String, reducerCases: Object)`
This method is used similarly to `defineAction` but does **not** define a new action. It is used to define a reducer which will change the duck's state when an action from a different duck is dispatched. Therefore the `actionName` needs to be of an existing action and the `reducerCases` cannot have a `creator`.

### Middleware
We recommend using **reduck** with the following to packages:
- [redux-object-to-promise](https://github.com/mathieudutour/redux-object-to-promise)
- [redux-optimist-promise](https://github.com/mathieudutour/redux-optimist-promise)

By adding these to your redux middlewares, you can easily define async server calls as well the reducer cases that should be called when the request returns data or gets rejected.

We define the server call by using a `meta.promise` key in our action creator. We then define `resolve()` and `reject()` reducer cases.
Given the example above, a `FETCH_TODOS` action to get the user's stored Todos from the server would look like this:

*ducks/todos.js*
```js
export const fetchTodos = duck.defineAction(FETCH_TODOS, {
  creator() {
    return {
      meta: {
        promise: {       // This is the api for redux-object-to-promise
          method: 'GET',
          url: '/todo'   // Host URL is defined when the store is instantiated so we can use just relative URLs here
        }
      }
    }
  },
  reducer(state) {
    return {
      ...state,
      ready: false,     // setting ready to false while we wait for the network response
    }
  },
  // This is called when the data comes back from the server
  resolve(state, {payload}) { // In this case the payload comes from the server, not from the action creator
    return {
      ...state,
      items: payload.data.items,
      ready: true
    }
  },
  // This is called when the request to server fails (for whatever reason)
  reject(state) {
    return {
      ...state,
      ready: true
    }
  }
});
```

**redux-optimist-promise** also provides us with another `meta` key that can be used to revert optimistic updates in case of a server request failure.
Let's adjust our `ADD_TODO` method to include a call to the server in order to update the user's data in the DB as well:

*ducks/todos.js*
```js
export const addTodo = duck.defineAction(ADD_TODO, {
  creator(newTodoItem) {
    return {
      payload: { newTodoItem }
      meta: {
        promise: {
          method: 'POST',
          url: 'todo',
          data: { item: newTodoItem }
        },
        optimist: true
      }
		}
  },
  reducer(state, { payload }) {
    return {
      ...state,
      items: (state.items || []).concat(payload.newTodoItem)
    }
	}
})
```
Normally, we would want to add a `reject()` function that would roll back the reducer's changes since the failed server call would mean our client and DB data would be out of sync. By using `optimist: true` in our `meta` fields however, the change will be automatically reverted if the server request fails!

## License

  MIT

## Appropriate GIF
![Duck!](https://media2.giphy.com/media/ruhPcuDNmS12M/giphy.gif)
