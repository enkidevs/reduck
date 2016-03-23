/* globals localStorage */

import * as actions from '../actions'

const testedActions = localStorage.testedActions ? JSON.parse(localStorage.testedActions) : {}

function untested () {
  return Object.keys(actions)
    .map((k) => actions[k])
    .filter((a) => !testedActions[a])
}

window.untestedActions = untested

export default () => (next) => (action) => {
  if (!testedActions[action.type]) {
    testedActions[action.type] = true
    localStorage.testedActions = JSON.stringify(testedActions)
  }
  return next(action)
}
