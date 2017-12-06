import test from 'ava'
import I18n from 'react-native-i18n'
import { take, select, call, put } from 'redux-saga/effects'
import { Actions, ActionConst } from 'react-native-router-flux'

import API from '../session.api'
import * as types from '../session.constants'
import * as actions from '../session.actions'
import * as selectors from '../session.selectors'

import { setSessionLoader } from '../../Utility/loaders/loaders.actions'

import {
  authorize, logout,
  loginFlow, registerFlow, startupFlow, logoutFlow
} from '../session.saga'

test('Session Sagas -> Startup flow -> user is authenticated', t => {
  const saga = startupFlow()
  const isUserAuthed = true

  t.deepEqual(
    saga.next().value,
    take(types.APP_STARTUP)
  )

  t.deepEqual(
    saga.next().value,
    select(selectors.isAuthed)
  )

  t.deepEqual(
    saga.next(isUserAuthed).value,
    call(Actions.tabs, { type: ActionConst.RESET })
  )
})

test('Session Saga -> Startup flow -> user is not authenticated', t => {
  const saga = startupFlow()
  const isUserAuthed = false

  t.deepEqual(
    saga.next().value,
    take(types.APP_STARTUP)
  )

  t.deepEqual(
    saga.next().value,
    select(selectors.isAuthed)
  )

  t.deepEqual(
    saga.next(isUserAuthed).value,
    take(types.APP_STARTUP)
  )
})

test('Session Saga -> Logout flow', t => {
  const saga = logoutFlow()
  const mockResponse = {
    ok: true
  }

  t.deepEqual(
    saga.next().value,
    take(types.LOGOUT)
  )

  t.deepEqual(
    saga.next().value,
    call(logout)
  )

  t.deepEqual(
    saga.next(mockResponse).value,
    put(actions.logout())
  )

  t.deepEqual(
    saga.next().value,
    call(Actions.initialScreen, { type: ActionConst.RESET })
  )
})

test('Session Saga -> Register flow -> success!', t => {
  const saga = registerFlow()
  const action = {
    payload: {
      company: 'saga',
      email: 'marti@13.com',
      password: '123123123',
      confirmPassword: '123123123'
    }
  }
  const mockResponse = {
    ok: true,
    data: {
      id: 2,
      email: 'marti@13.com',
      authentication_token: '123abc'
    }
  }

  t.deepEqual(
    saga.next().value,
    take(types.REGISTER_REQUEST)
  )

  t.deepEqual(
    saga.next(action).value,
    call(authorize, {...action.payload, isRegistering: true})
  )

  t.deepEqual(
    saga.next(mockResponse).value,
    call(API.api.setHeaders, {
      'X-Recruiter-Token': '123abc',
      'X-Recruiter-Email': 'marti@13.com'
    })
  )

  t.deepEqual(
    saga.next().value,
    put(actions.setAuthState(mockResponse.data))
  )

  t.deepEqual(
    saga.next().value,
    call(Actions.tabs, { type: ActionConst.RESET })
  )
})

test('Session Saga -> Register flow -> * email error *', t => {
  const saga = registerFlow()
  const action = {
    payload: {
      company: 'saga',
      email: 'marti@13.com',
      password: '123123123',
      confirmPassword: '123123123'
    }
  }
  const mockResponse = {
    ok: false,
    data: {
      email: 'email already taken'
    }
  }

  t.deepEqual(
    saga.next().value,
    take(types.REGISTER_REQUEST)
  )

  t.deepEqual(
    saga.next(action).value,
    call(authorize, {...action.payload, isRegistering: true})
  )

  t.deepEqual(
    saga.next(mockResponse).value,
    put(actions.requestError(I18n.t('auth.errors.email')))
  )
})

test('Session Saga -> Login flow -> success!', t => {
  const saga = loginFlow()
  const action = {
    payload: {
      email: 'costi@13.com',
      password: '123123123'
    }
  }
  const mockResponse = {
    ok: true,
    data: {
      email: 'costi@13.com',
      authentication_token: '123abc'
    }
  }

  t.deepEqual(
    saga.next().value,
    take(types.LOGIN_REQUEST)
  )

  t.deepEqual(
    saga.next(action).value,
    call(authorize, {...action.payload, isRegistering: false})
  )

  t.deepEqual(
    saga.next(mockResponse).value,
    call(API.api.setHeaders, {
      'X-Recruiter-Token': '123abc',
      'X-Recruiter-Email': 'costi@13.com'
    })
  )

  t.deepEqual(
    saga.next().value,
    put(actions.setAuthState(mockResponse.data))
  )

  t.deepEqual(
    saga.next().value,
    call(Actions.tabs, { type: ActionConst.RESET })
  )
})

test('Session Saga -> Login flow -> * error *', t => {
  const saga = loginFlow()
  const action = {
    payload: {
      email: 'costi@13.com',
      password: '123123123'
    }
  }
  const mockResponse = {
    ok: false,
    data: {
    }
  }

  t.deepEqual(
    saga.next().value,
    take(types.LOGIN_REQUEST)
  )

  t.deepEqual(
    saga.next(action).value,
    call(authorize, {...action.payload, isRegistering: false})
  )

  t.deepEqual(
    saga.next(mockResponse).value,
    put(actions.requestError(I18n.t('auth.errors.login')))
  )
})

test('Session Saga -> Authorize saga -> register', t => {
  const payload = {
    email: 'costi@123.com',
    company: 'Compan1',
    password: '123123123',
    confirmPassword: '123123123'
  }
  const saga = authorize({...payload, isRegistering: true})

  t.deepEqual(
    saga.next().value,
    put(setSessionLoader(true))
  )

  t.deepEqual(
    saga.next().value,
    call(API.register, {...payload})
  )

  t.deepEqual(
    saga.next().value,
    put(setSessionLoader(false))
  )
})

test('Session Saga -> Authorize saga -> log in', t => {
  const payload = {
    email: 'costi@123.com',
    password: '123123123'
  }
  const saga = authorize({...payload, isRegistering: false})

  t.deepEqual(
    saga.next().value,
    put(setSessionLoader(true))
  )

  t.deepEqual(
    saga.next().value,
    call(API.login, {...payload})
  )

  t.deepEqual(
    saga.next().value,
    put(setSessionLoader(false))
  )
})

test.skip('Session Saga -> Authorize saga -> API error', t => {
  const payload = {
    email: 'costi@123.com',
    password: '123123123'
  }
  const saga = authorize({...payload, isRegistering: false})

  t.deepEqual(
    saga.next().value,
    put(setSessionLoader(true))
  )

  err = t.throws(() => new Error('api error'), new Error('api error'))

  // t.deepEqual(
  //   saga.throw(err).value,
  //   'yolo'
  // )

  // t.deepEqual(
  //   saga.next().value,
  //   put(setSessionLoader(false))
  // )
})

test('Session Saga -> Logout saga', t => {
  const saga = logout()

  t.deepEqual(
    saga.next().value,
    put(setSessionLoader(true))
  )

  t.deepEqual(
    saga.next().value,
    call(API.logout)
  )

  t.deepEqual(
    saga.next().value,
    put(setSessionLoader(false))
  )
})
