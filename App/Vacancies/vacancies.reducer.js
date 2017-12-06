import { combineReducers } from 'redux-immutable'

import vacancies from './VacanciesList/list.reducer'
import matchings from './Matchings/matchings.reducer'
import candidates from './Candidates/candidates.reducer'

export default combineReducers({
  candidates,
  matchings,
  vacancies
})
