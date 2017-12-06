import * as actionTypes from './list.constants'

const addVacancy = (vacancy) => ({
  type: actionTypes.ADD_VACANCY,
  payload: { vacancy }
})

const setAnimatableOff = () => ({
  type: actionTypes.SET_ANIMATABLE_OFF
})

const getVacanciesRequest = () => ({
  type: actionTypes.GET_VACANCIES_REQUEST
})

const setVacancies = (vacancies) => ({
  type: actionTypes.SET_ALL_VACANCIES,
  payload: { vacancies: vacancies.map(v => ({ ...v, selected: false })) }
})

const setSelectedVacancy = (cardIndex) => ({
  type: actionTypes.SET_SELECTED_VACANCY,
  payload: { selectedVacancy: cardIndex }
})

const editVacancyRequest = (vacancy) => ({
  type: actionTypes.EDIT_VACANCY_REQUEST,
  payload: { vacancy }
})

const editVacancySuccess = (vacancy) => ({
  type: actionTypes.EDIT_VACANCY_SUCCESS,
  payload: { vacancy }
})

const pauseVacancyRequest = (vacancy) => ({
  type: actionTypes.PAUSE_VACANCY_REQUEST,
  payload: { vacancy }
})

const pauseVacancySuccess = (id) => ({
  type: actionTypes.PAUSE_VACANCY_SUCCESS,
  payload: { id }
})

const resumeVacancyRequest = (vacancy) => ({
  type: actionTypes.RESUME_VACANCY_REQUEST,
  payload: { vacancy }
})

const resumeVacancySuccess = (id) => ({
  type: actionTypes.RESUME_VACANCY_SUCCESS,
  payload: { id }
})

const reuseVacancyRequest = (vacancy) => ({
  type: actionTypes.REUSE_VACANCY_REQUEST,
  payload: { vacancy }
})

const reuseVacancySuccess = (vacancy) => ({
  type: actionTypes.ADD_VACANCY,
  payload: { vacancy }
})

export {
  addVacancy,
  setAnimatableOff,
  getVacanciesRequest,
  setVacancies,
  setSelectedVacancy,
  editVacancyRequest,
  editVacancySuccess,
  pauseVacancyRequest,
  pauseVacancySuccess,
  resumeVacancyRequest,
  resumeVacancySuccess,
  reuseVacancyRequest,
  reuseVacancySuccess
}
