import test from 'ava'

import * as selectors from '../session.selectors'

const mockStore = {
  session: {
    id: 23,
    email: 'martijn@hotmail.be',
    error: 'some error here',
    authToken: '123abc',
    isRehydrated: true 
  }
}

test('Session Selectors -> get authentication status', t => {
  t.true(selectors.isAuthed(mockStore))
})

test('Session Selectors -> get session data', t => {
  t.deepEqual(
    selectors.getSessionData(mockStore),
    {
      id: 23,
      email: 'martijn@hotmail.be',
      authToken: '123abc'
    }
  )
})

test('Session Selectors -> get session error', t => {
  t.deepEqual(
    selectors.getSessionError(mockStore),
    'some error here'
  )
})

test('Session Selectors -> get rehydration status', t => {
  t.true(selectors.getRehydrateStatus(mockStore))
})
