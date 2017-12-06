import humps from 'humps'
import * as actionTypes from './profile.constants'

export const changeFields = (payload) => ({
  type: actionTypes.CHANGE_FIELDS,
  payload: humps.camelizeKeys(payload)
})

export const changeFieldsRequest = (payload) => ({
  type: actionTypes.CHANGE_FIELDS_REQUEST,
  payload: humps.camelizeKeys(payload)
})
