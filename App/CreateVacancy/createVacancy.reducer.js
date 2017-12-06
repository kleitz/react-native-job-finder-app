import { combineReducers } from 'redux-immutable'

import photo from './reducers/photo.reducer'
import location from './reducers/location.reducer'
import schedule from './reducers/schedule.reducer'
import capacities from './reducers/capacities.reducer'
import generalInfo from './reducers/generalInfo.reducer'
import description from './reducers/description.reducer'

export default combineReducers({
  capacities,
  description,
  generalInfo,
  location,
  photo,
  schedule
})
