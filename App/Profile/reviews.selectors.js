import { createSelector } from 'reselect'

const getReviews = state => state.get('reviews')
const _getMyReviews = state => state.get('reviews').get('aboutMe')

const getMyReviews = createSelector(
  getReviews,
  reviews => reviews.get('aboutMe').toJS()
)

const getPendingReviews = createSelector(
  getReviews,
  reviews => reviews.get('pending').toJS()
)

const getRating = createSelector(
  _getMyReviews,
  reviews => {
    const reviewsSize = reviews.size
    let rating = 0

    reviews.forEach(review => {
      let reviewRating = review.get('scores').reduce((r, score) => r + score.get('value'), 0)
      rating += reviewRating / review.get('scores').size
    })

    return !!reviewsSize ? rating / reviewsSize : 0
  }
)

const getProfileBadge = createSelector(
  getReviews,
  reviews => {
    const numberOfPending = reviews.get('pending').size
    const numberOfNewReviews = reviews.get('aboutMe').filter(el => el.get('isNew')).size
    return numberOfPending + numberOfNewReviews
  }
)

const getTemporaryReviews = createSelector(
  getReviews,
  reviews => {
    const tempReviews = reviews.get('temporaryReviews')
    return !!tempReviews ? tempReviews.toJS() : []
  }
)

export {
  getPendingReviews,
  getMyReviews,
  getRating,
  getProfileBadge,
  getTemporaryReviews
}
