import { fromJS, List } from 'immutable'
import {
  TOGGLE_CAR_DATA, TOGGLE_LANGUAGE_DATA, TOGGLE_SKILLS_DATA, TOGGLE_TRAITS_DATA,
  SET_TRAITS, SET_SKILLS, CLEAR_VACANCY, FILL_EDIT_VACANCY
} from '../createVacancy.constants'

import { LOGOUT_SUCCESS } from '../../Session/session.constants'

const initialState = fromJS({
  skills: List(),
  traits: List(),
  hasCar: false,
  hasLicence: false,
  languages: {
    english: false,
    dutch: false,
    french: false,
    german: false
  }
})

const preserveSelected = (prev, next) =>
  !prev
    ? next
    : prev.get('selected')
      ? prev
      : prev.merge(next)

export default (state = initialState, action = {}) => {
  switch (action.type) {
    case SET_SKILLS:
      return state.set('skills', fromJS(action.payload.skills))
    case SET_TRAITS:
      return state.update(
        'traits',
        t => t.mergeWith(preserveSelected, action.payload.traits)
      )
    case TOGGLE_CAR_DATA:
      return state.updateIn([action.payload.key], v => !v)
    case TOGGLE_LANGUAGE_DATA:
      return state.updateIn(['languages', action.payload.language], v => !v)
    case TOGGLE_SKILLS_DATA:
      return state.updateIn(
        ['skills', state.get('skills').findIndex(skill => skill.get('id') === action.payload.id), 'selected'],
        v => !v
      )
    case TOGGLE_TRAITS_DATA:
      return state.updateIn(
        ['traits', state.get('traits').findIndex(trait => trait.get('id') === action.payload.id), 'selected'],
        v => !v
      )
    case FILL_EDIT_VACANCY:
      const { hasCar, hasLicence, languages, personality_traits, skills: vacancySkills } = action.payload.vacancy
      const selectedLanguages = languages.split(', ')
      return state.withMutations(
        s => s
          .set('hasCar', hasCar)
          .set('hasLicence', hasLicence)
          .updateIn(
            ['traits'],
            traits => traits.map(t => t.merge({
              selected: personality_traits.includes(t.get('id'))
            }))
          )
          .updateIn(
            ['skills'],
            skills => skills.map(s => s.merge({
              selected: vacancySkills.includes(s.get('id'))
            }))
          )
          .update('languages', languages => fromJS({
              english: !!selectedLanguages.filter(lang => ['Engels', 'English'].includes(lang)).length,
              dutch: !!selectedLanguages.filter(lang => ['Nederlands', 'Dutch'].includes(lang)).length,
              french: !!selectedLanguages.filter(lang => ['Frans', 'French'].includes(lang)).length,
              german: false
            })
          )
      )
    case CLEAR_VACANCY:
      return state.merge({
        skills: List(),
        hasCar: false,
        hasLicence: false,
        languages: {
          english: false,
          dutch: false,
          french: false,
          german: false
        }}).updateIn(['traits'], t => t.map(ti => ti.merge({selected: false})))
    case LOGOUT_SUCCESS:
      return initialState
    default:
      return state
  }
}
