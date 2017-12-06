import { createSelector } from 'reselect'
import utils from '../../Utility/utils'

const getCapacities = state => state.get('createVacancy').get('description')

const getDescription = createSelector(
  getCapacities,
  desc => ({
    shortDescription: desc.get('shortDescription'),
    description: desc.get('description')
  })
)

const hasRequiredLongDescription = (richText) => {
  return richText ? utils.stripTextOfHTML(richText).length >= 50 : false
}

const checkStatus = createSelector(
  getCapacities,
  desc => hasRequiredLongDescription(desc.get('description'))
)

export default {
  getDescription,
  checkStatus
}
