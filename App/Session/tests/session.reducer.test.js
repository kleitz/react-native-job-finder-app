import test from 'ava'
import Immutable from 'immutable'

import reducer from '../session.reducer'
import * as sessionActions from '../session.actions'

test('Session Reducer -> ignore action', t => {
  const initialState = Immutable.fromJS({
    id: 2,
    email: 'something@yahoo.com',
    error: null,
    authToken: '123ggg',
    isRehydrated: true
  })
  const nextState = reducer(initialState, 'IGNORE_ME')
  t.deepEqual(
    nextState.toJS(),
    {
      id: 2,
      email: 'something@yahoo.com',
      error: null,
      authToken: '123ggg',
      isRehydrated: true
    }
  )
})

test('Session Reducer -> app start up', t => {
  const initialState = Immutable.fromJS({
    id: null,
    email: null,
    error: null,
    authToken: null,
    isRehydrated: false
  })
  const nextState = reducer(initialState, sessionActions.appStartup())
  t.deepEqual(
    nextState.toJS(),
    {
      id: null,
      email: null,
      error: null,
      authToken: null,
      isRehydrated: true
    }
  )
})

test('Session Reducer -> set auth state from API response', t => {
  const initialState = Immutable.fromJS({
    id: null,
    email: null,
    error: null,
    authToken: null,
    isRehydrated: false
  })
  const nextState = reducer(
    initialState,
    sessionActions.setAuthState({
      id: 2,
      email: 'testit@123.com',
      authentication_token: 'ddd'
    })
  )
  t.deepEqual(
    nextState.toJS(),
    {
      id: 2,
      email: 'testit@123.com',
      error: null,
      authToken: 'ddd',
      isRehydrated: false
    }
  )
})

test('Session Reducer -> set auth request error', t => {
  const initialState = Immutable.fromJS({
    id: null,
    email: null,
    error: null,
    authToken: null,
    isRehydrated: false
  })
  const nextState = reducer(initialState, sessionActions.requestError('error on auth'))
  t.deepEqual(
    nextState.toJS(),
    {
      id: null,
      email: null,
      error: 'error on auth',
      authToken: null,
      isRehydrated: false 
    }
  )
})

test('Session Reducer -> clear auth request error', t => {
  const initialState = Immutable.fromJS({
    id: 23,
    email: null,
    error: 'got an error here bud',
    authToken: null,
    isRehydrated: false
  })
  const nextState = reducer(initialState, sessionActions.clearAuthError())
  t.deepEqual(
    nextState.toJS(),
    {
      id: 23,
      email: null,
      error: null,
      authToken: null,
      isRehydrated: false
    }
  )
})

test('Session Reducer -> clear auth data on logout', t => {
  const initialState = Immutable.fromJS({
    id: 233,
    email: 'matthias@seal.be',
    error: null,
    authToken: 'asdz123pun',
    isRehydrated: true
  })
  const nextState = reducer(initialState, sessionActions.logout())
  t.deepEqual(
    nextState.toJS(),
    {
      id: null,
      email: null,
      error: null,
      authToken: null,
      isRehydrated: true
    }
  )
})
