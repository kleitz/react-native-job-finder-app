import { take, call, put, fork, select, takeLatest } from 'redux-saga/effects'

import * as types from './profile.constants'
import { changeFields } from './profile.actions'
import { setAuthState } from '../Session/session.actions'
import { getSessionData } from '../Session/session.selectors'

import API from './profile.api'
import bugsnag from '../Config/BugsnagConfig'

export function * changeFieldsFlow (action) {
  const { payload } = action
  try {
    bugsnag.leaveBreadcrumb('Change field - request', { action })
    const { id, authToken } = yield select(getSessionData)
    const apiResponse = yield call(API.updateProfile, {...payload, userId: id})
    if (apiResponse.ok) {
      bugsnag.leaveBreadcrumb('Change field - success', { action })
      yield call(API.instance.setHeaders, {
        'X-Recruiter-Email': apiResponse.data.email
      })
      yield put(setAuthState({id, email: apiResponse.data.email, authentication_token: authToken}))
      yield put(changeFields(apiResponse.data))
    }
  } catch (err) {
    console.tron.log(err)
    bugsnag.notify(err, report => {
      report.metadata.type = 'Change Fields Flow'
    })
  }
}

export default function * root () {
  yield takeLatest(types.CHANGE_FIELDS_REQUEST, changeFieldsFlow)
}
