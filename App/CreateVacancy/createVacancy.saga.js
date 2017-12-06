import humps from 'humps'
import { delay } from 'redux-saga'
import I18n from 'react-native-i18n'
import { Actions, ActionConst } from 'react-native-router-flux'
import { put, call, takeLatest, select } from 'redux-saga/effects'

import selectors from './createVacancy.selectors'
import { setLoadingOverlay, setVacancyLoader } from '../Utility/loaders/loaders.actions'
import { setSkills, clearVacancy, changeVacancyPhoto } from './createVacancy.actions'
import { getSkills, createVacancy, editVacancy, getStockPhoto } from './createVacancy.api'
import {
  addVacancy, setAnimatableOff, editVacancySuccess, reuseVacancySuccess, setSelectedVacancy
} from '../Vacancies/VacanciesList/list.actions'
import { CHANGE_JOB_TYPE, PUBLISH_VACANCY, SUBMIT_EDIT, SUBMIT_REUSE, GENERATE_STOCK_REQUEST } from './createVacancy.constants'

import bugsnag from '../Config/BugsnagConfig'
import { confirmationSaga } from '../ConfirmationModal/confirmationModal.saga'
import { vacancyModalTypes } from '../ConfirmationModal/confirmationModal.constants'

export function * getSkillsFlow () {
  const id = yield select(selectors.generalInfo.getJobTypeId)
  try {
    bugsnag.leaveBreadcrumb('Get skills - request')
    const skills = yield call(getSkills, id)
    if (skills.ok) {
      bugsnag.leaveBreadcrumb('Get skills - success')
      yield put(setSkills(skills.data))
    }
  } catch (err) {
    bugsnag.notify(err, report => {
      report.metadata.type = 'Get Skill Flow'
    })
  }
}

export function * publishVacancyFlow () {
  try {
    bugsnag.leaveBreadcrumb('Publish vacancy - request')
    yield put(setLoadingOverlay(true))
    const payload = yield select(selectors.createPublishPayload)
    const requestPayload = humps.decamelizeKeys(payload)
    const { ok, data: vacancy } = yield call(createVacancy, requestPayload)
    if (ok) {
      bugsnag.leaveBreadcrumb('Publish vacancy - success')
      yield put(addVacancy(vacancy))
      yield call(Actions.tabs, {type: ActionConst.RESET})
      yield put(clearVacancy())
      yield delay(500)
      yield put(setAnimatableOff())

      yield call(confirmationSaga, {
        modalType: vacancyModalTypes.publishedVacancy,
        options: {
          dismissable: true,
          hasCancel: false,
          title: I18n.t(`confirmationModals.${vacancyModalTypes.publishedVacancy}Title`),
          description: I18n.t(`confirmationModals.${vacancyModalTypes.publishedVacancy}Description`)
        }
      })
    }
  } catch (err) {
    bugsnag.notify(err, report => {
      report.metadata.type = 'Publish Vacancy Flow'
    })
  } finally {
    yield put(setLoadingOverlay(false))
  }
}

export function * editVacancyFlow () {
  try {
    bugsnag.leaveBreadcrumb('Edit vacancy - request')
    yield put(setLoadingOverlay(true))
    const vacancy = humps.decamelizeKeys(yield select(selectors.createPublishPayload))

    if (vacancy.header_picture === null) {
      delete vacancy.header_picture
      delete vacancy.job_type_image_id
    }

    const apiResponse = yield call(editVacancy, vacancy)
    if (apiResponse.ok) {
      bugsnag.leaveBreadcrumb('Edit vacancy - success')
      yield put(editVacancySuccess(apiResponse.data))
      yield call(Actions.tabs, {type: ActionConst.RESET})
      yield put(clearVacancy())
      yield put(setAnimatableOff())

      yield call(confirmationSaga, {
        modalType: vacancyModalTypes.editedVacancy,
        options: {
          dismissable: true,
          hasCancel: false,
          title: I18n.t(`confirmationModals.${vacancyModalTypes.editedVacancy}Title`),
          description: null
        }
      })
    }
  } catch (err) {
    bugsnag.notify(err, report => {
      report.metadata.type = 'Edit Vacancy Flow'
    })
  } finally {
    yield put(setLoadingOverlay(false))
  }
}

export function * reuseVacancyFlow () {
  try {
    bugsnag.leaveBreadcrumb('Reuse vacancy - request')
    yield put(setLoadingOverlay(true))
    const vacancy = humps.decamelizeKeys(yield select(selectors.createPublishPayload))
    const apiResponse = yield call(createVacancy, vacancy)
    if (apiResponse.ok) {
      bugsnag.leaveBreadcrumb('Reuse vacancy - success')
      yield put(reuseVacancySuccess(apiResponse.data))
      yield call(Actions.tabs, {type: ActionConst.RESET})
      yield put(clearVacancy())
      yield put(setAnimatableOff())
      yield put(setVacancyLoader(false))

      yield call(confirmationSaga, {
        modalType: vacancyModalTypes.publishedVacancy,
        options: {
          dismissable: true,
          hasCancel: false,
          title: I18n.t(`confirmationModals.${vacancyModalTypes.publishedVacancy}Title`),
          description: I18n.t(`confirmationModals.${vacancyModalTypes.publishedVacancy}Description`)
        }
      })
    }
  } catch (err) {
    bugsnag.notify(err, report => {
      report.metadata.type = 'Reuse Vacancy Flow'
    })
  } finally {
    yield put(setLoadingOverlay(false))
  }
}

export function * generateStockPhotoFlow () {
  const { jobImageId, jobTypeId } = yield select(selectors.getStockPhotoInfo)
  yield put(setVacancyLoader(true))
  try {
    bugsnag.leaveBreadcrumb('Generate stock photo - request')
    const apiResponse = yield call(getStockPhoto, jobTypeId, jobImageId)
    if (apiResponse.ok) {
      bugsnag.leaveBreadcrumb('Generate stock photo - success')
      const { jobTypeImageUrl, jobTypeImageId } = apiResponse.data
      yield put(changeVacancyPhoto({
        url: jobTypeImageUrl,
        cloudinaryResource: jobTypeImageUrl,
        jobTypeId: jobTypeImageId
      }))
    }
  } catch (err) {
    bugsnag.notify(err, report => {
      report.context = 'Create vacancy'
      report.errorMessage = 'Failed generating stock photo'
      report.severity = 'warning'
      report.metadata = { jobImageId, jobTypeId }
    })
  } finally {
    yield put(setVacancyLoader(false))
  }
}

export default function * root () {
  yield takeLatest(PUBLISH_VACANCY, publishVacancyFlow)
  yield takeLatest(CHANGE_JOB_TYPE, getSkillsFlow)
  yield takeLatest(SUBMIT_EDIT, editVacancyFlow)
  yield takeLatest(SUBMIT_REUSE, reuseVacancyFlow)
  yield takeLatest(GENERATE_STOCK_REQUEST, generateStockPhotoFlow)
}
