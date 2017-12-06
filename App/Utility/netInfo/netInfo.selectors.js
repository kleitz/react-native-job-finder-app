import { createSelector } from 'reselect'

const getNetInfo = state => state.get('netInfo')

const getInternetStatus = createSelector(
  getNetInfo,
  netInfo => netInfo.get('hasInternet')
)

const getCodePushStatus = createSelector(
  getNetInfo,
  netInfo => netInfo.get('codePushUpdate')
)

export {
  getInternetStatus,
  getCodePushStatus
}
