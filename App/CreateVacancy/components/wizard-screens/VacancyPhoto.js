import React, { Component } from 'react'
import I18n from 'react-native-i18n'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Actions } from 'react-native-router-flux'
import { View, Text, StyleSheet, Dimensions, Image, ActivityIndicator } from 'react-native'

import fonts from '../../../Common/fonts'
import colors from '../../../Common/colors'
import Button from '../../../Common/Button'
import SealIcon from '../../../Common/SealIcon'
import SealHeader from '../../../Common/SealHeader'
import ProgressBar from '../widgets/ProgressBar'

import selectors from '../../createVacancy.selectors'
import { getStockPhotoRequest } from '../../createVacancy.actions'
import { photoRequest } from '../../../Utility/photos/photoUpload.actions'
import { getVacancyLoader } from '../../../Utility/loaders/loaders.selectors'
import { getInternetStatus } from '../../../Utility/netInfo/netInfo.selectors'

const root = what => `createVacancy.vacancyPhoto.${what}`
const { width } = Dimensions.get('window')
class VacancyPhoto extends Component {

  goToMain = () => {
    Actions.pop()
    setTimeout(() => {
      Actions.createVacancy()
    })
  }

  nextStep = () => {
    Actions.pop()
    setTimeout(() => {
      Actions.nvOtherCapacities()
    })
  }

  getPhoto = (type) => () => {
    const { hasInternet, getStockPhotoRequest, photoRequest } = this.props

    if (!hasInternet) {
      alert(I18n.t(`noInternetConnection`))
    } else {
      if (type === 'stock') {
        getStockPhotoRequest()
      } else {
        photoRequest('vacancyPhoto')
      }
    }
  }

  render () {
    const { photo: { headerPicture }, vacancyLoader, validation } = this.props

    const vacancyPhoto = headerPicture
    ? <Image
      resizeMode={'cover'}
      style={styles.vacancyPhoto}
      source={{uri: headerPicture}}
    />
    : <SealIcon
      transclude
      name={'camera'}
      style={styles.iconStyle}
      containerStyle={styles.photoPlaceholderContainer}
    />

    const photoContent = vacancyLoader
      ? <ActivityIndicator size={'large'} style={{height: 160}} />
      : vacancyPhoto
    return (
      <View style={{flex: 1, backgroundColor: colors.background}}>
        <SealHeader
          leftIconSize={14}
          leftBtnFn={this.goToMain}
          leftBtnText={'icon-back'}
          title={I18n.t(root('title'))}
          />
        <ProgressBar step={6} totalSteps={9} />
        {photoContent}
        <View style={{flex: 3}}>
          <Text style={[styles.infoText, {marginBottom: 5}]}>
            {I18n.t(root('firstParagraph'))}
          </Text>
          <Text style={[styles.infoText]}>
            {I18n.t(root('secondParagraph'))}
          </Text>

          <Button btnStyle={[styles.button, {marginTop: 15}]} onPress={this.getPhoto('vacancyPhoto')}>
            {I18n.t(root('uploadPhoto'))}
          </Button>
          <Button btnStyle={styles.button} reverse onPress={this.getPhoto('stock')}>
            {I18n.t(root('generateStock'))}
          </Button>
        </View>

        <Button
          opacity={1}
          onPress={this.nextStep}
          btnStyle={styles.nextBtn}
          disabled={!validation.photo}
        >
          {I18n.t('buttons.next').toUpperCase()}
        </Button>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  vacancyPhoto: {
    width,
    height: 160
  },
  iconStyle: {
    fontSize: 56,
    opacity: 0.5,
    color: colors.dark
  },
  photoPlaceholderContainer: {
    width,
    height: 160,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.windowsBlue10
  },
  infoText: {
    marginTop: 10,
    marginHorizontal: 13,
    fontSize: 14,
    fontFamily: fonts.openSansRegular,
    letterSpacing: -0.2,
    color: colors.warmGrey,
    textAlign: 'left'
  },
  button: {
    marginVertical: 6,
    marginHorizontal: 13
  },
  nextBtn: {
    borderRadius: 0,
    height: 50
  }
})

const mapStateToProps = state => ({
  hasInternet: getInternetStatus(state),
  photo: selectors.photo.getPhoto(state),
  vacancyLoader: getVacancyLoader(state),
  validation: selectors.getCompleteStatus(state)
})

const mapDispatchToProps = dispatch => bindActionCreators({
  photoRequest, getStockPhotoRequest
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(VacancyPhoto)
