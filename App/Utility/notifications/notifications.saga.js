import { camelizeKeys } from 'humps'
import { delay, throttle } from 'redux-saga'
import { takeLatest, put, call, select } from 'redux-saga/effects'

import api from './notifications.api'
import * as actionTypes from './notifications.constants'

import { getSessionData } from '../../Session/session.selectors'
import { getMatchings } from '../../Vacancies/Matchings/matchings.api'
import { getMatchingsSuccess } from '../../Vacancies/Matchings/matchings.actions'

function * fetchNotifications() {
  const { id: recruiterId } = yield select(getSessionData)
  try {
    const { ok: notifOk, data: notifData } = yield call(api.getNotifications)
    const { ok: matchingsOk, data: matchingsData } = yield call(getMatchings, recruiterId)

    const notifications = notifData
      .map(n => camelizeKeys(n))
      .filter(n => n.notificationType === 'AcceptedInvitation')
    let matchings = matchingsData.map(m => camelizeKeys(m))

    notifications.forEach(n => {
      matchings = matchings.map(
        m => m.id === n.matchingId
          ? { ...m, showBubble: true }
          : m
      )
    })

    yield put(getMatchingsSuccess(matchings))
    yield call(api.markAllNotificationsAsRead)
  } catch (err) {
    console.err(err)
  }
}

export default function * root() {
  yield takeLatest(actionTypes.FETCH_NOTIFICATIONS_REQUEST, fetchNotifications)
}
