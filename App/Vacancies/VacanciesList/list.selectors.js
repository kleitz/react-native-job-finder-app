import { createSelector } from 'reselect'

const _vacancies = state => state.get('vacancies').get('vacancies')

const _vacancyById = (state, vacancyId) => _vacancies(state).filter(v => v.get('id') === vacancyId)

const getVacancies = createSelector(
  _vacancies,
  vacancies => vacancies.toJS()
)

const getVacancyDetails = createSelector(
  _vacancyById,
  v => v.toJS()
)

export default {
  getVacancies,
  getVacancyDetails
}
