// @flow

import { combineReducers } from 'redux-immutable'
import configureStore from './Config/CreateStore'
import rootSaga from './App.saga'

import session from './Session/session.reducer'
import profile from './Profile/profile.reducer'
import vacancies from './Vacancies/vacancies.reducer'
import loaders from './Utility/loaders/loaders.reducer'
import netInfo from './Utility/netInfo/netInfo.reducer'
import push from './Utility/pushNotifications/push.reducer'
import createVacancy from './CreateVacancy/createVacancy.reducer'
import confirmationModal from './ConfirmationModal/confirmationModal.reducer'
import chat from './Chat/chat.reducer'
//
import reviews from './Profile/reviews.reducer'

export const rootReducer = combineReducers({
  createVacancy,
  confirmationModal,
  loaders,
  netInfo,
  profile,
  push,
  session,
  vacancies,
  chat,
  //
  reviews
})

export default (reducer = rootReducer) => {
  /* ------------- Assemble The Reducers ------------- */
  return configureStore(rootReducer, rootSaga)
}
