import { Map, fromJS } from 'immutable'
import { DESCRIPTION_CHANGE_FIELDS, CLEAR_VACANCY, FILL_EDIT_VACANCY } from '../createVacancy.constants'
import { LOGOUT_SUCCESS } from '../../Session/session.constants'

const initialState = Map({
  shortDescription: null,
  description: null
})

export default (state = initialState, action = {}) => {
  switch (action.type) {
    case DESCRIPTION_CHANGE_FIELDS:
      return state.set(action.payload.key, action.payload.value)
    case FILL_EDIT_VACANCY:
      const { description, shortDescription } = action.payload.vacancy
      return state.merge(fromJS({ shortDescription, description }))
    case LOGOUT_SUCCESS:
    case CLEAR_VACANCY:
      return initialState
    default:
      return state
  }
}
