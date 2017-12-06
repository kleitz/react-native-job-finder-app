import { Map } from 'immutable'
import { SET_VACANCY_PHOTO, CLEAR_VACANCY, FILL_EDIT_VACANCY, UPDATE_JOB_TYPES } from '../createVacancy.constants'
import { LOGOUT_SUCCESS } from '../../Session/session.constants'

const initialState = Map({
  jobTypeImageId: null,
  photoUrl: null,
  headerPicture: null
})

export default (state = initialState, action = {}) => {
  switch (action.type) {
    case SET_VACANCY_PHOTO:
      return state.merge({
        photoUrl: action.payload.url,
        jobTypeImageId: action.payload.jobTypeId,
        headerPicture: action.payload.cloudinaryResource
      })
    case FILL_EDIT_VACANCY:
      const { headerImageUrl } = action.payload.vacancy
      return state.set('photoUrl', headerImageUrl)
    case UPDATE_JOB_TYPES:
      return initialState
    case LOGOUT_SUCCESS:
    case CLEAR_VACANCY:
      return initialState
    default:
      return state
  }
}
