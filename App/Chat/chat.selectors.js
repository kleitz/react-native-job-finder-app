import { createSelector } from 'reselect'

let getChat = state => state.get('chat')

let getRooms = createSelector(
  getChat,
  chat => chat.rooms
)

let getRoom = (state, roomId) => {
  let room = state.get('chat')
    .rooms
    .find(room => {
      return room.id === roomId
    })

  return room || {}
}

let getSession = createSelector(
  getChat,
  chat => chat.session
)

let getBadgeCounter = createSelector(
  getChat,
  chat => chat.rooms.filter(room => room.unreadCount > 0).length
)

let getEmployeeProfile = createSelector(
  getChat,
  chat => chat.currentEmployee
)

export default {
  getRooms,
  getRoom,
  getSession,
  getBadgeCounter,
  getEmployeeProfile
}
