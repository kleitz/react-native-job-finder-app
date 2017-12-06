import { createSelector } from 'reselect'

const getLocations = state => state.get('createVacancy').get('location')

const getLocation = createSelector(
  getLocations,
  location => location.get('address')
)

const checkStatus = createSelector(
  getLocations,
  location => !!location.get('address')
)

export default {
  getLocation,
  checkStatus
}
