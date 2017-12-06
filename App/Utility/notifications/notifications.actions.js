import * as actionTypes from './notifications.constants'

const fetchNotifications = () => ({
  type: actionTypes.FETCH_NOTIFICATIONS_REQUEST
})

export {
  fetchNotifications
}
