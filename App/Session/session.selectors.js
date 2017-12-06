import { createSelector } from 'reselect'

const getSession = state => state.get('session')

const isAuthed = createSelector(
  getSession,
  session => !!session.get('authToken')
)

const getSessionError = createSelector(
  getSession,
  session => session.get('error')
)

const getSessionData = createSelector(
  getSession,
  session => ({
    id: session.get('id'),
    email: session.get('email'),
    authToken: session.get('authToken')
  })
)

const getRehydrateStatus = createSelector(
  getSession,
  session => session.get('isRehydrated')
)

const getRegistrationStatus = createSelector(
  getSession,
  session => !!session.get('registrationDone')
)

const getSessionErrors = createSelector(
  getSession,
  session => session.get('errors').toJS()
)

export {
  isAuthed,
  getSessionData,
  getSessionError,
  getRehydrateStatus,
  getRegistrationStatus,
  getSessionErrors
}
