import { createSelector } from 'reselect'

const mapToPickerOption = obj => ({
  label: obj.get('name'),
  value: obj.get('id')
})

const getInfo = state => state.get('createVacancy').get('generalInfo')
const getJobCategories = state => state.get('createVacancy').get('generalInfo').get('jobTypes').toJS()

const getGeneralInfo = createSelector(
  getInfo,
  info => ({
    name: info.get('name'),
    jobTermId: info.get('jobTermId'),
    jobTypeId: info.get('jobTypeId'),
    wageCents: info.get('wageCents')
  })
)

const hasJobTitle = createSelector(
  getInfo,
  info => !!info.get('name')
)

const hasJobCategory = createSelector(
  getJobCategories,
  categories => !!categories.filter(
    category => category && category.selected
  ).length
)

const hasAccessedWage = createSelector(
  getInfo,
  info => info.get('accessedWage')
)

const hasAccessedCapacities = createSelector(
  getInfo,
  info => info.get('accessedCapacities')
)

const getJobTypeId = createSelector(
  getInfo,
  info => {
    let selectedJob = info.get('jobTypes').toJS().filter(job => job.selected)
    if (selectedJob.length) {
      return selectedJob[0].id
    } else {
      return null
    }
  }
)

const getJobTerms = createSelector(
  getInfo,
  info => info.get('jobTerms').map(mapToPickerOption).toJS()
)

const getJobTypes = createSelector(
  getInfo,
  info => info.get('jobTypes').toJS()
)

const generalInfoCheckStatus = createSelector(
  getInfo,
  info => (
    !!info.get('name') &&
    !!info.get('jobTermId') &&
    !!info.get('jobTypeId')
  )
)

const hasTerm = createSelector(
  getInfo,
  info => !!info.get('jobTypeId')
)

const generalInfoRequest = createSelector(
  getInfo,
  info => ({
    id: info.get('id'),
    name: info.get('name'),
    jobTermId: info.get('jobTermId'),
    jobTypeId: info.get('jobTypeId'),
    wageCents: info.get('wageCents')
  })
)

export default {
  hasTerm,
  hasJobTitle,
  hasJobCategory,
  hasAccessedWage,
  hasAccessedCapacities,
  getJobTerms,
  getJobTypes,
  getJobTypeId,
  getGeneralInfo,
  generalInfoCheckStatus,
  generalInfoRequest
}
