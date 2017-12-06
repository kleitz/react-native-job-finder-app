import { fromJS } from 'immutable'
import * as actionTypes from './candidates.constants'

import { GET_EMPLOYEE_REVIEWS_SUCCESS } from '../../Profile/reviews.constants'
import { LOGOUT_SUCCESS } from '../../Session/session.constants'

const initialState = fromJS({})

export default (state = initialState, action = {}) => {
  switch (action.type) {
    case actionTypes.GET_CANDIDATES_SUCCESS:
      return state.set(action.payload.vacancyId, fromJS(action.payload.candidates))
    case actionTypes.REMOVE_CANDIDATE:
      return state.update(
        action.payload.vacancyId,
        candidates => candidates.filter(c => c.get('id') !== action.payload.candidateId)
      )
    case LOGOUT_SUCCESS:
      return initialState
    default:
      return state
  }
}
