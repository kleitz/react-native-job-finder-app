import { Platform } from 'react-native'
import I18n from 'react-native-i18n'
import ImagePicker from 'react-native-image-crop-picker'
import ActionSheet from '@yfuks/react-native-action-sheet'
import { take, put, call, fork, select } from 'redux-saga/effects'

import colors from '../../Common/colors'
import { PHOTO_REQUEST } from './photoUpload.constants'
import profileAPI from '../../Profile/profile.api'
import { changeFields } from '../../Profile/profile.actions'
import { getSessionData } from '../../Session/session.selectors'
import { changeVacancyPhoto } from '../../CreateVacancy/createVacancy.actions'
import { setProfileLoader, setVacancyLoader } from '../../Utility/loaders/loaders.actions'
import { createCloudinaryResource, uploadPhoto } from '../../Config/PhotoUpload'
import BugsnagClient from '../../Config/BugsnagConfig.js'
import { store } from '../../App'

const photoOptions = {
  square: {
    width: 320,
    height: 320,
    includeBase64: true,
    cropping: true,
    storageOptions: {
      skipBackup: true
    }
  },
  wide: {
    width: 640,
    height: 320,
    includeBase64: true,
    cropping: true,
    storageOptions: {
      skipBackup: true
    }
  }
}

const photoActionSheetConfig = {
  buttonsIOS: [I18n.t('photos.takePhotoIOS'), I18n.t('photos.selectIOS'), I18n.t('buttons.cancel')],
  buttonsAndroid: [I18n.t('photos.takePhotoAndroid'), I18n.t('photos.selectAndroid'), I18n.t('buttons.cancel')],
  CANCEL_INDEX: 2
}

const actionSheetOptions = (pictureType = 'companyLogo') => ({
  options: (Platform.OS === 'ios') ? photoActionSheetConfig.buttonsIOS : photoActionSheetConfig.buttonsAndroid,
  cancelButtonIndex: photoActionSheetConfig.CANCEL_INDEX,
  tintColor: colors.lightBlue,
  title: I18n.t(`photos.${pictureType}`)
})

const getPhotoOption = (option) => {
  if (option === 'vacancyPhoto' || option === 'companyBanner') {
    return photoOptions.wide
  } else {
    return photoOptions.square
  }
}

const openPicker = (pictureType = 'companyLogo') => {
  let option = getPhotoOption(pictureType)
  return ImagePicker.openPicker(option)
}
const openCamera = (pictureType = 'companyLogo') => {
  let option = getPhotoOption(pictureType)
  return ImagePicker.openCamera(option)
}

const showPhotoActions = (pictureType) =>
  new Promise(resolve => {
    ActionSheet.showActionSheetWithOptions(
      actionSheetOptions(pictureType),
      buttonIndex => {
        switch (buttonIndex) {
          case 0:
            openCamera(pictureType)
              .then(photoResponse => {
                store.dispatch(setLoader(pictureType, true))
                return uploadPhoto(photoResponse.data, pictureType)
              })
              .then(cloudResponse => resolve(createCloudinaryResource(cloudResponse)))
              .catch(err => {
                store.dispatch(setLoader(pictureType, false))
              })
            break
          case 1:
            openPicker(pictureType)
              .then(photoResponse => {
                store.dispatch(setLoader(pictureType, true))
                return uploadPhoto(photoResponse.data, pictureType)
              })
              .then(cloudResponse => resolve(createCloudinaryResource(cloudResponse)))
              .catch(err => {
                console.log('error uploading photo: ', err)
                store.dispatch(setLoader(pictureType, false))
              })
            break
        }
      }
    )
  })

function * vacancyPhotoFlow (secureUrl, apiAsset) {
  yield put(changeVacancyPhoto({
    url: secureUrl,
    cloudinaryResource: apiAsset
  }))
}

const setLoader = (pictureType, visibility) => {
  switch (pictureType) {
    case 'vacancyPhoto':
      return setVacancyLoader(visibility)
    default:
      return setProfileLoader(visibility, pictureType)
  }
}
function * uploadPhotoFlow (pictureType) {
  try {
    const { id } = yield select(getSessionData)
    const { apiAsset, secureUrl } = yield call(showPhotoActions, pictureType)

    if (pictureType === 'vacancyPhoto') {
      yield call(vacancyPhotoFlow, secureUrl, apiAsset)
    } else {
      const apiResponse = yield call(profileAPI.updateProfile, ({[pictureType]: apiAsset, userId: id}))
      if (apiResponse.ok) {
        BugsnagClient.leaveBreadcrumb('Upload photo completed succesfully', {
          type: 'log',
          pictureType
        })
        yield put(changeFields(apiResponse.data))
      }
    }
  } catch (err) {
    console.tron.log(err)
    BugsnagClient.notify(err, report => {
      report.metadata.type = 'Upload Photo Flow'
    })
  } finally {
    yield put(setLoader(pictureType, false))
  }
}

export function * selectPhotoFlow () {
  while (true) {
    const { pictureType } = yield take(PHOTO_REQUEST)
    yield fork(uploadPhotoFlow, pictureType)
  }
}

export default function * root () {
  yield fork(selectPhotoFlow)
}
