import * as actionTypes from './netInfo.constants'

const noInternetConnection = () => ({
  type: actionTypes.NO_INTERNET_CONNECTION
})

const hasInternetConnection = () => ({
  type: actionTypes.HAS_INTERNET_CONNECTION
})

const changeCodePushStatus = (status) => ({
  type: actionTypes.CHANGE_CODE_PUSH_STATUS,
  payload: { status }
})

export {
  hasInternetConnection,
  noInternetConnection,
  changeCodePushStatus
}
