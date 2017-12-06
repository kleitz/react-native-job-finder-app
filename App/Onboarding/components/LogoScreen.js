import React from 'react'
import I18n from 'react-native-i18n'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Actions } from 'react-native-router-flux'
import { View, Text, Image, StyleSheet, TouchableOpacity, Dimensions, ActivityIndicator } from 'react-native'

import fonts from '../../Common/fonts'
import assetManager from '../../Images'
import colors from '../../Common/colors'
import Button from '../../Common/Button'
import SealHeader from '../../Common/SealHeader'
import { getProfileLoaders } from '../../Utility/loaders/loaders.selectors'
import { getOnboardingInfo } from '../../Profile/profile.selectors'
import { photoRequest } from '../../Utility/photos/photoUpload.actions'

const { width } = Dimensions.get('window')
const LogoScreen = ({companyLogo, loader, photoRequest}) =>
{
  return <View style={styles.container}>
    <SealHeader
      rightBtnFn={Actions.infoScreen}
      title={I18n.t('info.logoTitle')}
      rightBtnText={I18n.t('buttons.next')}
      rightBtnStyle={{marginRight: 10}}
      />
    {
      loader
        ? <ActivityIndicator color={colors.lightBlue} size={'large'} style={[styles.imageBackground, {backgroundColor: 'transparent'}]} />
        : <TouchableOpacity
          opacity={0.7}
          style={styles.imageBackground}
          onPress={photoRequest.bind(null, 'companyLogo')}
          >
          <Image
            style={[styles.image, !!companyLogo && styles.fullImage]}
            resizeMode={'contain'}
            source={
              !!companyLogo
                ? {uri: companyLogo}
                : assetManager.common.logoScreenPlaceholder
            }
            />
        </TouchableOpacity>
    }
    <Button
      btnStyle={styles.button}
      labelStyle={styles.buttonLabel}
      onPress={photoRequest.bind(null, 'companyLogo')}
      >
      <Text>{I18n.t('buttons.uploadCompanyLogo')}</Text>
    </Button>
    <View style={styles.textHolder}>
      <Text style={styles.infoText}>
        {I18n.t('onboarding.logoHint')}
      </Text>
    </View>
    <TouchableOpacity
      activeOpacity={0.7}
      style={styles.skipButton}
      onPress={Actions.infoScreen}
      >
      <Text style={styles.skipText}>{I18n.t('buttons.skip')}</Text>
    </TouchableOpacity>
  </View>
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center'
  },
  imageBackground: {
    marginTop: 35,
    marginBottom: 30,
    justifyContent: 'center',
    alignItems: 'center',
    width: 140,
    height: 140,
    borderRadius: 8,
    backgroundColor: colors.lightBlueGrey
  },
  fullImage: {
    borderRadius: 8,
    width: 140,
    height: 140
  },
  image: {
    width: 74,
    height: 60
  },
  textHolder: {
    marginTop: 15,
    marginBottom: 30,
    width: 300
  },
  infoText: {
    color: colors.warmGrey,
    fontSize: 14,
    fontFamily: fonts.openSansLight,
    textAlign: 'center',
    lineHeight: 16,
    letterSpacing: -0.2
  },
  button: {
    height: 42,
    borderRadius: 4
  },
  buttonLabel: {
    paddingHorizontal: 24,
    fontSize: 16,
    fontFamily: fonts.openSansLight,
    textAlign: 'center',
    textAlignVertical: 'center',
    letterSpacing: -0.3,
    color: colors.white
  },
  skipText: {
    fontSize: 18,
    color: colors.lightBlue,
    fontFamily: fonts.openSansRegular
  },
  skipButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: 42,
    width
  }
})

const mapStateToProps = state => ({
  loader: getProfileLoaders(state).logoLoader,
  companyLogo: getOnboardingInfo(state).companyLogo
})

const mapDispatchToProps = dispatch => bindActionCreators({
  photoRequest
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(LogoScreen)
