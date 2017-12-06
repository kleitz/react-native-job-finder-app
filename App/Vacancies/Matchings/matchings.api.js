import api from 'config/Api'

const getMatchings = (recruiterId) => api.get(`/api/recruiters/${recruiterId}/matchings`)

const getEmployeeData = (employeeId) => api.get(`/api/employees/${employeeId}`)

const sealCandidate = ({recruiterId, vacancyId, employeeId}) =>
  api.post(`/api/recruiters/${recruiterId}/pre_screen_candidate`, {
    vacancy_id: vacancyId,
    employee_id: employeeId,
    decision: 'accept'
  })

const removeCandidate = ({recruiterId, vacancyId, employeeId}) =>
  api.post(`/api/recruiters/${recruiterId}/pre_screen_candidate`, {
    vacancy_id: vacancyId,
    employee_id: employeeId,
    decision: 'deny'
  })

export {
  getMatchings,
  getEmployeeData,
  sealCandidate,
  removeCandidate
}
