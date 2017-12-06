import { camelizeKeys } from 'humps'
import { fromJS } from 'immutable'
import { delay } from 'redux-saga'
import { Actions, ActionConst } from 'react-native-router-flux'
import { put, call, takeLatest, select } from 'redux-saga/effects'

import * as API from './reviews.api'
import * as actions from './reviews.actions'
import bugsnag from '../Config/BugsnagConfig'
import * as actionTypes from './reviews.constants'
import { setLoadingReviews } from '../Utility/loaders/loaders.actions'
import { getPendingReviews } from './reviews.selectors'

function * getReviewsFlow() {
  let reviews = null
  bugsnag.leaveBreadcrumb('Get reviews flow')
  try {
    const { ok, data } = yield call(API.getReviews)
    if (ok) {
      reviews = camelizeKeys(data)
      yield put(actions.getReviewsSuccess(reviews))
    }
    return reviews
  } catch (err) {
    bugsnag.notify(err, report => {
      report.metadata.type = 'Get reviews'
    })
    return reviews
  }
}

export function * getReviewsAndSetNew(reviewId) {
  let reviews = null
  try {
    bugsnag.leaveBreadcrumb('Set new review')
    const { ok, data } = yield call(API.getReviews)
    reviews = fromJS(camelizeKeys(data))

    reviews = reviews.updateIn(
      ['aboutMe', reviews.get('aboutMe').findIndex(el => el.get('id') === reviewId)],
      v => v.set('isNew', true)
    )

    yield put(actions.getReviewsSuccess(reviews.toJS()))
  } catch (err) {
    console.log('Failed to get reviews and set the new flag.', err)
    bugsnag.notify(err, report => {
      report.metadata.type = 'Set new review'
    })
  }
}

function * submitReviewFlow(action) {
  bugsnag.leaveBreadcrumb('Submit review flow', { action })
  const { reviewId } = action.payload
  const pendingReviews = yield select(getPendingReviews)
  const numberOfRemainingReviews = pendingReviews.length

  try {
    yield put(setLoadingReviews(true))
    const response = yield call(API.submitReview, action.payload)
    if (response.ok) {
      yield put(actions.submitReviewSuccess(reviewId))
      if (numberOfRemainingReviews === 1) {
        yield call(Actions.profile, { type: ActionConst.RESET })
      } else {
        yield call(Actions.pop)
      }
    }
  } catch (err) {
    bugsnag.notify(err, report => {
      report.metadata.type = 'Submit review'
    })
  } finally {
    yield put(setLoadingReviews(false))
  }
}

function * cancelReviewFlow(action) {
  bugsnag.leaveBreadcrumb('Cancel review flow', { action })
  const { reviewId } = action.payload
  const pendingReviews = yield select(getPendingReviews)
  const numberOfRemainingReviews = pendingReviews.length

  try {
    yield put(setLoadingReviews(true))
    const response = yield call(API.cancelReview, reviewId)
    if (response.ok) {
      yield put(actions.cancelReviewSuccess(reviewId))
      if (numberOfRemainingReviews === 1) {
        yield call(Actions.profile, { type: ActionConst.RESET })
      } else {
        yield call(Actions.pop)
      }
    }
  } catch (err) {
    bugsnag.notify(err, report => {
      report.metadata.type = 'Cancel review'
    })
  } finally {
    yield put(setLoadingReviews(false))
  }
}

function * getEmployeeReviewsFlow(action) {
  bugsnag.leaveBreadcrumb('Get employee reviews', { action })
  const { employeeId } = action.payload

  try {
    const { ok, data: { about_me: employeeReviews } } = yield call(API.getEmployeeReviews, employeeId)

    yield put(actions.getEmployeeReviewSuccess(employeeReviews))
  } catch (err) {
   bugsnag.notify(err, report => {
      report.metadata.type = 'Get employee reviews'
    })
  }
}

function * submittedReviewAndGoFlow(action) {
  bugsnag.leaveBreadcrumb('Go to about me reviews from push notification')

  try {
    const resp = yield call(getReviewsFlow)
    if (resp) {
      yield call(Actions.reviewsOfMe)
    }
  } catch (err) {
    bugsnag.notify(err, report => {
      report.metadata.type = 'Go to reviews from push notification'
    })
  }
}

function * pendingReviewAndGoFlow(action) {  
  bugsnag.leaveBreadcrumb('Go to pending reviews from push notification')
  const { reviewId } = action.payload

  try {
    const reviews = yield call(getReviewsFlow)

    if(!!reviews) {
      const review = reviews.find(r => r.id === reviewId)
      if (!!review) {
        yield call(Actions.giveReview, { review })
      }
    }
  } catch (err) {
    bugsnag.notify(err, report => {
      report.metadata.type = 'Go to pending reviews from push notification'
    })
  }
}

export default function * root() {
  yield takeLatest(actionTypes.GET_REVIEWS_REQUEST, getReviewsFlow)
  yield takeLatest(actionTypes.SUBMIT_REVIEW_REQUEST, submitReviewFlow)
  yield takeLatest(actionTypes.CANCEL_REVIEW_REQUEST, cancelReviewFlow)
  yield takeLatest(actionTypes.GET_EMPLOYEE_REVIEWS_REQUEST, getEmployeeReviewsFlow)
  yield takeLatest(actionTypes.GET_SUBMITTED_REVIEWS_AND_GO, submittedReviewAndGoFlow)
  yield takeLatest(actionTypes.GET_PENDING_REVIEWS_AND_GO, pendingReviewAndGoFlow)
}
