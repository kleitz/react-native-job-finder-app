import { Map } from 'immutable'
import { LOCATION_CHANGE_FIELD, CLEAR_VACANCY, FILL_EDIT_VACANCY } from '../createVacancy.constants'
import { LOGOUT_SUCCESS } from '../../Session/session.constants'

const initialState = Map({
  address: null
})

export default (state = initialState, action = {}) => {
  switch (action.type) {
    case LOCATION_CHANGE_FIELD:
      return state.set('address', action.payload.address)
    case FILL_EDIT_VACANCY:
      return state.set('address', action.payload.vacancy.address)
    case LOGOUT_SUCCESS:
    case CLEAR_VACANCY:
      return initialState
    default:
      return state
  }
}
