import {all} from 'redux-saga/effects';
import matchingsSaga from './Matchings/matchings.saga'
import vacancyListSaga from './VacanciesList/list.saga'
import candidatesSaga from './Candidates/candidates.saga'

export default function * root () {
  yield all([
    candidatesSaga(),
    matchingsSaga(),
    vacancyListSaga()
  ])
}
