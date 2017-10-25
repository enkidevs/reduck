/* globals describe, it */

import { assert } from 'chai'

import * as actions from '../actions'
import { alreadyDefined } from 'reduck'

const normalizedPath = require('path').join(__dirname, '../ducks')

require('fs')
  .readdirSync(normalizedPath)
  .forEach(file => require('../ducks/' + file))

describe('Consistent action type names', () => {
  Object.keys(actions).forEach(k => {
    const a = actions[k]
    it(a, () => {
      assert.lengthOf(
        a.split('/'),
        2,
        `Bad action type name ${a} (should be predixed with a duck name).`
      )
    })
  })
})

describe('All actions should be defined', () => {
  Object.keys(actions).forEach(k => {
    const a = actions[k]
    it(a, () => {
      assert.isDefined(alreadyDefined[a], 'Action is not defined')
    })
  })
})
