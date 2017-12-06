import { delay, throttle } from 'redux-saga'
import { takeLatest, put, call } from 'redux-saga/effects'

import { store } from '../../App'
import * as actionTypes from './pusher.constants'
import bugsnag from '../../Config/BugsnagConfig'
import pusher, { connectPusher } from './pusher.api'
import { sendMatchingData, sendMessageData, sendPendingReviewData, sendSubmittedReviewData } from './pusher.actions'

import reviewAPI from '../../Profile/reviews.api'
import { getRooms } from '../../Chat/chat.actions'
import { updateMatching, getMatchingsRequest, updateFromPusher } from '../../Vacancies/Matchings/matchings.actions'
import { updateReview, getReviewsRequest } from '../../Profile/reviews.actions'
import { getReviewsAndSetNew } from '../../Profile/reviews.saga'

const matchingPusherAlert = data => { store.dispatch(sendMatchingData(data)) }
const messagePusherAlert = data => { store.dispatch(sendMessageData(data)) }

const pendingReviewPusherAlert = data => {
  console.log('pending pusher', data)
  store.dispatch(sendPendingReviewData(data))
}
const submittedReviewPusherAlert = data => {
  store.dispatch(sendSubmittedReviewData(data))
}

function * pusherMessageFlow(action) {
  bugsnag.leaveBreadcrumb('Pusher text message flow')
  const { notificationType } = action.payload.data
  if (notificationType === 'textMessage') {
    yield put(getRooms())
  }
}

function * pusherMatchingFlow(action) {
  bugsnag.leaveBreadcrumb('Pusher matching flow')
  const { employeeId, notificationType, vacancyId } = action.payload.data
  switch (notificationType) {
    case 'EmployeeApplied':
      yield put(getMatchingsRequest())
      break
    case 'AcceptedInvitation':
      yield put(updateFromPusher(vacancyId, employeeId))
      break
    default:
      return
  }
}

function * pusherPendingReviewFlow(action) {
  bugsnag.leaveBreadcrumb('Pusher pending review flow')
  const { reviewId } = action.payload
  yield put(getReviewsRequest())
}

function * pusherSubmittedReviewFlow(action) {
  bugsnag.leaveBreadcrumb('Pusher submitted review flow')
  const { reviewId } = action.payload.data

  yield call(getReviewsAndSetNew, reviewId)
}

function * bindPusherHandlers() {
  pusher.channel.bind('matching-alert', matchingPusherAlert)
  pusher.channel.bind('message-alert', messagePusherAlert)
  pusher.channel.bind('pending-review', pendingReviewPusherAlert)
  pusher.channel.bind('submitted-review', submittedReviewPusherAlert)
}

function * unbindPusherHandlers() {
  pusher.channel.unbind('matching-alert', matchingPusherAlert)
  pusher.channel.unbind('message-alert', messagePusherAlert)
  pusher.channel.unbind('pending-review', pendingReviewPusherAlert)
  pusher.channel.unbind('submitted-review', submittedReviewPusherAlert)
}

export function * connectPusherSaga (id) {
  yield call(connectPusher, id)
  yield call(bindPusherHandlers)
}

export default function * root() {
  yield takeLatest(actionTypes.SEND_MATCHING_DATA, pusherMatchingFlow)
  yield takeLatest(actionTypes.SEND_MESSAGE_DATA, pusherMessageFlow)
  yield takeLatest(actionTypes.BIND_PUSHER_HANDLERS, bindPusherHandlers)
  yield takeLatest(actionTypes.UNBIND_PUSHER_HANDLERS, unbindPusherHandlers)
  yield takeLatest(actionTypes.PUSHER_PENDING_REVIEW_REQUEST, pusherPendingReviewFlow)
  yield takeLatest(actionTypes.PUSHER_SUBMITTED_REVIEW_REQUEST, pusherSubmittedReviewFlow)
}
