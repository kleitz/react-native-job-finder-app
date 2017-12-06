import { createSelector } from 'reselect'

import capacities from './selectors/capacities.selectors'
import description from './selectors/description.selectors'
import generalInfo from './selectors/generalInfo.selectors'
import location from './selectors/location.selectors'
import photo from './selectors/photo.selectors'
import schedule from './selectors/schedule.selectors'

const REQUIRED_STEPS = 9

const getCompleteStatus = createSelector(
  generalInfo.hasJobTitle,
  generalInfo.hasJobCategory,
  generalInfo.hasAccessedWage,
  generalInfo.hasAccessedCapacities,
  capacities.hasTraits,
  location.checkStatus,
  schedule.getScheduleCheckStatus,
  description.checkStatus,
  photo.getPhotoCheckStatus,
  (hasJobTitle, hasJobCategory, hasAccessedWage, hasAccessedCapacities, hasTraits, hasLocation, schedule, hasDescription, photo) => ({
    hasJobTitle,
    hasJobCategory,
    hasAccessedWage,
    hasAccessedCapacities,
    hasTraits,
    hasLocation,
    schedule,
    hasDescription,
    photo
  })
)

const getSteps = createSelector(
  getCompleteStatus,
  status => Object.values(status).filter(item => item).length
)

const getPublishStatus = createSelector(
  getSteps,
  steps => steps === REQUIRED_STEPS
)

const createPublishPayload = createSelector(
  generalInfo.generalInfoRequest,
  description.getDescription,
  location.getLocation,
  photo.photoRequestPayload,
  capacities.capacitiesRequest,
  schedule.scheduleRequest,
  (general, description, location, photo, capacities, schedule) => ({
    ...general,
    ...description,
    address: location,
    ...photo,
    ...capacities,
    schedulesAttributes: {
      ...schedule
    }
  })
)

const getStockPhotoInfo = createSelector(
  photo.getPhotoTypeId,
  generalInfo.getJobTypeId,
  (jobImageId, jobTypeId) => ({
    jobImageId,
    jobTypeId
  })
)

export default {
  createPublishPayload,
  capacities,
  description,
  generalInfo,
  location,
  photo,
  schedule,
  getCompleteStatus,
  getPublishStatus,
  getSteps,
  getStockPhotoInfo
}
