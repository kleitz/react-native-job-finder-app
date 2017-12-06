import { Map } from 'immutable'
import * as actionTypes from './loaders.constants'

const initialState = Map({
  loadingOverlay: false,
  candidates: false,
  session: false,
  companyLogo: false,
  companyBanner: false,
  vacancy: false,
  refreshChatRooms: false,
  reviewsLoader: false
})

export default (state = initialState, action = {}) => {
  switch (action.type) {
    case actionTypes.SET_SESSION_LOADER:
      return state.set('session', action.payload.visibility)
    case actionTypes.SET_PROFILE_LOADER:
      return state.set(action.payload.loaderType, action.payload.visibility)
    case actionTypes.SET_VACANCY_LOADER:
      return state.set('vacancy', action.payload.visibility)
    case actionTypes.SET_REFRESH_CHAT_ROOMS:
      return state.set('refreshChatRooms', action.payload.visibility)
    case actionTypes.SET_LOADING_OVERLAY:
      return state.set('loadingOverlay', action.payload.visibility)
    case actionTypes.SET_LOADING_CANDIDATES:
      return state.set('candidates', action.payload.visibility)
    case actionTypes.SET_LOADING_REVIEWS:
      return state.set('reviewsLoader', action.payload.visibility)
    default:
      return state
  }
}
