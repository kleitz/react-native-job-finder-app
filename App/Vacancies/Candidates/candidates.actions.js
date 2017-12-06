import * as actionTypes from './candidates.constants'

const getCandidatesRequest = (vacancyId) => ({
  type: actionTypes.GET_CANDIDATES_REQUEST,
  payload: { vacancyId }
})

const getCandidatesSuccess = (vacancyId, candidates) => ({
  type: actionTypes.GET_CANDIDATES_SUCCESS,
  payload: { vacancyId, candidates }
})

const acceptCandidate = (vacancyId, candidate) => ({
  type: actionTypes.ACCEPT_CANDIDATE,
  payload: { vacancyId, candidate }
})

const denyCandidate = (vacancyId, candidate) => ({
  type: actionTypes.DENY_CANDIDATE,
  payload: { vacancyId, candidate }
})

const removeCandidate = (vacancyId, candidateId) => ({
  type: actionTypes.REMOVE_CANDIDATE,
  payload: { vacancyId, candidateId }
})

export {
  getCandidatesRequest,
  getCandidatesSuccess,
  acceptCandidate,
  denyCandidate,
  removeCandidate
}
