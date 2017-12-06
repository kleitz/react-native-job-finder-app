import * as actionTypes from './loaders.constants'

export const setSessionLoader = visibility => ({
  type: actionTypes.SET_SESSION_LOADER,
  payload: { visibility }
})

export const setProfileLoader = (visibility, loaderType = 'companyLogo') => ({
  type: actionTypes.SET_PROFILE_LOADER,
  payload: { visibility, loaderType }
})

export const setVacancyLoader = visibility => ({
  type: actionTypes.SET_VACANCY_LOADER,
  payload: { visibility }
})

export const setRefreshChatRoomsLoader = visibility => ({
  type: actionTypes.SET_REFRESH_CHAT_ROOMS,
  payload: { visibility }
})

export const setLoadingOverlay = visibility => ({
  type: actionTypes.SET_LOADING_OVERLAY,
  payload: { visibility }
})

export const setLoadingCandidates = visibility => ({
  type: actionTypes.SET_LOADING_CANDIDATES,
  payload: { visibility }
})

export const setLoadingReviews = visibility => ({
  type: actionTypes.SET_LOADING_REVIEWS,
  payload: { visibility }
})
