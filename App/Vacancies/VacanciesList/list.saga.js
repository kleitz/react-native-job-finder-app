import I18n from 'react-native-i18n'
import { takeLatest, call, put } from 'redux-saga/effects'
import { Actions } from 'react-native-router-flux'

import bugsnag from '../../Config/BugsnagConfig'

import * as actions from './list.actions'
import * as actionTypes from './list.constants'
import { getVacancies, pauseVacancy, resumeVacancy } from './list.api'
import { getMatchingsRequest } from '../Matchings/matchings.actions'

import { fillEditVacancy } from '../../CreateVacancy/createVacancy.actions'

import { confirmationSaga } from '../../ConfirmationModal/confirmationModal.saga'
import { vacancyModalTypes } from '../../ConfirmationModal/confirmationModal.constants'

const itemOrder = {
  'active': 1,
  'paused': 2,
  'closed': 3
}

const sortByState = (a, b) => {
  if (itemOrder[a.state] > itemOrder[b.state]) return 1
  if (itemOrder[a.state] < itemOrder[b.state]) return -1
}

function * getVacanciesFlow () {
  try {
    bugsnag.leaveBreadcrumb('Get vacancies - request')
    const { ok, data: vacancies } = yield call(getVacancies)
    if (ok) {
      bugsnag.leaveBreadcrumb('Get vacancies - success')
      yield put(actions.setVacancies(vacancies.sort(sortByState)))
      yield put(getMatchingsRequest())
    }
  } catch (err) {
    bugsnag.notify(err, report => {
      report.metadata.type = 'Get vacancies flow'
    })
  }
}

function * editVacancyFlow (action) {
  const { vacancy } = action.payload

  try {
    bugsnag.leaveBreadcrumb('Edit vacancy - request', { action })
    yield put(fillEditVacancy(vacancy))
    yield call(Actions.createVacancy, { isEditing: true })
  } catch (err) {
    bugsnag.notify(err, report => {
      report.metadata.type = 'Edit vacancy flow'
    })
  }
}

function * pauseVacancyFlow (action) {
  const { id } = action.payload.vacancy
  const modalResult = yield call(confirmationSaga, {
    modalType: vacancyModalTypes.pauseVacancy,
    options: {
      dismissable: true,
      hasCancel: true,
      title: I18n.t(`confirmationModals.pauseVacancyTitle`),
      description: I18n.t(`confirmationModals.pauseVacancyDescription`)
    }
  })
  bugsnag.leaveBreadcrumb('Pause vacancy modal result', { modalResult })
  try {
    if (modalResult) {
      bugsnag.leaveBreadcrumb('Pause vacancy - request', { action })
      const { ok } = yield call(pauseVacancy, id)
      if (ok) {
        bugsnag.leaveBreadcrumb('Pause vacancy - success', { action })
        yield put(actions.pauseVacancySuccess(id))
      }
    }
  } catch (err) {
    bugsnag.notify(err, report => {
      report.metadata.type = 'Pause vacancy flow'
    })
  }
}

function * resumeVacancyFlow (action) {
  const { id } = action.payload.vacancy
  const modalResult = yield call(confirmationSaga, {
    modalType: vacancyModalTypes.resumeVacancy,
    options: {
      dismissable: true,
      hasCancel: true,
      title: I18n.t(`confirmationModals.resumeVacancyTitle`),
      description: I18n.t(`confirmationModals.resumeVacancyDescription`)
    }
  })
  bugsnag.leaveBreadcrumb('Resume vacancy modal result', { modalResult })
  try {
    if (modalResult) {
      bugsnag.leaveBreadcrumb('Resume vacancy - request', { action })
      const { ok } = yield call(resumeVacancy, id)
      if (ok) {
        bugsnag.leaveBreadcrumb('Resume vacancy - success', { action })
        yield put(actions.resumeVacancySuccess(id))
      }
    }
  } catch (err) {
    bugsnag.notify(err, report => {
      report.metadata.type = 'Resume vacancy flow'
    })
  }
}

function * reuseVacancyFlow (action) {
  const { vacancy } = action.payload
  vacancy.headerImageUrl = ''
  const modalResult = yield call(confirmationSaga, {
    modalType: vacancyModalTypes.reuseVacancy,
    options: {
      dismissable: true,
      hasCancel: true,
      title: I18n.t(`confirmationModals.reuseVacancyTitle`),
      description: I18n.t(`confirmationModals.reuseVacancyDescription`)
    }
  })
  bugsnag.leaveBreadcrumb('Reuse vacancy modal result', { modalResult })
  try {
    if (modalResult) {
      bugsnag.leaveBreadcrumb('Reuse vacancy - request', { action })
      bugsnag.leaveBreadcrumb('Reuse vacancy - success', { action })
      yield put(fillEditVacancy(vacancy, true))
      yield call(Actions.createVacancy, { isReusing: true })
    }
  } catch (err) {
    bugsnag.notify(err, report => {
      report.metadata.type = 'Reuse vacancy flow'
    })
  }
}

export default function * root () {
  yield takeLatest(actionTypes.GET_VACANCIES_REQUEST, getVacanciesFlow)
  yield takeLatest(actionTypes.EDIT_VACANCY_REQUEST, editVacancyFlow)
  yield takeLatest(actionTypes.PAUSE_VACANCY_REQUEST, pauseVacancyFlow)
  yield takeLatest(actionTypes.RESUME_VACANCY_REQUEST, resumeVacancyFlow)
  yield takeLatest(actionTypes.REUSE_VACANCY_REQUEST, reuseVacancyFlow)
}
