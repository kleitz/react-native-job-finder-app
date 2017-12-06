import * as actionTypes from './reviews.constants'

const getReviewsRequest = () => ({
  type: actionTypes.GET_REVIEWS_REQUEST
})

const getReviewsSuccess = (reviews) => ({
  type: actionTypes.GET_REVIEWS_SUCCESS,
  payload: { reviews }
})

const submitReviewRequest = (reviewId, punctuality, performance, description) => ({
  type: actionTypes.SUBMIT_REVIEW_REQUEST,
  payload: { reviewId, punctuality, performance, description }
})

const submitReviewSuccess = (reviewId) => ({
  type: actionTypes.SUBMIT_REVIEW_SUCCESS,
  payload: { reviewId }
})

const cancelReviewRequest = (reviewId) => ({
  type: actionTypes.CANCEL_REVIEW_REQUEST,
  payload: { reviewId }
})

const cancelReviewSuccess = (reviewId) => ({
  type: actionTypes.CANCEL_REVIEW_SUCCESS,
  payload: { reviewId }
})

const getEmployeeReviewRequest = (employeeId) => ({
  type: actionTypes.GET_EMPLOYEE_REVIEWS_REQUEST,
  payload: { employeeId }
})

const getEmployeeReviewSuccess = (reviews) => ({
  type: actionTypes.GET_EMPLOYEE_REVIEWS_SUCCESS,
  payload: { reviews }
})

const updateReview = (reviewId, isNew) => ({
  type: actionTypes.UPDATE_REVIEW,
  payload: { reviewId, isNew }
})

const seeAllReviews = () => ({
  type: actionTypes.SEEL_ALL_REVIEWS
})

const getPendingReviewsAndGo = (reviewId) => ({
  type: actionTypes.GET_PENDING_REVIEWS_AND_GO,
  payload: { reviewId }
})

const getSubmittedReviewsAndGo = (reviewId) => ({
  type: actionTypes.GET_SUBMITTED_REVIEWS_AND_GO,
  payload: { reviewId }
})

export {
  getReviewsRequest,
  getReviewsSuccess,
  //
  submitReviewRequest,
  submitReviewSuccess,
  //
  cancelReviewRequest,
  cancelReviewSuccess,
  //
  getEmployeeReviewRequest,
  getEmployeeReviewSuccess,
  //
  updateReview,
  seeAllReviews,
  //
  getPendingReviewsAndGo,
  getSubmittedReviewsAndGo
}
