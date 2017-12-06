import { Map, List, fromJS } from 'immutable'
import {
  GENERAL_CHANGE_FIELDS,
  SET_TYPES_AND_TERMS,
  CLEAR_VACANCY,
  FILL_EDIT_VACANCY,
  UPDATE_JOB_TYPES,
  ACCESSSED_SCREEN,
  MARK_JOB_CATEGORY_AS_SELECTED
} from '../createVacancy.constants'
import { LOGOUT_SUCCESS } from '../../Session/session.constants'

const initialState = Map({
  id: null,
  name: null,
  jobTermId: null,
  jobTypeId: null,
  wageCents: null,
  jobTerms: List(),
  jobTypes: List(),
  accessedWage: false,
  accessedCapacities: false
})

export default (state = initialState, action = {}) => {
  switch (action.type) {
    case GENERAL_CHANGE_FIELDS:
      return state.merge(action.payload)
    case SET_TYPES_AND_TERMS:
      return state
              .update('jobTerms', terms => terms.merge(fromJS(action.payload.terms)))
              .update('jobTypes', types => types.merge(fromJS(action.payload.types)))
    case UPDATE_JOB_TYPES:
      let selectedCategoryId = action.payload.filter(category => category.selected)[0].id
      return state
        .set('jobTypeId', selectedCategoryId)
        .set('jobTypes', fromJS(action.payload))
    case CLEAR_VACANCY:
      let resetJobTypes = state.get('jobTypes').toJS()
        .map(jobType => ({
          ...jobType,
          selected: false
        }))

      return state
        .update('jobTypes', types => types.merge(fromJS(resetJobTypes)))
        .merge({
          name: null,
          jobTermId: null,
          jobTypeId: null,
          wageCents: null,
          accessedWage: false,
          accessedCapacities: false
        })
    case FILL_EDIT_VACANCY:
      const { id, name, jobTermId, jobTypeId, wageCents } = action.payload.vacancy
      return state.merge(fromJS({
        id,
        name,
        jobTermId,
        jobTypeId,
        wageCents: wageCents
      }))
    case ACCESSSED_SCREEN:
      return state.set(action.payload.propToUpdate, action.payload.value ? action.payload.value : true)
    case MARK_JOB_CATEGORY_AS_SELECTED:
      const selectedJobId = state.get('jobTypeId')
      const updatedCategories = state.get('jobTypes').toJS().map(category => {
        if (category.id === selectedJobId) {
          return {
            ...category,
            selected: true
          }
        } else {
          return category
        }
      })
      return state
        .set('jobTypes', fromJS(updatedCategories))
    case LOGOUT_SUCCESS:
      return initialState
    default:
      return state
  }
}
