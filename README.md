# reduck

[![build](https://travis-ci.org/enkidevs/reduck.svg)](https://travis-ci.org/enkidevs/reduck)
[![dependencies](https://david-dm.org/enkidevs/reduck.svg)](https://david-dm.org/enkidevs/reduck)
[![devDependencies](https://david-dm.org/enkidevs/reduck/dev-status.svg)](https://david-dm.org/enkidevs/reduck#info=devDependencies)

Opinionated way to create reducers and action creators.

  * Unlocks some specifically designed tooling ([eslint-plugin-duck](https://github.com/enkidevs/eslint-plugin-duck)) to speed up the development process by catching as early as possible potential errors
  * Reduce the boilerplate
  
Ducks are a modular way to keep your redux action creators and reducers in the same place, simplifying the repo's structure and the development process. Some explanation on why this is beneficial can be found [here](https://github.com/erikras/ducks-modular-redux) and [here](https://medium.freecodecamp.com/scaling-your-redux-app-with-ducks-6115955638be).

Working with ducks means reducers are split into types of data and each reducer (or ~duck~) defines all the actions that are relevant to a specific type of data (e.g. to-do items)

Works well with [redux-optimist-promise](https://github.com/mathieudutour/redux-optimist-promise).

## Installation

```bash
  npm install --save reduck
```


## Usage

Working with ducks means reducers are split into types of data and each reducer (or ~duck~) defines all the actions that are relevant to a specific type of data (e.g. to-do items).

Let's look at a basic example:

*actions.js*
```js
export const FETCH_TODOS = 'todo.FETCH_TODOS';
export const ADD_TODO = 'todo.ADD_TODO';
export const LOGOUT = 'auth.LOGOUT';
```
The package expects the action name to be defined as `<duck>.<action-name>`.
This helps with tracking defined actions in each duck.

Now let's look at what the todo items duck will look like:

*ducks/todos.js*
```js
import Duck from 'reduck'

import {
  ADD_TODO,
  FETCH_TODOS,
  LOGOUT,
} from '../actions';

// define an initial state to use in the Duck's initialization
const initialState = {
  items: [],
  ready: false,
};

const duck = new Duck('todo', initialState);
```
We start by simply creating a `new Duck`. The resulting object gives us 2 methods that we can use to define action creators and corresponding reducers: 
`defineAction(actionName: String, reducerCases: Object)`
- `actionName` is the name that will be given to the action. Can be whatever you choose.
- `reducerCases` consist of:
  * `creator(actionArgs)`
  The creator accepts any arguments related to the action being performed and then returns the object that will be passed to the action's reducers. The object consists of mainly `payload` (the payload that will be handled by the reducers) and `meta` (data that will be used by middleware). 
  _Note:_The creator **must** be present in the `defineAction` method.
  * `reducer(state, { payload })`
  The reducer function receives the payload sent by the `creator` and the duck's current `state`. It then calculates the next state and returns it.
  * `resolve(state, { payload })`
  The `resolve()` function can be used when the `redux-object-to-promise` middleware is used for async network calls. This function is called when the data requested by the server is received by the client. It then works in a similar way to `reducer` in that it returns the updated `state` after operating with the received `payload`. 
  _Note:_ In this case `payload` is the data from the server and not from the `creator`
  * `reject(state, { payload })`
  Works the same as the `resolve()` function but is called when the network request was rejected (40\* HTTP code)

Given the above, let's see what the `ADD_TODO` action definition would look like:

```
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
});
```


As for an async action that requests existing ToDos from the server:
```js
export const fetchTodos = duck.defineAction(FETCH_TODOS, {
  creator() {
    return {
      meta: {
        promise: {       // This is the api for redux-object-to-promise
         method: 'GET',
         url: '/todo'
        } 
      }
    }
  },
  reducer(state) {
   return {
    ...state,
    ready: false,       // setting ready to false while we wait for the network response
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
```

The second method that the `duck` object provides us with is `addReducerCase`

`addReducerCases(actionName: String, reducerCases: Object)`
This method is used similarly to `defineAction` but does **not** define a new action. It is used when a different duck (to the one that creates the action) needs to take some action when an action is created. Therefore the `actionName` needs to be of an existing action and the `reducerCases` cannot have a `creator`.

Let's add a reducer case in the todos duck for when the user logs out.
The `defineAction` for `LOGOUT` would probably be defined in `ducks/auth` (or similar).
When the user logs out we want to remove all their info but also clear all the todos we have already stored

```js

// action defined in another duck but this duck still want to react to it
duck.addReducerCase(LOGOUT, {
 reducer() {
  return ...initialState;
 }
});
```
We finally need to export the duck's `reducer` property and then use the export in our `combineReducers` function
```
export default duck.reducer;

```

#Middleware:
Some middleware that play very nicely with ducks:
- [redux-object-to-promise] (https://github.com/mathieudutour/redux-object-to-promise/) is used in the above example to handle network calls found in the `meta.promise` property of the action that is created
- [redux-optimist-promise] (https://github.com/mathieudutour/redux-optimist-promise) can be used in combination with the above so that you don't have to define the fallback procedure in every `reject()` case of async calls. You can update your state locally (optimistically) in the `reduce` function and send the request to the server. If the promise fails and `meta.optimist` is set to true, then the state will simply revert to the original, before the `reduce` function was called.


## License

  MIT
