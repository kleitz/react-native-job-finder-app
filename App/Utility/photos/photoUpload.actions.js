import * as types from './photoUpload.constants'

export const photoRequest = (pictureType = 'companyLogo') => ({
  type: types.PHOTO_REQUEST,
  pictureType
})
