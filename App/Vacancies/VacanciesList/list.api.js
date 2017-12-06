import api from 'config/Api'

const getVacancies = (state) => api.get(`/api/vacancies`, { state })

const pauseVacancy = (id) => api.delete(`/api/vacancies/${id}`)

const resumeVacancy = (id) => api.put(`/api/vacancies/${id}/reactivate`)

export {
  getVacancies,
  pauseVacancy,
  resumeVacancy
}
