import { createSelector } from 'reselect'

const getLoaders = state => state.get('loaders')

const getSessionLoader = createSelector(
  getLoaders,
  loaders => loaders.get('session')
)

const getProfileLoaders = createSelector(
  getLoaders,
  loaders => ({
    logoLoader: loaders.get('companyLogo'),
    bannerLoader: loaders.get('companyBanner')
  })
)

const getVacancyLoader = createSelector(
  getLoaders,
  loaders => loaders.get('vacancy')
)

const getRefreshChatRoomsLoader = createSelector(
  getLoaders,
  loaders => loaders.get('refreshChatRooms')
)

const getLoadingOverlay = createSelector(
  getLoaders,
  loaders => loaders.get('loadingOverlay')
)

const getLoadingCandidates = createSelector(
  getLoaders,
  loaders => loaders.get('candidates')
)

const getLoadingReviews = createSelector(
  getLoaders,
  loaders => loaders.get('reviewsLoader')
)

export {
  getSessionLoader,
  getProfileLoaders,
  getVacancyLoader,
  getRefreshChatRoomsLoader,
  //
  getLoadingOverlay,
  getLoadingCandidates,
  getLoadingReviews
}
