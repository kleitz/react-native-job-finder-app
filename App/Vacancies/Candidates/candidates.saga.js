import moment from 'moment'
import { isEmpty } from 'lodash'
import { camelizeKeys } from 'humps'
import { Actions } from 'react-native-router-flux'
import { takeLatest, takeEvery, select, call, put } from 'redux-saga/effects'

import bugsnag from '../../Config/BugsnagConfig'

import * as actions from './candidates.actions'
import * as actionTypes from './candidates.constants'
import { getCandidates, acceptCandidate, denyCandidate } from './candidates.api'

import chatAPI from '../../Chat/chat.api'
import { fetchRooms, fetchRoomMessages } from '../../Chat/chat.saga'

import { getSessionData } from '../../Session/session.selectors'
import { confirmationSaga } from '../../ConfirmationModal/confirmationModal.saga'
import { vacancyModalTypes } from '../../ConfirmationModal/confirmationModal.constants'
import { updateMatching, getMatchingsRequest, removeCandidateSuccess } from '../Matchings/matchings.actions'

import { setLoadingCandidates, setLoadingOverlay } from '../../Utility/loaders/loaders.actions'

function * getCandidatesFlow(action) {
  const { id: recruiterId } = yield select(getSessionData)
  const { vacancyId } = action.payload
  yield call(Actions.screenCandidates, { vacancyId })
  yield put(setLoadingCandidates(true))
  try {
    bugsnag.leaveBreadcrumb('Get candidates - request', { action })
    const { ok, data: candidates } = yield call(getCandidates, recruiterId, vacancyId)
    if (ok) {
      bugsnag.leaveBreadcrumb('Get candidates - success')
      yield put(actions.getCandidatesSuccess(vacancyId, candidates.filter(c => !isEmpty(c)).map(c => camelizeKeys(c))))
    }
  } catch (err) {
    bugsnag.notify(err, report => {
      report.metadata.type = 'Get candidates flow'
    })
  } finally {
    yield put(setLoadingCandidates(false))
  }
}

function * acceptCandidateFlow(action) {
  const { id: recruiterId } = yield select(getSessionData)
  const {
    vacancyId,
    candidate: { id: employeeId, applied, profilePicture, fullName, firstName, lastName }
  } = action.payload
  if (applied) {
    yield put(setLoadingOverlay(true))
  }
  yield put(actions.removeCandidate(vacancyId, employeeId))
  try {
    bugsnag.leaveBreadcrumb('Accept candidate - request', { action })
    const { ok } = yield call(acceptCandidate, { recruiterId, vacancyId, employeeId })
    if (ok) {
      yield put(setLoadingOverlay(false))
      bugsnag.leaveBreadcrumb('Accept candidate - success')
      if (applied) {
        bugsnag.leaveBreadcrumb('Show candidate match modal')
        yield put(updateMatching({
          vacancyId, employeeId, state: 'accepted', showBubble: true,
          expiresAt: moment.utc(moment().add(2, 'd').toArray()).toISOString()
        }))

        const redirectToChat = yield call(confirmationSaga, {
          modalType: vacancyModalTypes.matchModal,
          options: {
            dismissable: false,
            hasCancel: true,
            candidatePhoto: profilePicture,
            candidateName: fullName
          }
        })

        const rooms = yield call(fetchRooms)
        if (redirectToChat) {
          bugsnag.leaveBreadcrumb('Redirect to chat room')
          const room = rooms.find(r => r.employeeFirstName === firstName && r.employeeLastName === lastName)
          const messages = yield call(fetchRoomMessages, { payload: { roomId: room.id } })
          yield call(Actions.chatRoom, { roomId: room.id })
        }
      }
    }
  } catch (err) {
    bugsnag.notify(err, report => {
      report.metadata.type = 'Accept candidate flow'
    })
  } finally {
    yield put(setLoadingOverlay(false))
  }
}

function * denyCandidateFlow(action) {
  const { id: recruiterId } = yield select(getSessionData)
  const { vacancyId, candidate: { id: employeeId, applied } } = action.payload

  yield put(actions.removeCandidate(vacancyId, employeeId))
  try {
    bugsnag.leaveBreadcrumb('Deny candidate - request', { action })
    const { ok } = yield call(denyCandidate, { recruiterId, vacancyId, employeeId })
    if (ok && applied) {
      yield put(removeCandidateSuccess(vacancyId, employeeId))
    }
  } catch (err) {
    bugsnag.notify(err, report => {
      report.metadata.type = 'Deny candidate flow'
    })
  }
}

export default function * root() {
  yield takeLatest(actionTypes.GET_CANDIDATES_REQUEST, getCandidatesFlow)
  yield takeEvery(actionTypes.ACCEPT_CANDIDATE, acceptCandidateFlow)
  yield takeEvery(actionTypes.DENY_CANDIDATE, denyCandidateFlow)
}
