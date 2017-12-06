import * as actionTypes from './session.constants'

export const appStartup = netStatus => ({
  type: actionTypes.APP_STARTUP,
  payload: { netStatus }
})

export const clearAuthToken = () => ({
  type: actionTypes.CLEAR_AUTH_TOKEN
})

export const logout = () => ({
  type: actionTypes.LOGOUT
})

export const logoutRequest = () => ({
  type: actionTypes.LOGOUT_REQUEST
})

export const logoutSuccess = () => ({
  type: actionTypes.LOGOUT_SUCCESS
})

export const logoutError = error => ({
  type: actionTypes.LOGOUT_ERROR,
  payload: { error }
})

export const loginRequest = ({ email, password }) => ({
  type: actionTypes.LOGIN_REQUEST,
  payload: { email, password }
})

export const registerRequest = ({ company, email, password, confirmPassword }) => ({
  type: actionTypes.REGISTER_REQUEST,
  payload: { company, email, password, confirmPassword }
})

export const setAuthState = authState => ({
  type: actionTypes.SET_AUTH,
  payload: { ...authState }
})

export const requestError = error => ({
  type: actionTypes.AUTH_REQUEST_ERROR,
  error: true,
  payload: { error }
})

export const clearAuthError = () => ({
  type: actionTypes.CLEAR_AUTH_ERROR,
  error: false
})

export const userRegistered = visibility => ({
  type: actionTypes.USER_REGISTERED,
  payload: { visibility }
})

export const redirectOnForeground = () => ({
  type: actionTypes.REDIRECT_ON_FOREGROUND
})

export const setSessionError = (errorType, status) => ({
  type: actionTypes.SESSION_ERROR,
  payload: { errorType, status }
})
