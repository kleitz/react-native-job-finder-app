import * as actionTypes from './chat.constants'
import { LOGOUT_SUCCESS } from '../Session/session.constants'

const initialState = {
  rooms: [],
  session: {},
  currentEmployee: {}
}

export default (state = initialState, action = {}) => {
  let foundIndex
  switch (action.type) {
    case actionTypes.SET_ROOMS:
      let rooms = state.rooms
      let newRooms = []

      action.payload.rooms.forEach((payloadItem) => {
        let found = rooms.find(stateItem => stateItem.id === payloadItem.id)

        if (found) {
          let item = Object.assign({}, payloadItem, found)
          // quick fix start
          item.unreadCount = payloadItem.unreadCount || found.unreadCount
          item.latestMessageTime = payloadItem.latestMessageTime || found.latestMessageTime
          // quick fix end
          newRooms.push(item)
        } else {
          newRooms.push(payloadItem)
        }
      })

      return {
        rooms: newRooms,
        session: state.session
      }
    case actionTypes.SET_ROOM_MESSAGES:
      foundIndex = state.rooms.findIndex(item => {
        return item.id === action.payload.id
      })

      return {
        ...state,
        rooms: [
          ...state.rooms.slice(0, foundIndex),
          {
            ...state.rooms[foundIndex],
            messages: action.payload.messages,
            tokboxToken: action.payload.tokboxToken,
            sessionId: action.payload.sessionId
          },
          ...state.rooms.slice(foundIndex + 1)
        ]
      }
    case actionTypes.ADD_MESSAGE:
      foundIndex = state.rooms.findIndex(item => {
        return item.id === action.payload.roomId
      })

      return {
        ...state,
        rooms: [
          ...state.rooms.slice(0, foundIndex),
          {
            ...state.rooms[foundIndex],
            messages: [
              ...state.rooms[foundIndex].messages,
              action.payload.message
            ]
          },
          ...state.rooms.slice(foundIndex + 1)
        ]
      }
    case actionTypes.SET_SESSION:
      return {
        ...state,
        session: action.payload.session
      }
    case actionTypes.SET_ROOM_BUBBLE:
      foundIndex = state.rooms.findIndex(item => {
        return item.id === action.payload.roomId
      })

      return {
        ...state,
        rooms: [
          ...state.rooms.slice(0, foundIndex),
          {
            ...state.rooms[foundIndex],
            unreadCount: action.payload.counter
          },
          ...state.rooms.slice(foundIndex + 1)
        ]
      }
    case actionTypes.SET_CURRENT_EMPLOYEE_PROFILE:
      return {
        ...state,
        currentEmployee: action.payload
      }
    case LOGOUT_SUCCESS:
      return initialState
    default:
      return state
  }
}
