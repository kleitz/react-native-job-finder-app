import bugsnag from '../Config/BugsnagConfig'
import * as constants from './chat.constants'

export const getRooms = () => ({
  type: constants.FETCH_ROOMS_REQUEST
})

export const setChatRooms = (rooms) => ({
  type: constants.SET_ROOMS,
  payload: { rooms }
})

export const getRoomMessages = (roomId) => ({
  type: constants.FETCH_ROOM_MESSAGES_REQUEST,
  payload: { roomId }
})

export const getRoomMessagesAndGo = (roomId) => ({
  type: constants.FETCH_ROOM_MESSAGES_REQUEST_GO,
  payload: { roomId }
})

export const setRoomMessages = (room) => ({
  type: constants.SET_ROOM_MESSAGES,
  payload: room
})

export const sendMessage = (roomId, message) => ({
  type: constants.SEND_MESSAGE_REQUEST,
  payload: { roomId, message }
})

export const addMessage = (roomId, message) => ({
  type: constants.ADD_MESSAGE,
  payload: { roomId, message }
})

export const setSession = (session) => ({
  type: constants.SET_SESSION,
  payload: { session }
})

export const setRoomBubble = (roomId, counter) => ({
  type: constants.SET_ROOM_BUBBLE,
  payload: { roomId, counter }
})

export const fetchCurrentEmployeeProfileAndGo = (employeeId) => ({
  type: constants.FETCH_CURRENT_EMPLOYEE_PROFILE_AND_GO,
  payload: { employeeId }
})

export const setCurrentEmployeeProfile = (employeeProfile) => ({
  type: constants.SET_CURRENT_EMPLOYEE_PROFILE,
  payload: employeeProfile
})
