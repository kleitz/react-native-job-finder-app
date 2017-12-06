import { Map } from 'immutable'
import * as actionTypes from './profile.constants'
import { LOGOUT_SUCCESS } from '../Session/session.constants'

const initialState = Map({
  id: null,
  companyName: null,
  companyVat: null,
  companyStreet: null,
  companyStreetNumber: null,
  companyZip: null,
  companyCity: null,
  companyWebsite: null,
  companyLogo: null,
  companyBanner: null,
  name: null,
  firstName: null,
  lastName: null,
  telephone: null,
  mobile: null,
  position: null,
  country: null,
  address: null,
  email: null,
  description: null,
  pcE: null,
  pcL: null
})

export default (state = initialState, action = {}) => {
  switch (action.type) {
    case actionTypes.CHANGE_FIELDS:
      return state.merge(action.payload)
    case LOGOUT_SUCCESS:
      return initialState
    default:
      return state
  }
}
