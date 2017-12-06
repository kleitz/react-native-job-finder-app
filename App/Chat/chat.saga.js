import humps from 'humps'
import { Actions } from 'react-native-router-flux'
import { NativeModules, Platform } from 'react-native'
import { setChatRooms, setRoomMessages, setCurrentEmployeeProfile } from './chat.actions'
import { setRefreshChatRoomsLoader } from '../Utility/loaders/loaders.actions'
import { take, call, put, fork, select, takeLatest } from 'redux-saga/effects'

import API from './chat.api'
import * as types from './chat.constants'
import bugsnag from '../Config/BugsnagConfig'
const OpenTok = Platform.OS === 'ios' ? NativeModules.OpenTokIOS : NativeModules.OpenTokAndroid

export function * fetchRooms () {
  try {
    bugsnag.leaveBreadcrumb('Fetch chat rooms request')
    yield put(setRefreshChatRoomsLoader(true))
    let apiResponse = yield call(API.getRooms)

    if (apiResponse.ok) {
      bugsnag.leaveBreadcrumb('Fetch chat rooms success')
      let mappedArr = apiResponse.data.map(item => humps.camelizeKeys(item))
      yield put(setChatRooms(mappedArr))
      yield put(setRefreshChatRoomsLoader(false))
      return mappedArr
    }
  } catch (err) {
    console.tron.log(err)
    bugsnag.notify(err, report => {
      report.metadata.type = 'Fetch Rooms flow'
    })
  }
}

export function * fetchRoomMessages (action) {
  try {
    bugsnag.leaveBreadcrumb('Fetch chat room messages request', { action })
    let apiResponse = yield call(API.getRoomMessages, action.payload.roomId)
    if (apiResponse.ok) {
      bugsnag.leaveBreadcrumb('Fetch chat room messages success')

      let camelizedRes = humps.camelizeKeys(apiResponse.data)
      camelizedRes.messages = camelizedRes.messages.filter(item => !item.body.includes(`class='videochat-invitation'`))
      yield put(setRoomMessages(camelizedRes))
      return camelizedRes
    }
  } catch (err) {
    console.tron.log(err)
    bugsnag.notify(err, report => {
      report.metadata.type = 'Fetch Room Messages flow'
    })
  }
}

export function * fetchRoomMessagesAndGo (action) {
  try {
    bugsnag.leaveBreadcrumb('Fetch room messages from push notification - request', { action })
    let apiResponse = yield call(API.getRoomMessages, action.payload.roomId)
    if (apiResponse.ok) {
      bugsnag.leaveBreadcrumb('Fetch room messages from push notification - success')
      let camelizedRes = humps.camelizeKeys(apiResponse.data)
      camelizedRes.messages = camelizedRes.messages.filter(item => !item.body.includes(`class='videochat-invitation'`))

      yield put(setRoomMessages(camelizedRes))
      yield call(Actions.chatRoom, { roomId: Number(action.payload.roomId) })
    }
  } catch (err) {
    console.tron.log(err)
    bugsnag.notify(err, report => {
      report.metadata.type = 'Fetch Room Messages flow'
    })
  }
}

export function * sendMessage (action) {
  try {
    bugsnag.leaveBreadcrumb('Send chat message - request', { action })
    let apiResponse = yield call(API.sendMessage, action.payload.roomId, action.payload.message)
    if (apiResponse.ok) {
      bugsnag.leaveBreadcrumb('Send chat message - success')
      let signalMessage = {
        messageId: apiResponse.data.id,
        body: apiResponse.data.body,
        createdAt: apiResponse.data.created_at.toString(),
        messageRead: true,
        fromEmployee: apiResponse.data.from_employee
      }
      yield call(OpenTok.sendMessage, `textMessage`, JSON.stringify(signalMessage), err => console.log('sendMessage >>', err))
    }
  } catch (err) {
    console.tron.log(err)
    bugsnag.notify(err, report => {
      report.metadata.type = 'Send Message flow'
    })
  }
}

export function * fetchCurrentEmployeeProfileAndGo (action) {
  try {
    bugsnag.leaveBreadcrumb('Fetch current employee data - request', { action })

    const employeeId = action.payload.employeeId
    const apiResponse = yield call(API.getEmployeeProfile, employeeId)

    if (apiResponse.ok) {
      bugsnag.leaveBreadcrumb('Employee fetch - success')
      yield put(setCurrentEmployeeProfile(humps.camelizeKeys(apiResponse.data)))
      yield call(Actions.candidateProfile, { fromChat: true })
    } else {
      bugsnag.leaveBreadcrumb('Employee fetch - failed')
      bugsnag.notify(new Error(apiResponse), report => {
        report.metadata.type = 'Fetch current employee data flow - server error'
      })
    }
  } catch (err) {
    bugsnag.notify(err, report => {
      report.metadata.type = 'Fetch current employee data flow'
    })
  }
}

export default function * root () {
  yield takeLatest(types.FETCH_ROOMS_REQUEST, fetchRooms)
  yield takeLatest(types.FETCH_ROOM_MESSAGES_REQUEST, fetchRoomMessages)
  yield takeLatest(types.FETCH_ROOM_MESSAGES_REQUEST_GO, fetchRoomMessagesAndGo)
  yield takeLatest(types.SEND_MESSAGE_REQUEST, sendMessage)
  yield takeLatest(types.FETCH_CURRENT_EMPLOYEE_PROFILE_AND_GO, fetchCurrentEmployeeProfileAndGo)
}
