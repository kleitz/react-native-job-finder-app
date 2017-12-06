import { fromJS } from 'immutable'
import { capitalize } from 'lodash'
import I18n from 'react-native-i18n'
import { createSelector } from 'reselect'

const mapCandidateProfile = ({
  id, firstName, lastName, educations, experiences, city, country, shortDescription, applied, languages,
  hasCar, hasLicence, profilePicture, profileHeaderPicture, accepted, workAddress, rating
}) => {
  const getFullName = (first = '', last = '') => `${capitalize(first)} ${last[0].toUpperCase()}.`
  const getSpotlightedItem = collection => {
    if (!collection.length) {
      return null
    } else {
      const spotlighted = collection.filter(item => item.spotlight)[0]
      return !!spotlighted
        ? spotlighted
        : collection[0]
    }
  }
  const getAddress = (city, country) => [city, country].filter(i => !!i).join(', ')
  const getAboveMediumLanguages = languages =>
    Object.entries(languages)
      .filter(l => l[1] && ['medium', 'good'].includes(l[1].toLowerCase()))
      .map(lang => capitalize(lang[0].substr(0, 2)))
      .join(', ')
  const getCarDetails = (hasCar, hasLicence) => {
    if (hasCar && hasLicence) {
      return I18n.t(`screenCandidates.carAndLicence`)
    } else if (hasCar && !hasLicence) {
      return I18n.t(`screenCandidates.onlyCar`)
    } else if (!hasCar && hasLicence) {
      return I18n.t(`screenCandidates.onlyLicence`)
    } else {
      return I18n.t(`screenCandidates.noCarAndLicence`)
    }
  }

  return {
    id,
    applied,
    accepted,
    shortDescription,
    profilePicture,
    profileHeaderPicture,
    languages,
    hasCar,
    hasLicence,
    educations,
    experiences,
    firstName,
    lastName,
    workAddress,
    rating,
    validLanguages: getAboveMediumLanguages(languages),
    fullName: getFullName(firstName, lastName),
    education: getSpotlightedItem(educations),
    experience: getSpotlightedItem(experiences),
    address: getAddress(city, country),
    carDetails: getCarDetails(hasCar, hasLicence)
  }
}

const _candidates = (state, vacancyId) => state.get('vacancies').get('candidates').get(vacancyId)

const _candidateById = (state, { vacancyId, candidateId, employee }) =>
  !!employee && typeof employee === 'object'
    ? fromJS(employee)
    : _candidates(state, vacancyId).find(c => c.get('id') === candidateId)

const getCandidates = createSelector(
  _candidates,
  candidates => !!candidates ? candidates.toJS().map(mapCandidateProfile) : []
)

const getCandidateInfo = createSelector(
  _candidateById,
  candidate => !!candidate ? mapCandidateProfile(candidate.toJS()) : {}
)

export default {
  getCandidates,
  getCandidateInfo
}
