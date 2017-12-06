import api from 'config/Api'

const getCandidates = (recruiterId, vacancyId, other = false) =>
  api.get(`/api/recruiters/${recruiterId}/candidates_for_vacancy`, {
    vacancy_id: vacancyId,
    other
  })

const acceptCandidate = ({recruiterId, vacancyId, employeeId}) =>
  api.post(`/api/recruiters/${recruiterId}/pre_screen_candidate`, {
    vacancy_id: vacancyId,
    employee_id: employeeId,
    decision: 'accept'
  })

const denyCandidate = ({recruiterId, vacancyId, employeeId}) =>
  api.post(`/api/recruiters/${recruiterId}/pre_screen_candidate`, {
    vacancy_id: vacancyId,
    employee_id: employeeId,
    decision: 'deny'
  })

const getEmployee = (employeeId) => api.get(`/api/employees/${employeeId}`)

export {
  getCandidates,
  acceptCandidate,
  denyCandidate,
  getEmployee
}
