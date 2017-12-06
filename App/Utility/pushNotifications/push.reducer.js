import { Map } from 'immutable'
import * as actionTypes from './push.constants'

const initialState = Map({
  deviceToken: null
})

export default (state = initialState, action = {}) => {
  switch (action.type) {
    case actionTypes.SET_DEVICE_INFO:
      return state.merge(action.payload)
    default:
      return state
  }
}
