import { createSelector } from 'reselect'

import vacancies from './VacanciesList/list.selectors'
import matchings from './Matchings/matchings.selectors'
import candidates from './Candidates/candidates.selectors'

const getVacancyTabBadges = createSelector(
  vacancies.getVacancies,
  matchings.getAllMatchings,
  (vacancies, matchings) => vacancies.filter(
      vacancy => {
        const vacancyMatchings = matchings.filter(m => m.vacancyId === vacancy.id)
        return !!vacancyMatchings.filter(m => m.state === 'pending' || m.showBubble).length
      }
    ).length
)

export default {
  candidates,
  matchings,
  vacancies,
  getVacancyTabBadges
}
