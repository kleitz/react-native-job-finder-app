import * as actionTypes from './push.constants'

export const registerDeviceRequest = () => ({
  type: actionTypes.PUSH_CONFIG_REQUEST
})

export const unregisterDeviceRequest = () => ({
  type: actionTypes.UNREGISTER_DEVICE_REQUEST
})

export const setDeviceInfo = (deviceInfo) => ({
  type: actionTypes.SET_DEVICE_INFO,
  payload: { ...deviceInfo }
})
