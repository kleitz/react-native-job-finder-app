import { fromJS } from 'immutable'
import * as actionTypes from './list.constants'
import { LOGOUT_SUCCESS } from '../../Session/session.constants'

const initialState = fromJS([])

export default (state = initialState, action = {}) => {
  switch (action.type) {
    case actionTypes.SET_ANIMATABLE_OFF:
      return state.map(v => v.set('shouldAnimate', false))
    case actionTypes.SET_ALL_VACANCIES:
      return fromJS(action.payload.vacancies)
    case actionTypes.ADD_VACANCY:
      return state.unshift(fromJS({
        ...action.payload.vacancy,
        shouldAnimate: true,
        selected: false
      }))
    case actionTypes.SET_SELECTED_VACANCY:
      return state
        .map((v, idx) => v.set('selected', idx === action.payload.selectedVacancy))
    case actionTypes.EDIT_VACANCY_SUCCESS:
      const { headerImageUrl: photoUrl, ...rest } = action.payload.vacancy
      return state
        .update(
          state.findIndex(v => v.get('id') === rest.id),
          v => v.merge(fromJS({
            ...rest,
            headerImageUrl: photoUrl || v.get('headerImageUrl')
          }))
        )
    case actionTypes.PAUSE_VACANCY_SUCCESS:
      return state
        .update(
          state.findIndex(v => v.get('id') === action.payload.id),
          v => v.set('state', 'paused').set('selected', false)
        )
    case actionTypes.RESUME_VACANCY_SUCCESS:
      return state
        .update(
          state.findIndex(v => v.get('id') === action.payload.id),
          v => v.set('state', 'active').set('selected', false)
        )
    case LOGOUT_SUCCESS:
      return initialState
    default:
      return state
  }
}
