import api from '../Config/Api'

const getReviews = () => api.get(`/api/reviews`)

const submitReview = ({ reviewId, punctuality, performance, description }) =>
  api.put(
    `/api/reviews/${reviewId}`,
    {
      description,
      employee_punctuality: punctuality,
      employee_performance: performance
    }
  )

const getEmployeeReviews = (employeeId) => api.get(`/api/reviews?employee_id=${employeeId}`)

const cancelReview = (reviewId) => api.delete(`/api/reviews/${reviewId}`)

export {
  getReviews,
  submitReview,
  cancelReview,
  getEmployeeReviews
}
