import moment from 'moment'

import * as actionTypes from './matchings.constants'

const getMatchingsRequest = () => ({
  type: actionTypes.GET_MATCHINGS_REQUEST
})

const getMatchingsSuccess = (matchings) => ({
  type: actionTypes.GET_MATCHINGS_SUCCESS,
  payload: { matchings }
})

const updateMatching = ({
  vacancyId, employeeId, state, showBubble, expiresAt
}) => ({
  type: actionTypes.UPDATE_MATCHING,
  payload: { vacancyId, employeeId, state, showBubble, expiresAt }
})

const clearMatchingsBubbles = (vacancyId) => ({
  type: actionTypes.CLEAR_MATCHINGS_BUBBLES,
  payload: { vacancyId }
})

const goToMatchedProfile = (vacancyId, employeeId) => ({
  type: actionTypes.GO_TO_MATCHED_PROFILE,
  payload: { vacancyId, employeeId }
})

const stopApplicantCounter = (vacancyId, employeeId) => ({
  type: actionTypes.STOP_APPLICANT_COUNTER,
  payload: { vacancyId, employeeId }
})

const updateFromPusher = (vacancyId, employeeId) => ({
  type: actionTypes.UPDATE_FROM_PUSHER_UPDATE,
  payload: { vacancyId, employeeId }
})

const sealCandidate = (candidate) => ({
  type: actionTypes.SEAL_CANDIDATE_REQUEST,
  payload: { candidate }
})

const removeCandidate = (candidate) => ({
  type: actionTypes.REMOVE_CANDIDATE_REQUEST,
  payload: { candidate }
})

const removeCandidateSuccess = (vacancyId, employeeId) => ({
  type: actionTypes.REMOVE_CANDIDATE_SUCCESS,
  payload: { vacancyId, employeeId }
})

const matchingsPushNotification = (vacancyId, employeeId) => ({
  type: actionTypes.MATCHINGS_PUSH_NOTIFICATION,
  payload: { vacancyId, employeeId }
})

export {
  getMatchingsRequest,
  getMatchingsSuccess,
  updateMatching,
  clearMatchingsBubbles,
  goToMatchedProfile,
  stopApplicantCounter,
  updateFromPusher,
  sealCandidate,
  removeCandidate,
  removeCandidateSuccess,
  matchingsPushNotification
}
