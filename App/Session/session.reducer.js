import { fromJS } from 'immutable'
import * as actionTypes from './session.constants'

const initialState = fromJS({
  id: null,
  email: null,
  error: null,
  authToken: null,
  isRehydrated: true,
  registrationDone: true,
  errors: {
    login: false,
    email: false,
    companyName: false,
    logout: false
  }
})

export default (state = initialState, action = {}) => {
  switch (action.type) {
    case actionTypes.APP_STARTUP:
      return state.set('isRehydrated', true).set('error', null).set(
        'errors',
        fromJS({
          login: false,
          email: false,
          companyName: false,
          logout: false
        })
      )
    case actionTypes.SET_AUTH:
      return state.merge({
        error: null,
        id: action.payload.id,
        email: action.payload.email,
        authToken: action.payload.authentication_token
      })
    case actionTypes.AUTH_REQUEST_ERROR:
      return state.merge({
        error: action.payload.error
      })
    case actionTypes.CLEAR_AUTH_ERROR:
      return state.set('error', null)
    case actionTypes.USER_REGISTERED:
      return state.set('registrationDone', action.payload.visibility)
    case actionTypes.LOGOUT_SUCCESS:
      return initialState.merge({
        isRehydrated: true,
        profileLoaded: false,
        error: null
      })
    case actionTypes.LOGOUT_ERROR:
      return state.set('error', action.payload.error)
    case actionTypes.SESSION_ERROR:
      return state.setIn(['errors', action.payload.errorType], action.payload.status)
    case actionTypes.CLEAR_AUTH_TOKEN:
      return state.set('authToken', null)
    default:
      return state
  }
}
