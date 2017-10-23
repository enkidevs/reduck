// @flow
import warning from 'warning'
import invariant from 'invariant'

type Mapper = {
  [string]: (actionType: string) => string
}

const defaultMapper: Mapper = {
  reducer (actionType) {
    return actionType
  },
  resolve (actionType) {
    return actionType + '_RESOLVED'
  },
  reject (actionType) {
    return actionType + '_REJECTED'
  }
}

export const alreadyDefined = {}

function checkActionTypeName (actionType: string, duckName?: string): void {
  invariant(
    typeof actionType === 'string',
    'Action Type: Expected a string. Got %s instead',
    actionType
  )
  if (duckName) {
    warning(
      actionType.split('.')[0] === duckName ||
        actionType.split('/')[0] === duckName,
      `Action Type: Expected a string prefixed by '${duckName}'. Got '${actionType}' instead`
    )
  }
}

function checkUniqueDefinition (actionType: string): void {
  warning(
    !alreadyDefined[actionType],
    `Duplicate definition for Action(${actionType},...`
  )
  if (process.env.NODE_ENV !== 'production') {
    alreadyDefined[actionType] = true
  }
}

function checkActionObject (obj): void {
  invariant(
    Object.prototype.toString.call(obj) === '[object Object]' && obj !== null,
    'Action Object: Expected an object. Got %s instead',
    obj
  )
  invariant(
    typeof obj.creator === 'function',
    'Action creator: Expected a function. Got %s instead',
    obj.creator
  )
}

export type Action = { type: string, payload?: any, meta?: any }
type Reducers<U> = { [key: string]: (state: U, action: Action) => U }
type ReducersCases<U> = Reducers<U> | ((state: U, action: Action) => U)
type ReducersWithCreator<U, V> = {
  creator: (...args: V) => Action,
  [key: string]: (state: U, action: Action) => U
}

function trackReducers<U> (
  mapper: Mapper,
  actionType: string,
  reducerCases: ReducersCases<U>,
  reducers: Reducers<U>
): void {
  if (typeof reducerCases === 'function') {
    // shortcut for only one reducer
    warning(!reducers[actionType], 'Duplicate reducer case for %s', actionType)
    reducers[actionType] = reducerCases
  } else if (typeof reducerCases === 'object') {
    Object.keys(reducerCases).forEach(reducerType => {
      const mapping = mapper[reducerType]
      warning(mapping, 'Unknown reducer mapping "%s"', reducerType)
      const t = mapping(actionType)
      warning(!reducers[t], 'Duplicate case for "%s"', t)
      reducers[t] = reducerCases[reducerType]
    })
  } else {
    console.error(
      'Wrong type for reducerCases: Expected an object. Got ' +
        typeof reducerCases +
        'instead'
    )
  }
}

export default function duck<U> (
  duckName: string,
  initialState: U,
  { mapper = defaultMapper }: { mapper: Mapper } = {}
) {
  warning(
    typeof duckName === 'string',
    'First argument of Duck should be a string (name of the Duck)'
  )

  const reducers: Reducers<U> = {}

  return {
    // new action creators, with corresponding reducers
    defineAction<V: [any]> (
      actionType: string,
      reducersAndCreator: ReducersWithCreator<U, V>
    ) {
      checkActionTypeName(actionType, duckName)
      checkUniqueDefinition(actionType)
      checkActionObject(reducersAndCreator)
      const { creator, ...reducerCases } = reducersAndCreator
      trackReducers(mapper, actionType, reducerCases, reducers)
      return function (...x: V): Action {
        const actionObject = creator(...x)
        actionObject.type = actionType
        return actionObject
      }
    },
    // additional reducer rules (to match actions from other ducks)
    addReducerCase (actionType: string, reducerCases: ReducersCases<U>) {
      checkActionTypeName(actionType)
      trackReducers(mapper, actionType, reducerCases, reducers)
    },
    // combined reducer for the duck
    reducer (
      state: U = initialState,
      action: Action = { type: 'missing action' }
    ): U {
      const transformedState = reducers['*']
        ? reducers['*'](state, action)
        : state
      return reducers[action.type]
        ? reducers[action.type](transformedState, action)
        : transformedState
    }
  }
}
