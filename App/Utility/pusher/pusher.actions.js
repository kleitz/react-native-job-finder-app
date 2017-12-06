import * as actionTypes from './pusher.constants'

const sendMatchingData = (data) => ({
  type: actionTypes.SEND_MATCHING_DATA,
  payload: { data }
})

const sendMessageData = (data) => ({
  type: actionTypes.SEND_MESSAGE_DATA,
  payload: { data }
})

const bindPusherHandlers = () => ({
  type: actionTypes.BIND_PUSHER_HANDLERS
})

const unbindPusherHandlers = () => ({
  type: actionTypes.UNBIND_PUSHER_HANDLERS
})

const sendSubmittedReviewData = (data) => ({
  type: actionTypes.PUSHER_SUBMITTED_REVIEW_REQUEST,
  payload: { data }
})

const sendPendingReviewData = (data) => ({
  type: actionTypes.PUSHER_PENDING_REVIEW_REQUEST,
  payload: { data }
})

export {
  sendMatchingData,
  sendMessageData,
  bindPusherHandlers,
  unbindPusherHandlers,
  sendSubmittedReviewData,
  sendPendingReviewData
}
