import api from '../../Config/Api'

const getNotifications = () =>
  api.get(`/api/notifications`)

const markAllNotificationsAsRead = () =>
  api.put(`/api/notifications/mark_all_as_read`)

export default {
  getNotifications,
  markAllNotificationsAsRead
}
