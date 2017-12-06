import { fromJS } from 'immutable'
import { has } from 'lodash'
import * as actionTypes from './matchings.constants'
import { LOGOUT_SUCCESS } from '../../Session/session.constants'

import utils from '../../Utility/utils'

const initialState = fromJS([])

export default (state = initialState, action = {}) => {
  switch (action.type) {
    case actionTypes.GET_MATCHINGS_SUCCESS:
      return utils.mergeBy(state, fromJS(action.payload.matchings))
    case actionTypes.UPDATE_MATCHING:
      const matchingIndex = state
        .findIndex(m =>
          m.get('vacancyId') === action.payload.vacancyId &&
          m.get('employeeId') === action.payload.employeeId
        )
      return state.update(
        matchingIndex,
        v => v.mergeWith((oldVal, newVal) => (newVal == null) ? oldVal : newVal, {
          state: action.payload.state,
          showBubble: action.payload.showBubble,
          expiresAt: action.payload.expiresAt
        })
      )
    case actionTypes.CLEAR_MATCHINGS_BUBBLES:
      return state.map(
        m => m.get('vacancyId') === action.payload.vacancyId
          ? m.set('showBubble', false)
          : m
      )
    case actionTypes.REMOVE_CANDIDATE_SUCCESS:
      return state.delete(state.findIndex(
        m => m.get('vacancyId') === action.payload.vacancyId && m.get('employeeId') === action.payload.employeeId
      ))
    case actionTypes.STOP_APPLICANT_COUNTER:
      return state.updateIn(
        [state.findIndex(m => m.get('vacancyId') === action.payload.vacancyId && m.get('employeeId') === action.payload.employeeId)],
        v => v.set('expired', true)
      )
    case LOGOUT_SUCCESS:
      return initialState
    default:
      return state
  }
}
