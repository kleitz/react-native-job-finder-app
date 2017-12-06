import { Map } from 'immutable'

import * as actionTypes from './netInfo.constants'
import { APP_STARTUP } from '../../Session/session.constants'

const initialState = Map({
  hasInternet: true,
  codePushUpdate: false
})

export default (state = initialState, action = {}) => {
  switch (action.type) {
    case APP_STARTUP:
      return state.set('hasInternet', action.payload.netStatus)
    case actionTypes.HAS_INTERNET_CONNECTION:
      return state.set('hasInternet', true)
    case actionTypes.NO_INTERNET_CONNECTION:
      return state.set('hasInternet', false)
    case actionTypes.CHANGE_CODE_PUSH_STATUS:
      return state.set('codePushUpdate', action.payload.status)
    default:
      return state
  }
}
