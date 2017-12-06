import { createSelector } from 'reselect'

const getPhotos = state => state.get('createVacancy').get('photo')

const getPhoto = createSelector(
  getPhotos,
  photo => ({
    headerPicture: photo.get('photoUrl')
  })
)

const getPhotoCheckStatus = createSelector(
  getPhoto,
  photo => !!photo.headerPicture
)

const photoRequestPayload = createSelector(
  getPhotos,
  photo => ({
    jobTypeImageId: photo.get('jobTypeImageId'),
    headerPicture: photo.get('headerPicture')
  })
)

const getPhotoTypeId = createSelector(
  getPhotos,
  photo => photo.get('jobTypeImageId')
)

export default {
  getPhoto,
  getPhotoCheckStatus,
  photoRequestPayload,
  getPhotoTypeId
}
