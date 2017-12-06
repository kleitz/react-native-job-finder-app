import { createSelector } from 'reselect'
import matchingStatus from './matchings.constants'

const _matchings = state => state.get('vacancies').get('matchings')

const _vacanyMatchings = (state, vacancyId) => _matchings(state).filter(m => m.get('vacancyId') === vacancyId)

const getAllMatchings = createSelector(
  _matchings,
  m => m.toJS()
)

const getVacancyMatchings = createSelector(
  _vacanyMatchings,
  m => m.toJS()
)

const getPendingMatchings = createSelector(
  _vacanyMatchings,
  matchings => matchings.filter(m => m.get('state') === matchingStatus.PENDING).toJS()
)

const getAcceptedMatchings = createSelector(
  _vacanyMatchings,
  matchings => matchings.filter(m => m.get('state') === matchingStatus.ACCEPTED).toJS()
)

const getSealedMatchings = createSelector(
  _vacanyMatchings,
  matchings => matchings.filter(m => m.get('state') === matchingStatus.SEALED).toJS()
)

const getMatchingsWithBubble = createSelector(
  _vacanyMatchings,
  matchings => matchings.filter(m => m.get('showBubble')).toJS()
)

export default {
  getAllMatchings,
  getVacancyMatchings,
  getPendingMatchings,
  getAcceptedMatchings,
  getSealedMatchings,
  getMatchingsWithBubble
}
