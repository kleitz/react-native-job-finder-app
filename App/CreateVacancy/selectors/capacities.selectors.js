import { createSelector } from 'reselect'

const getCapacities = state => state.get('createVacancy').get('capacities')

const getOptionalInfo = createSelector(
  getCapacities,
  capacities => ({
    hasCar: capacities.get('hasCar'),
    hasLicence: capacities.get('hasLicence'),
    languages: capacities.get('languages')
  })
)

const getSkills = createSelector(
  getCapacities,
  capacities => capacities.get('skills').toJS()
)

const getNumberOfSelectedSkills = createSelector(
  getSkills,
  skills => skills.filter(s => s.selected).length
)

const getSelectedSkills = createSelector(
  getSkills,
  skills => skills.filter(s => s.selected).map(s => s.name).join(', ')
)

const getTraits = createSelector(
  getCapacities,
  capacities => capacities.get('traits').toJS()
)

const getNumberOfSelectedTraits = createSelector(
  getTraits,
  traits => traits.filter(t => t.selected).length
)

const getSelectedTraits = createSelector(
  getTraits,
  traits => traits.filter(t => t.selected).map(t => t.name).join(', ')
)

const hasTraits = createSelector(
  getTraits,
  traits => traits.filter(t => t.selected).length > 0
)

const getCapacitiesCheckStatus = createSelector(
  getNumberOfSelectedSkills,
  getNumberOfSelectedTraits,
  (skills, traits) => !!skills && !!traits
)

const getSelectedSkillsIds = createSelector(
  getSkills,
  skills => skills.filter(s => s.selected).map(s => s.id)
)

const getSelectedTraitsIds = createSelector(
  getTraits,
  traits => traits.filter(t => t.selected).map(t => t.id)
)

const getSelectedLanguagesNames = createSelector(
  getCapacities,
  capacities => capacities
    .get('languages')
    .entrySeq()
    .filter(e => e[1])
    .map(e => e[0]).toJS()
)

const capacitiesRequest = createSelector(
  getSelectedSkillsIds,
  getSelectedTraitsIds,
  getSelectedLanguagesNames,
  getOptionalInfo,
  (skillIds, traits, languages, car) => ({
    languages,
    skills: {
      required: skillIds
    },
    personalityTraitIds: traits,
    hasCar: car.hasCar,
    hasLicence: car.hasLicence
  })
)

export default {
  getOptionalInfo,
  getSkills,
  getNumberOfSelectedSkills,
  getSelectedSkills,
  getTraits,
  hasTraits,
  getNumberOfSelectedTraits,
  getSelectedTraits,
  getCapacitiesCheckStatus,
  capacitiesRequest
}
