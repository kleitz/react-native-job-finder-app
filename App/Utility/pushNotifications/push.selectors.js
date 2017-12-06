import { createSelector } from 'reselect'

const getPush = state => state.get('push')

export const getDeviceInfo = createSelector(
  getPush,
  push => ({ ...push.toJS() })
)
