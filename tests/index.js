import test from 'ava'
import sinon from 'sinon'
import 'sinon-as-promised'

import 'babel-register'
import migrate from '../src/'

function identityStub (arg) {
  return new Promise((resolve) => resolve(arg))
}

test('should proxy save to engine.save', async t => {
  t.plan(1)

  const save = sinon.spy()
  const engine = migrate({ save })

  await engine.save({})

  t.true(save.calledOnce)
})

test('should proxy save to engine.save without mutating the state', async t => {
  t.plan(2)

  const save = sinon.spy()
  const state = {}
  const engine = migrate({ save })

  await engine.save({})

  t.true(save.calledOnce)
  t.same(state, {})
})

test('should save the current version at the default key', async t => {
  t.plan(1)

  const save = identityStub
  const engine = migrate({ save }, 42)

  const state = await engine.save({})

  t.same(state, { 'redux-storage-decorators-migrate-version': 42 })
})

test('should save the current version at the custom key', async t => {
  t.plan(1)

  const save = identityStub
  const engine = migrate({ save }, 42, 'custom-key')

  const state = await engine.save({})

  t.same(state, { 'custom-key': 42 })
})

test('should proxy load to engine.load without migrations', async t => {
  t.plan(1)

  const load = sinon.stub().resolves({})
  const engine = migrate({ load })

  const state = await engine.load()

  t.same(state, {})
})

test('should remove the key from the loaded state with default key', async t => {
  t.plan(1)

  const load = sinon.stub().resolves({ 'redux-storage-decorators-migrate-version': 42 })
  const engine = migrate({ load })

  const state = await engine.load()

  t.same(state, {})
})

test('should remove the key from the loaded state with custom key', async t => {
  t.plan(1)

  const load = sinon.stub().resolves({ 'custom-key': 42 })
  const engine = migrate({ load }, 0, 'custom-key')

  const state = await engine.load()

  t.same(state, {})
})

test('should applied migrations to the loaded state when the current version is higher', async t => {
  t.plan(1)

  const load = sinon.stub().resolves({
    'redux-storage-decorators-migrate-version': 0,
    key: 1
  })
  const engine = migrate({ load }, 1)

  engine.addMigration(1, (state) => {
    return {
      ...state,
      key: 2
    }
  })

  const state = await engine.load()

  t.same(state, { key: 2 })
})

test('should not applied migrations to the loaded state when the current version is the same', async t => {
  t.plan(1)

  const load = sinon.stub().resolves({
    'redux-storage-decorators-migrate-version': 1,
    key: 1
  })
  const engine = migrate({ load }, 1)

  engine.addMigration(1, (state) => {
    return {
      ...state,
      key: 2
    }
  })

  const state = await engine.load()

  t.same(state, { key: 1 })
})

test('should not applied all migrations to the loaded state between the current version and the loaded version', async t => {
  t.plan(1)

  const load = sinon.stub().resolves({
    'redux-storage-decorators-migrate-version': 1
  })
  const engine = migrate({ load }, 3)

  engine.addMigration(1, (state) => {
    return {
      ...state,
      step1: true
    }
  })

  engine.addMigration(2, (state) => {
    return {
      ...state,
      step2: true
    }
  })
  engine.addMigration(3, (state) => {
    return {
      ...state,
      step3: true
    }
  })
  engine.addMigration(4, (state) => {
    return {
      ...state,
      step4: true
    }
  })

  const state = await engine.load()

  t.same(state, { step2: true, step3: true })
})
