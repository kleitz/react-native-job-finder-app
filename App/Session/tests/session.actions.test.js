import test from 'ava'

import * as sessionTypes from '../session.constants'
import * as sessionActions from '../session.actions'

test('Session Actions -> app startup', t => {
  t.deepEqual(
    sessionActions.appStartup(),
    {
      type: sessionTypes.APP_STARTUP
    }
  )
})

test('Session Actions -> logout', t => {
  t.deepEqual(
    sessionActions.logout(),
    {
      type: sessionTypes.LOGOUT
    }
  )
})

test('Session Actions -> login request', t => {
  t.deepEqual(
    sessionActions.loginRequest({email: 'costica@gmail.com', password: '123123123'}),
    {
      type: sessionTypes.LOGIN_REQUEST,
      payload: {
        email: 'costica@gmail.com',
        password: '123123123'
      }
    }
  )
})

test('Session Actions -> register request', t => {
  t.deepEqual(
    sessionActions.registerRequest({
      company: 'bedrijf',
      email: 'martijn@hotmail.be',
      password: '123123123',
      confirmPassword: '123123123'
    }),
    {
      type: sessionTypes.REGISTER_REQUEST,
      payload: {
        company: 'bedrijf',
        email: 'martijn@hotmail.be',
        password: '123123123',
        confirmPassword: '123123123'
      }
    }
  )
})

test('Session Actions -> set auth state', t => {
  t.deepEqual(
    sessionActions.setAuthState({
      id: 1,
      email: 'costi@123.com',
      token: 'lala123'
    }),
    {
      type: sessionTypes.SET_AUTH,
      payload: {
        id: 1,
        email: 'costi@123.com',
        token: 'lala123'
      }
    }
  )
})

test('Session Actions -> request error', t => {
  t.deepEqual(
    sessionActions.requestError('error here bro'),
    {
      type: sessionTypes.AUTH_REQUEST_ERROR,
      error: true,
      payload: {
        error: 'error here bro'
      }
    }
  )
})

test('Session Actions -> clear auth error', t => {
  t.deepEqual(
    sessionActions.clearAuthError(),
    {
      type: sessionTypes.CLEAR_AUTH_ERROR,
      error: false
    }
  )
})


