import api from './Api'
import Sha1 from './Sha1'

import Config from 'react-native-config'

const {
CLOUDINARY_API_KEY,
CLOUDINARY_SECRET_KEY,
CLOUDINARY_URL
} = Config

const getFolder = (pictureType) => {
  switch (pictureType) {
    case 'companyLogo':
      return 'recruiters/logo'
    case 'companyBanner':
      return 'recruiters/profile-header'
    case 'vacancyPhoto':
    default:
      return 'recruiters/vacancy-header'
  }
}

export const uploadPhoto = (photoData, pictureType) => {
  const unixTime = Date.now()
  const folder = getFolder(pictureType)
  return api.post(
    CLOUDINARY_URL,
    {
      file: `data:image/jpeg;base64,${photoData}`,
      api_key: CLOUDINARY_API_KEY,
      timestamp: unixTime,
      folder,
      signature: Sha1.hash(`folder=${folder}&timestamp=${unixTime}${CLOUDINARY_SECRET_KEY}`)
    }
  )
}

export const createCloudinaryResource = (cloudinaryResponse) => {
  const { version, public_id, format, signature, secure_url } = cloudinaryResponse.data
  return {
    apiAsset: `image/upload/v${version}/${public_id}.${format}#${signature}`,
    secureUrl: secure_url
  }
}
