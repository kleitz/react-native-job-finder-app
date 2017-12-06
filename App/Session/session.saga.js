import humps from 'humps'
import I18n from 'react-native-i18n'
import {all} from 'redux-saga/effects';
import { AsyncStorage } from 'react-native'
import { Actions, ActionConst } from 'react-native-router-flux'
import { put, take, call, fork, select, takeLatest } from 'redux-saga/effects'

import API from './session.api'
import bugsnag from '../Config/BugsnagConfig'

import profileAPI from '../Profile/profile.api'
import * as sessionTypes from './session.constants'
import * as sessionActions from './session.actions'
import * as sessionSelectors from './session.selectors'

import { getReviewsRequest } from '../Profile/reviews.actions'
import { changeFields } from '../Profile/profile.actions'
import { getCompanyInfo, getAccountInfo } from '../Profile/profile.selectors'
import { registerDeviceRequest } from '../Utility/pushNotifications/push.actions'
import { setSessionLoader, setVacancyLoader } from '../Utility/loaders/loaders.actions'

import { connectPusherSaga } from '../Utility/pusher/pusher.saga'
import { setLoadingOverlay } from '../Utility/loaders/loaders.actions'
import { unregisterDevice } from '../Utility/pushNotifications/push.api'
import { getDeviceInfo } from '../Utility/pushNotifications/push.selectors'
import { connectPusher, disconnectPusher } from '../Utility/pusher/pusher.api'
import { getInternetStatus } from '../Utility/netInfo/netInfo.selectors'

import {
  setJobTypesAndTerms,
  setTraits,
  clearVacancy
} from '../CreateVacancy/createVacancy.actions'
import { getJobTerms, getJobTypes, getTraits } from '../CreateVacancy/createVacancy.api'

import { getRooms } from '../Chat/chat.actions'
import { getVacanciesRequest, setSelectedVacancy } from '../Vacancies/VacanciesList/list.actions'

export function* getJobTypesAndTermsFlow() {
  try {
    bugsnag.leaveBreadcrumb('Get job types and terms - request')
    const [terms, types, traits] = yield all([call(getJobTerms), call(getJobTypes), call(getTraits)])

    if (terms.ok && types.ok && traits.ok) {
      bugsnag.leaveBreadcrumb('Get job types and terms - success')
      yield put(setJobTypesAndTerms(terms.data, types.data))
      yield put(setTraits(traits.data))
    }
  } catch (err) {
    bugsnag.notify(err, report => {
      report.metadata.type = 'Get Job Types and Terms Flow'
    })
  }
}

export function* authorize({ company, email, password, confirmPassword, isRegistering }) {
  yield put(setSessionLoader(true))
  try {
    bugsnag.leaveBreadcrumb('Authorize request', { company, email, isRegistering })
    let apiResponse
    if (isRegistering) {
      apiResponse = yield call(API.register, { company, email, password, confirmPassword })
    } else {
      apiResponse = yield call(API.login, { email, password })
    }
    return apiResponse
  } catch (err) {
    yield put(sessionActions.requestError(err))

    bugsnag.notify(err, report => {
      report.metadata.type = 'Authorize Flow'
    })

    return false
  } finally {
    yield put(setSessionLoader(false))
  }
}

export function* loginFlow(action) {
  const { payload } = action
  try {
    bugsnag.leaveBreadcrumb('Login request', { action })
    const apiResponse = yield call(authorize, { ...payload, isRegistering: false })
    if (apiResponse.ok) {
      const { id, email, authentication_token } = apiResponse.data
      yield call(API.api.setHeaders, {
        'X-Recruiter-Token': authentication_token,
        'X-Recruiter-Email': email
      })
      yield call(connectPusherSaga, id)
      const profileResponse = yield call(profileAPI.getProfile, id)
      if (profileResponse.ok) {
        yield put(changeFields(profileResponse.data))
      }
      yield put(clearVacancy())
      yield put(sessionActions.setAuthState(apiResponse.data))
      yield put(registerDeviceRequest())
      yield call(getJobTypesAndTermsFlow)
      yield put(getVacanciesRequest())
      yield put(getReviewsRequest())
      yield call(Actions.tabs, { type: ActionConst.RESET })
    } else {
      yield put(sessionActions.setSessionError('login', true))
    }
  } catch (err) {
    bugsnag.notify(err, report => {
      report.metadata.type = 'Login flow'
    })
    yield put(sessionActions.clearAuthToken())
    yield call(Actions.initialScreen, { type: ActionConst.RESET })
  }
}

export function* registerFlow(action) {
  const { payload } = action
  try {
    bugsnag.leaveBreadcrumb('Register flow request', { action })
    const apiResponse = yield call(authorize, { ...payload, isRegistering: true })
    if (apiResponse.ok) {
      const { id, email, authentication_token } = apiResponse.data
      yield call(API.api.setHeaders, {
        'X-Recruiter-Token': authentication_token,
        'X-Recruiter-Email': email
      })
      yield put(clearVacancy())
      yield put(sessionActions.setAuthState(apiResponse.data))
      yield call(connectPusherSaga, id)
      yield put(registerDeviceRequest())
      yield call(getJobTypesAndTermsFlow)
      yield put(getReviewsRequest())

      bugsnag.leaveBreadcrumb('Register flow completed succesfully, redirecting to logo screen', {
        type: 'log'
      })

      yield call(Actions.logoScreen, { type: ActionConst.RESET })
    } else {
      if ('email' in apiResponse.data) {
        yield put(sessionActions.setSessionError('email', true))
      }
      if (apiResponse.status === 422 && apiResponse.data.company_name) {
        yield put(sessionActions.setSessionError('companyName', true))
      }
    }
  } catch (err) {
    bugsnag.notify(err, report => {
      report.metadata.type = 'Register flow'
    })
    yield put(sessionActions.clearAuthToken())
    yield call(Actions.initialScreen, { type: ActionConst.RESET })
  }
}

export function* startupFlow() {
  bugsnag.leaveBreadcrumb('Startup flow')
  const authState = yield select(sessionSelectors.isAuthed)
  if (authState) {
    const { id, email, authToken } = yield select(sessionSelectors.getSessionData)
    const { firstName, lastName } = yield select(getAccountInfo)

    bugsnag.setUser(id.toString(), `${firstName} ${lastName}`, email)

    yield put(setLoadingOverlay(true))
    yield call(API.api.setHeaders, {
      'X-Recruiter-Token': authToken,
      'X-Recruiter-Email': email
    })
    yield call(connectPusherSaga, id)
    try {
      bugsnag.leaveBreadcrumb('Getting using data - request')
      const apiResponse = yield call(profileAPI.getProfile, id)
      if (apiResponse.ok) {
        yield put(changeFields(apiResponse.data))
      }
      yield put(clearVacancy())
      yield put(setSelectedVacancy(-1))
      yield put(registerDeviceRequest())
      yield call(getJobTypesAndTermsFlow)
      yield put(getVacanciesRequest())
      yield put(getRooms())
      yield put(getReviewsRequest())
      yield call(Actions.tabs, { type: ActionConst.RESET })

      bugsnag.leaveBreadcrumb('Completed startup flow redirecting to tabs now', {
        type: 'log',
        userEmail: email
      })
    } catch (err) {
      console.log('startup flow error', err)
      bugsnag.notify(err, report => {
        report.metadata.type = 'Startup flow'
      })
      yield put(sessionActions.clearAuthToken())
      yield call(Actions.initialScreen, { type: ActionConst.RESET })
    } finally {
      yield put(setLoadingOverlay(false))
    }
  }
}

function* redirectOnForegroundFlow() {
  const authState = yield select(sessionSelectors.isAuthed)
  if (authState) {
    yield call(Actions.tabs, { type: ActionConst.RESET })
  }
}

export function* logoutFlow() {
  const hasInternet = yield select(getInternetStatus)
  const { deviceToken, model } = yield select(getDeviceInfo)

  try {
    yield put(setSessionLoader(true))

    if (!hasInternet) {
      yield put(sessionActions.logoutError(I18n.t('logoutNoInternet')))
    } else {
      const { id } = yield select(sessionSelectors.getSessionData)

      if (model !== 'Simulator') {
        yield call(unregisterDevice, id, deviceToken)
      }

      const { ok } = yield call(API.logout)
      if (ok) {
        yield call(disconnectPusher)
        yield put(sessionActions.logoutSuccess())

        bugsnag.leaveBreadcrumb(
          'Logout flow completed succesfully redirecting to initial screen.',
          {
            type: 'log'
          }
        )

        yield call(Actions.initialScreen, { type: ActionConst.RESET })
      }
    }
  } catch (err) {
    bugsnag.notify(err, report => {
      report.metadata.type = 'Logout flow'
    })
  } finally {
    yield put(setSessionLoader(false))
  }
}

export default function* root() {
  yield takeLatest(sessionTypes.LOGIN_REQUEST, loginFlow)
  yield takeLatest(sessionTypes.REGISTER_REQUEST, registerFlow)
  yield takeLatest(sessionTypes.APP_STARTUP, startupFlow)
  yield takeLatest(sessionTypes.REDIRECT_ON_FOREGROUND, redirectOnForegroundFlow)
  yield takeLatest(sessionTypes.LOGOUT_REQUEST, logoutFlow)
}
