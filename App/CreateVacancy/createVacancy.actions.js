import humps from 'humps'
import DeviceInfo from 'react-native-device-info'
import * as actionTypes from './createVacancy.constants'

const locale = DeviceInfo.getDeviceLocale().substr(0, 2)

const toTagFormat = obj => ({
  id: obj.id,
  name: ['en', 'nl'].includes(locale) ? obj.nameTranslations[locale] : obj.nameTranslations.en,
  selected: false
})

/* ----- General info ----- */
const setJobTypesAndTerms = (terms, types) => ({
  type: actionTypes.SET_TYPES_AND_TERMS,
  payload: { terms, types }
})

const updateJobTypes = (updatedCategories) => ({
  type: actionTypes.UPDATE_JOB_TYPES,
  payload: updatedCategories
})

const changeGeneralInfoFields = (payload) => ({
  type: actionTypes.GENERAL_CHANGE_FIELDS,
  payload
})

const accessedScreen = (payload) => ({
  type: actionTypes.ACCESSSED_SCREEN,
  payload
})

const changeJobType = () => ({
  type: actionTypes.CHANGE_JOB_TYPE
})

const changeDescriptionFields = (key, value) => ({
  type: actionTypes.DESCRIPTION_CHANGE_FIELDS,
  payload: { key, value }
})

const changeVacancyPhoto = ({url, cloudinaryResource, jobTypeId}) => ({
  type: actionTypes.SET_VACANCY_PHOTO,
  payload: { url, cloudinaryResource, jobTypeId }
})

const changeScheduleType = (scheduleType) => ({
  type: actionTypes.CHANGE_SCHEDULE_TYPE,
  payload: { scheduleType }
})

const addDayToSchedule = () => ({
  type: actionTypes.ADD_DAY
})

const changeDate = (dateType = 'startDate', index = 0, date) => ({
  type: actionTypes.CHANGE_DATE,
  payload: { date, dateType, index }
})

const changeTimes = (timeType = 'startHour', index = 0, time) => ({
  type: actionTypes.CHANGE_TIMES,
  payload: { time, timeType, index }
})

const toggleDay = (day) => ({
  type: actionTypes.TOGGLE_DAY,
  payload: { day }
})

const toggleCarData = (key) => ({
  type: actionTypes.TOGGLE_CAR_DATA,
  payload: { key }
})

const toggleLanguage = (language) => ({
  type: actionTypes.TOGGLE_LANGUAGE_DATA,
  payload: { language }
})

/* ----- Other capacities ----- */
const setSkills = (skills) => ({
  type: actionTypes.SET_SKILLS,
  payload: {
    skills: humps.camelizeKeys(skills).map(toTagFormat)
  }
})

const setTraits = (traits) => ({
  type: actionTypes.SET_TRAITS,
  payload: {
    traits: humps.camelizeKeys(traits).map(toTagFormat)
  }
})

const toggleSkills = (id) => ({
  type: actionTypes.TOGGLE_SKILLS_DATA,
  payload: { id }
})

const toggleTraits = (id) => ({
  type: actionTypes.TOGGLE_TRAITS_DATA,
  payload: { id }
})

const changeLocationField = (address) => ({
  type: actionTypes.LOCATION_CHANGE_FIELD,
  payload: { address }
})

const publishVacancy = () => ({
  type: actionTypes.PUBLISH_VACANCY
})

const clearVacancy = () => ({
  type: actionTypes.CLEAR_VACANCY
})

const fillEditVacancy = (vacancy, isReusing) => ({
  type: actionTypes.FILL_EDIT_VACANCY,
  payload: { vacancy, isReusing }
})

const submitEdit = () => ({
  type: actionTypes.SUBMIT_EDIT
})

const submitReuse = () => ({
  type: actionTypes.SUBMIT_REUSE
})

const getStockPhotoRequest = () => ({
  type: actionTypes.GENERATE_STOCK_REQUEST
})

const markJobCategoryAsSelected = () => ({
  type: actionTypes.MARK_JOB_CATEGORY_AS_SELECTED
})

export {
  accessedScreen,
  setJobTypesAndTerms,
  updateJobTypes,
  changeJobType,
  changeGeneralInfoFields,
  toggleCarData,
  toggleLanguage,
  setSkills,
  toggleSkills,
  setTraits,
  toggleTraits,
  changeScheduleType,
  addDayToSchedule,
  changeDate,
  changeTimes,
  toggleDay,
  changeLocationField,
  changeDescriptionFields,
  changeVacancyPhoto,
  publishVacancy,
  clearVacancy,
  fillEditVacancy,
  submitEdit,
  submitReuse,
  getStockPhotoRequest,
  markJobCategoryAsSelected
}
