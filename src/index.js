import warning from 'warning'
import invariant from 'invariant'

const defaultMapper = {
  reducer (actionType) { return actionType },
  resolve (actionType) { return actionType + '_RESOLVED' },
  reject (actionType) { return actionType + '_REJECTED' }
}

export const alreadyDefined = {}

function checkActionTypeName (actionType, duckName) {
  invariant(typeof actionType === 'string', 'Action Type: Expected a string. Got %s instead', actionType)
  warning(!duckName || actionType.split('.')[0] === duckName || actionType.split('/')[0] === duckName,
    `Action Type: Expected a string prefixed by '${duckName}'. Got '${actionType}' instead`)
}

function checkUniqueDefinition (actionType) {
  warning(!alreadyDefined[actionType],
    `Duplicate definition for Action(${actionType},...`)
  if (process.env.NODE_ENV !== 'production') {
    alreadyDefined[actionType] = true
  }
}

function checkActionObject (obj) {
  invariant(typeof obj === 'object', 'Action Object: Expected an object. Got %s instead', obj)
  invariant(typeof obj.creator === 'function', 'Action creator: Expected a function. Got %s instead', obj.creator)
}

function trackReducers (mapper, actionType, reducerCases, reducers) {
  if (typeof reducerCases === 'function') { // only one reducer
    warning(!reducers[actionType], 'Duplicate reducer case for %s', actionType)
    reducers[actionType] = reducerCases
  } else {
    Object.keys(reducerCases).forEach((reducerType) => {
      const mapping = mapper[reducerType]
      warning(mapping, 'Unknown reducer mapping "%s"', reducerType)
      const t = mapping(actionType)
      warning(!reducers[t], 'Duplicate case for "%s"', t)
      reducers[t] = reducerCases[reducerType]
    })
  }
}

export default function (duckName, initialState = {}, {mapper = defaultMapper} = {}) {
  warning(typeof duckName === 'string', 'Fist argument of Duck should be a string (name of the Duck)')

  const reducers = {}

  return {
    // new action creators, with corresponding reducers
    defineAction (actionType, obj) {
      checkActionTypeName(actionType, duckName)
      checkUniqueDefinition(actionType)
      checkActionObject(obj)
      const {
        creator,
        ...reducerCases
      } = obj
      trackReducers(mapper, actionType, reducerCases, reducers)
      return function (...x) {
        const actionObject = creator(...x)
        actionObject.type = actionType
        return actionObject
      }
    },
    // additional reducer rules (to match actions from other ducks)
    addReducerCase (actionType, reducerCases) {
      checkActionTypeName(actionType)
      trackReducers(mapper, actionType, reducerCases, reducers)
    },
    // combined reducer for the duck
    reducer (state = initialState, action = {}) {
      const transformedState = reducers['*']
                                ? reducers['*'](state, action)
                                : state
      return reducers[action.type]
              ? reducers[action.type](transformedState, action)
              : transformedState
    }
  }
}
