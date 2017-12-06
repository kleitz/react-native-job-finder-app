import React, { Component } from 'react'
import PropTypes from 'prop-types'
import I18n from 'react-native-i18n'
import {
  Dimensions, Image, ImageBackground, Linking, ScrollView, StyleSheet, Text, View, TouchableOpacity,
  ActivityIndicator, TouchableWithoutFeedback
} from 'react-native'
import { Actions } from 'react-native-router-flux'

import images from '../../Images'
import fonts from '../../Common/fonts'
import utils from '../../Utility/utils'
import colors from '../../Common/colors'
import SealIcon from '../../Common/SealIcon'

import ProfileReviews from './reviews/ProfileReviews'

class About extends Component {
  static propTypes = {
    photoRequest: PropTypes.func,
    companyInfo: PropTypes.object,
    profileLoaders: PropTypes.object
  }

  editCompanyInfo = () => {
    const { hasInternet } = this.props

    if (!hasInternet) {
      alert(I18n.t(`noInternetConnection`))
    } else {
      Actions.editCompanyInfo({
        companyInfo: this.props.companyInfo,
        updateProfile: this.props.changeFields
      })
    }
  }

  profilePhotoRequest = (pictureType = 'companyLogo') => () => {
    const { hasInternet, photoRequest } = this.props
    if (!hasInternet) {
      alert(I18n.t(`noInternetConnection`))
    } else {
      photoRequest(pictureType)
    }
  }

  render () {
    const { logoLoader, bannerLoader } = this.props.profileLoaders
    const {
      companyName,
      companyLogo,
      companyBanner,
      description,
      companyWebsite,
      telephone,
      address
    } = this.props.companyInfo
    return (
      <ScrollView contentContainerStyle={styles.container} style={{flex: 1, backgroundColor: colors.background}}>
        <ImageBackground
          resizeMode={'cover'}
          style={styles.coverPhoto}
          source={
            !!companyBanner
              ? { uri: companyBanner }
              : images.common.coverPhotoDefault
          }
        >
          <TouchableOpacity onPress={this.profilePhotoRequest()}>
            {
              logoLoader
                ? <ActivityIndicator
                  size={'large'}
                  color={colors.lightBlue}
                  style={styles.companyAvatar}
                />
                : <Image
                  style={styles.companyAvatar}
                  source={
                    !!companyLogo
                      ? { uri: companyLogo }
                      : images.common.companyAvatarPlaceholder
                  }
                />
            }
          </TouchableOpacity>
          <Text style={styles.companyName}>
            {companyName || 'N/A'}
          </Text>
          {
            bannerLoader
              ? <ActivityIndicator color={colors.lightBlue} size={'large'} style={styles.cameraIconButton} />
              : <TouchableOpacity
                style={styles.cameraIconButton}
                onPress={this.profilePhotoRequest('companyBanner')}
                >
                <SealIcon name={'camera'} style={styles.cameraIcon} color={colors.white} size={20} />
              </TouchableOpacity>
          }
        </ImageBackground>

        <ProfileReviews hasInternet={this.props.hasInternet} />

        <View style={{flex: 1}}>
          <TouchableWithoutFeedback onPress={this.editCompanyInfo}>
            <View style={styles.headerSectionContainer}>
              <Text style={styles.headerSectionTitle}>{I18n.t('profile.companyInformation')}</Text>
              <SealIcon
                size={16}
                name='pencil'
                color={colors.warmGrey}
                style={styles.headerSectionEditButton}
              />
            </View>
          </TouchableWithoutFeedback>
          <View style={[styles.section, {marginBottom: 30}]}>
            <Text style={styles.companyDescription}>{description || I18n.t('profile.noDescription')}</Text>
            <View style={styles.detailItem}>
              <SealIcon
                size={15}
                name={'location'}
                color={colors.dark}
                style={styles.detailItemIcon}
              />
              <Text style={styles.detailItemText}>{address || I18n.t('profile.noAddress')}</Text>
            </View>
            <View style={styles.detailItem}>
              <SealIcon
                size={15}
                color={colors.dark}
                name={'chain-links'}
                style={styles.detailItemIcon}
              />
              <Text
                style={[styles.detailItemText, companyWebsite ? styles.url : null]}
                onPress={() => companyWebsite ? Linking.openURL(companyWebsite) : null}
              >
                {companyWebsite || I18n.t('profile.noWebsite')}
              </Text>
            </View>
            {
              /* <View style={styles.detailItem}>
                <SealIcon
                  size={15}
                  name={'phone-open'}
                  color={colors.dark}
                  style={styles.detailItemIcon}
                />
                <Text style={styles.detailItemText}>{telephone || 'N/A'}</Text>
              </View> */
            }
          </View>
        </View>
      </ScrollView>
    )
  }
}

const width = Dimensions.get('window').width

let styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background
  },
  coverPhoto: {
    height: 160,
    width,
    alignItems: 'center',
    justifyContent: 'center'
  },
  companyAvatar: {
    width: 80,
    height: 80,
    borderRadius: 4
  },
  companyName: {
    backgroundColor: 'transparent',
    color: colors.white,
    fontFamily: fonts.openSansRegular,
    fontSize: 18,
    marginTop: 4,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: {
      width: 2, height: 0
    },
    textShadowRadius: 4
  },
  headerSectionContainer: {
    height: 30,
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 15,
    marginBottom: 2
  },
  headerSectionTitle: {
    color: colors.warmGrey,
    fontFamily: fonts.openSansRegular,
    fontSize: 14,
    alignSelf: 'center'
  },
  headerSectionEditButton: {
    position: 'absolute',
    top: 10,
    right: 5
  },
  section: {
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: colors.inputBorder,
    paddingRight: 15,
    paddingLeft: 15,
    paddingTop: 10,
    paddingBottom: 10
  },
  companyDescription: {
    fontFamily: fonts.openSansLight,
    fontSize: 14,
    color: colors.dark
  },
  detailItem: {
    flexDirection: 'row',
    marginTop: 10
  },
  detailItemIcon: {
    transform: [{translateY: 2}]
  },
  detailItemText: {
    color: colors.dark,
    fontFamily: fonts.openSansLight,
    fontSize: 14,
    marginLeft: 10
  },
  url: {
    color: colors.lightBlue
  },
  cameraIconButton: {
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    position: 'absolute',
    width: 75,
    height: 50,
    bottom: 10,
    right: 15
  },
  cameraIcon: {
    backgroundColor: 'transparent'
  }
})

export default About
