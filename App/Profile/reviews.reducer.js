import { fromJS } from 'immutable'

import * as actionTypes from './reviews.constants'
import { LOGOUT_SUCCESS } from '../Session/session.constants'
import utils from '../Utility/utils'

const initialState = fromJS({
  pending: [],
  aboutMe: []
})

export default (state = initialState, action = {}) => {
  switch (action.type) {
    case actionTypes.GET_REVIEWS_SUCCESS:
      return state.merge(fromJS(action.payload.reviews))
        // .set('pending', fromJS(action.payload.reviews.pending))
        // .set('aboutMe', utils.mergeBy(state.get('aboutMe'), fromJS(action.payload.reviews.aboutMe)))
        // .set('aboutMe', fromJS([]))
    case actionTypes.SUBMIT_REVIEW_SUCCESS:
    case actionTypes.CANCEL_REVIEW_SUCCESS:
      return state.deleteIn([
        'pending',
        state.get('pending').findIndex(i => i.get('id') === action.payload.reviewId)
      ])
    case actionTypes.GET_EMPLOYEE_REVIEWS_SUCCESS:
      return state
        .set('temporaryReviews', fromJS(action.payload.reviews))
    case actionTypes.UPDATE_REVIEW:
      return state
        .updateIn(
          ['aboutMe', state.get('aboutMe').findIndex(r => r.get('id') === action.payload.reviewId)],
          v => v.set('isNew', action.payload.isNew)
        )
    case actionTypes.SEEL_ALL_REVIEWS:
      return state.
        update('aboutMe', reviews => reviews.map(r => r.set('isNew', false)))
    case LOGOUT_SUCCESS:
      return initialState
    default:
      return state
  }
}
