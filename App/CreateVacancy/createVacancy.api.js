import I18n from 'react-native-i18n'
import api from '../Config/Api'

const locale = I18n.locale.substr(0, 2)

const getJobTerms = () =>
  api.get(`/api/job_terms`, { locale })

const getJobTypes = () =>
  api.get(`/api/job_types`, { locale })

const getJobImage = (jobTypeId, imageTypeId) =>
  api.get(`/api/job_types/${jobTypeId}/image?job_type_image_id=${imageTypeId}`)

const getSkills = (jobTypeId) =>
  api.get(`/api/job_types/${jobTypeId}/skills`)

const getTraits = () =>
  api.get(`/api/personality_traits`)

const createVacancy = (vacancy) => api.post(
  `/api/vacancies`,
  { vacancy }
)

const editVacancy = ({id, ...rest}) => {
  const payload = { vacancy: rest }

  if (rest.header_picture) {
    payload.remove_header_picture = true
  }

  return api.put(
    `/api/vacancies/${id}`,
    payload
  )
}

const getStockPhoto = (jobTypeId, jobImageId) =>
  api.get(`/api/job_types/${jobTypeId}/image`, {
    job_type_image_id: jobImageId
  })

export {
  getJobTerms,
  getJobTypes,
  getJobImage,
  getSkills,
  getTraits,
  createVacancy,
  editVacancy,
  getStockPhoto
}
