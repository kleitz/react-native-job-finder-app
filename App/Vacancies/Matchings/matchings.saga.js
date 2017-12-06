import { camelizeKeys } from 'humps'
import I18n from 'react-native-i18n'
import { Actions } from 'react-native-router-flux'
import { takeLatest, put, call, select } from 'redux-saga/effects'

import bugsnag from '../../Config/BugsnagConfig'

import * as actions from './matchings.actions'
import { getSessionData } from '../../Session/session.selectors'
import matchingState, * as actionTypes from './matchings.constants'
import { getMatchings, getEmployeeData, sealCandidate, removeCandidate } from './matchings.api'

import { getRooms } from '../../Chat/chat.actions'
import { setLoadingOverlay } from '../../Utility/loaders/loaders.actions'
import { confirmationSaga } from '../../ConfirmationModal/confirmationModal.saga'
import { candidateModalTypes } from '../../ConfirmationModal/confirmationModal.constants'

const mapMatchingsAndSetBubble = (matchings, vacancyId, employeeId) =>
  matchings
    .map(m => camelizeKeys(m))
    .map(
      m => m.vacancyId === vacancyId && m.employeeId === employeeId
        ? {...m, showBubble: true}
        : m
    )

function * getMatchingsFlow() {
  const { id: recruiterId } = yield select(getSessionData)

  try {
    bugsnag.leaveBreadcrumb('Get matchings - request')
    const { ok, data: matchings } = yield call(getMatchings, recruiterId)
    if (ok) {
      bugsnag.leaveBreadcrumb('Get matchings - success')
      yield put(actions.getMatchingsSuccess(matchings.map(m => camelizeKeys(m))))
    }
  } catch (err) {
    bugsnag.notify(err, report => {
      report.metadata.type = 'Get matchings flow'
    })
  }
}

function * updateFromPusher(action) {
  const { id: recruiterId } = yield select(getSessionData)
  const { employeeId, vacancyId } = action.payload

  try {
    bugsnag.leaveBreadcrumb('Update matching from pusher', { action })
    const { ok, data: matchings } = yield call(getMatchings, recruiterId)
    if (ok) {
      const mappedMatchings = mapMatchingsAndSetBubble(matchings, vacancyId, employeeId)
      yield put(actions.getMatchingsSuccess(mappedMatchings))
      return 'done'
    }
  } catch (err) {
    bugsnag.notify(err, report => {
      report.metadata.type = 'Update from pusher flow'
    })
  }
}

function * goToMatchedProfileFlow(action) {
  const { vacancyId, employeeId } = action.payload
  try {
    bugsnag.leaveBreadcrumb('Go to matched profile - request', { action })
    yield put(setLoadingOverlay(true))
    const response = yield call(getEmployeeData, employeeId)
    if (response.ok) {
      bugsnag.leaveBreadcrumb('Go to matched profile - success')
      const employee = camelizeKeys(response.data)
      yield call(Actions.candidateProfile, { employee })
      yield put(actions.updateMatching({ vacancyId, employeeId, showBubble: false }))
    }
  } catch (err) {
    bugsnag.notify(err, report => {
      report.metadata.type = 'Go to matched profile'
    })
  } finally {
    yield put(setLoadingOverlay(false))
  }
}

function * sealCandidateFlow(action) {
  bugsnag.leaveBreadcrumb('Seal candidate flow')
  const { id: recruiterId } = yield select(getSessionData)
  const { vacancyId, employeeId, employeeName, employeeProfilePicture } = action.payload.candidate

  let options = {}

  if (I18n.locale.includes('en')) {
    options = {
      dismissable: true,
      hasCancel: true,
      title: I18n.t(`confirmationModals.sealAssistantTitle`),
      titleHighlight: employeeName,
      candidatePhoto: employeeProfilePicture,
      candidateName: employeeName
    }
  } else {
    options = {
      dismissable: true,
      hasCancel: true,
      title: I18n.t(`confirmationModals.sealAssistantTitle`, { candidate: employeeName }),
      candidatePhoto: employeeProfilePicture,
      candidateName: employeeName
    }
  }

  const modalResult = yield call(confirmationSaga, {
    modalType: candidateModalTypes.sealAssistant,
    options: options
  })
  bugsnag.leaveBreadcrumb('Seal modal response', { modalResult })
  if (modalResult) {
    try {
      bugsnag.leaveBreadcrumb('Seal candidate - request')
      const { ok } = yield call(sealCandidate, { recruiterId, vacancyId, employeeId })
      if (ok) {
        bugsnag.leaveBreadcrumb('Seal candidate - success')
        yield put(actions.updateMatching({
          vacancyId, employeeId, state: matchingState.SEALED
        }))
      }
    } catch (err) {
      bugsnag.notify(err, report => {
        report.metadata.type = 'Seal candidate flow'
      })
    }
  }
}

function * removeCandidateFlow(action) {
  bugsnag.leaveBreadcrumb('Seal candidate flow')
  const { id: recruiterId } = yield select(getSessionData)
  const { vacancyId, employeeId, employeeName, employeeProfilePicture } = action.payload.candidate

  let options = {}

  if (I18n.locale.includes('en')) {
    options = {
      hasCancel: true,
      title: I18n.t(`confirmationModals.removeApplicantTitle`),
      titleHighlight: employeeName,
      candidatePhoto: employeeProfilePicture,
      candidateName: employeeName
    }
  } else {
    options = {
      hasCancel: true,
      title: I18n.t(`confirmationModals.removeApplicantTitle`, { candidate: employeeName }),
      candidatePhoto: employeeProfilePicture,
      candidateName: employeeName
    }
  }

  const modalResult = yield call(confirmationSaga, {
    modalType: candidateModalTypes.removeAssistant,
    options: options
  })
  bugsnag.leaveBreadcrumb('Remove candidate modal response', { modalResult })
  if (modalResult) {
    try {
      bugsnag.leaveBreadcrumb('Remove candidate - request')
      const { ok } = yield call(removeCandidate, { recruiterId, vacancyId, employeeId })
      if (ok) {
        bugsnag.leaveBreadcrumb('Remove candidate - success')
        yield put(actions.removeCandidateSuccess(vacancyId, employeeId))
        yield put(getRooms())
      }
    } catch (err) {
      bugsnag.notify(err, report => {
        report.metadata.type = 'Remove candidate flow'
      })
    }
  }
}

function * handlePushNotification(action) {
  bugsnag.leaveBreadcrumb('Handle push notification', { action })
  const { id: recruiterId } = yield select(getSessionData)
  const { vacancyId, employeeId } = action.payload

  try {
    const { ok, data: matchings } = yield call(getMatchings, recruiterId)
    if (ok) {
      const mappedMatchings = mapMatchingsAndSetBubble(matchings, vacancyId, employeeId)
      yield put(actions.getMatchingsSuccess(mappedMatchings))
      yield call(Actions.manageApplicants, { vacancyId })
    }
  } catch (err) {
    bugsnag.notify(err, report => {
      report.metadata.type = 'Handle push notification flow'
    })
  }
}

export default function * root() {
  yield takeLatest(actionTypes.GET_MATCHINGS_REQUEST, getMatchingsFlow)
  yield takeLatest(actionTypes.UPDATE_FROM_PUSHER_UPDATE, updateFromPusher)
  yield takeLatest(actionTypes.GO_TO_MATCHED_PROFILE, goToMatchedProfileFlow)
  yield takeLatest(actionTypes.SEAL_CANDIDATE_REQUEST, sealCandidateFlow)
  yield takeLatest(actionTypes.REMOVE_CANDIDATE_REQUEST, removeCandidateFlow)
  yield takeLatest(actionTypes.MATCHINGS_PUSH_NOTIFICATION, handlePushNotification)
}
