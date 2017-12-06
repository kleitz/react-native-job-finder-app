import api from '../Config/Api'
import humps from 'humps'
const chatUrl = 'api/rooms'

let getRooms = () => api.get(chatUrl)

let getRoomMessages = (roomId) => api.get(`${chatUrl}/${roomId}`)

let sendMessage = (roomId, message) => api.post(`${chatUrl}/${roomId}/messages`, humps.decamelizeKeys(message))

let getEmployeeProfile = (employeeId) => api.get(`/api/employees/${employeeId}`)

export default {
  getRooms,
  getRoomMessages,
  sendMessage,
  getEmployeeProfile
}
