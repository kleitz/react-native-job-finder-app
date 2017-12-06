import api from '../../Config/Api'

const registerDevice = (id, deviceInfo) =>
  api.post(`/api/recruiters/${id}/devices`, {...deviceInfo})

const unregisterDevice = (id, deviceToken) =>
  api.delete(`/api/recruiters/${id}/devices/${deviceToken}`)

const setPushNotificationsLocale = (id, deviceToken, locale) =>
  api.put(`/api/recruiters/${id}/devices/${deviceToken}?locale=${locale}`)

export {
  registerDevice,
  unregisterDevice,
  setPushNotificationsLocale
}
