import humps from 'humps'
import FCM, { FCMEvent } from 'react-native-fcm'
import DeviceInfo from 'react-native-device-info'
import { Actions } from 'react-native-router-flux'
import { takeLatest, call, select, put } from 'redux-saga/effects'

import { setDeviceInfo } from './push.actions'
import * as actionTypes from './push.constants'
import { getDeviceInfo } from './push.selectors'
import BugsnagClient from '../../Config/BugsnagConfig'
import { getSessionData } from '../../Session/session.selectors'
import { registerDevice, setPushNotificationsLocale } from './push.api'

import { getRoomMessagesAndGo } from '../../Chat/chat.actions'
import { getCandidatesRequest } from '../../Vacancies/Candidates/candidates.actions'
import { matchingsPushNotification } from '../../Vacancies/Matchings/matchings.actions'
import { getPendingReviewsAndGo, getSubmittedReviewsAndGo } from '../../Profile/reviews.actions'

import { store } from '../../App'

const createDevicePayload = (deviceToken) => ({
  deviceToken,
  brand: DeviceInfo.getManufacturer(),
  model: DeviceInfo.getModel(),
  systemName: DeviceInfo.getSystemName(),
  systemVersion: DeviceInfo.getSystemVersion(),
  name: DeviceInfo.getDeviceName(),
  uuid: DeviceInfo.getUniqueID()
})

function redirect (notif) {
  console.log('redirect notification', notif)
  switch (notif.notificationType) {
    case 'AcceptedInvitation':
      store.dispatch(matchingsPushNotification(Number(notif.vacancyId), Number(notif.employeeId)))
      break
    case 'EmployeeApplied':
      store.dispatch(getCandidatesRequest(Number(notif.vacancyId)))
      break
    case 'textMessage':
      store.dispatch(getRoomMessagesAndGo(notif.roomId))
      break
    case 'pending-review':
      store.dispatch(getPendingReviewsAndGo(Number(notif.reviewId)))
      break
    case 'submitted-review':
      store.dispatch(getSubmittedReviewsAndGo(Number(notif.reviewId)))
      break
  }
}

function * addEventHandlers () {

  FCM.getInitialNotification().then( notif => {
    if (notif && notif.opened_from_tray) {
      redirect(notif)
    }
  })

  FCM.on(FCMEvent.Notification, async (notif) => {
    if (notif && notif.opened_from_tray) {
      redirect(notif)
    }
  })
}

export function * pushNotificationsConfigFlow () {
  try {
    const { id } = yield select(getSessionData)
    yield call(FCM.requestPermissions)
    const deviceToken = yield call(FCM.getFCMToken)
    const deviceInfo = createDevicePayload(deviceToken)
    console.tron.log(deviceInfo)
    if (deviceInfo.model !== 'Simulator') {
      yield put(setDeviceInfo(deviceInfo))
      yield call(registerDevice, id, humps.decamelizeKeys(deviceInfo))

      BugsnagClient.leaveBreadcrumb('Registered Device', {
        type: 'log',
        deviceInfo: deviceInfo
      })

      yield call(setPushNotificationsLocale, id, deviceToken, DeviceInfo.getDeviceLocale().substr(0, 2))
      yield call(addEventHandlers)
    }
  } catch (err) {
    console.tron.log(err)
    BugsnagClient.notify(err, report => {
      report.metadata.type = 'Push Notifications Config Flow'
    })
  }
}

export default function * root () {
  yield takeLatest(actionTypes.PUSH_CONFIG_REQUEST, pushNotificationsConfigFlow)
}
