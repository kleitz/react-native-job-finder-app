import React, { Component } from 'react'
import PropTypes from 'prop-types'
import I18n from 'react-native-i18n'
import {
  Dimensions,
  View,
  Platform,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  TouchableWithoutFeedback
} from 'react-native'
import { Actions } from 'react-native-router-flux'

import colors from '../../Common/colors'
import fonts from '../../Common/fonts'
import SealIcon from '../../Common/SealIcon'

class Account extends Component {
  static propTypes = {
    loader: PropTypes.bool,
    logout: PropTypes.func
  }

  goTo = (place, data) => () => {
    const { hasInternet } = this.props
    if (!hasInternet) {
      alert(I18n.t(`noInternetConnection`))
    } else {
      Actions[place]({ ...data })
    }
  }

  updateProfile = (data) => {
    const { changeFields } = this.props
    changeFields(data)
  }

  getFullName = () => {
    const { firstName, lastName } = this.props.accountInfo
    if (!!firstName || !!lastName) {
      return `${firstName} ${lastName}`
    }
    return null
  }

  render () {
    const { loader, logout, error } = this.props
    const {
      firstName, lastName, mobile, position, email
    } = this.props.accountInfo
    const fullName = this.getFullName()
    return (
      <ScrollView contentContainerStyle={styles.container} style={{flex: 1, backgroundColor: colors.background}}>
        <View style={styles.headerSectionContainer}>
          <Text style={styles.headerSectionTitle}>{I18n.t('profile.accountInformation')}</Text>
        </View>
        <View>
          <TouchableWithoutFeedback
            onPress={this.goTo('editName', { firstName, lastName, updateProfile: this.updateProfile })}
          >
            <View style={styles.fieldWrapper}>
              <Text style={[styles.fieldText, !fullName ? {color: colors.placeholderGray} : null]}>
                {fullName || I18n.t('profile.placeholders.name')}
              </Text>
              <SealIcon
                size={16}
                name={'forward'}
                style={styles.fieldIcon}
                color={fullName ? colors.lightBlue : colors.salmon}
              />
            </View>
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback
            onPress={this.goTo('editEmail', { email, updateProfile: this.updateProfile })}
          >
            <View style={styles.fieldWrapper}>
              <Text style={[styles.fieldText, !email ? {color: colors.placeholderGray} : null]}>{email || I18n.t('profile.placeholders.email')}</Text>
              <SealIcon
                name={'forward'}
                color={email ? colors.lightBlue : colors.salmon}
                style={styles.fieldIcon}
                size={16}
              />
            </View>
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback
            onPress={this.goTo('editPosition', { position, updateProfile: this.updateProfile })}
          >
            <View style={styles.fieldWrapper}>
              <Text style={[styles.fieldText, !position ? {color: colors.placeholderGray} : null]}>{position || I18n.t('profile.placeholders.position')}</Text>
              <SealIcon
                name={'forward'}
                color={position ? colors.lightBlue : colors.salmon}
                style={styles.fieldIcon}
                size={16}
              />
            </View>
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback
            onPress={this.goTo('editMobile', { mobile, updateProfile: this.updateProfile })}
            >
            <View style={[styles.fieldWrapper, {borderBottomWidth: 1}]}>
              <Text style={[styles.fieldText, !mobile ? {color: colors.placeholderGray} : null]}>{mobile || I18n.t('profile.placeholders.mobileNr')}</Text>
              <SealIcon
                size={16}
                name={'forward'}
                style={styles.fieldIcon}
                color={mobile ? colors.lightBlue : colors.salmon}
              />
            </View>
          </TouchableWithoutFeedback>
        </View>

        <TouchableWithoutFeedback onPress={Actions.tutorial}>
          <View style={[styles.genericBtn, { alignItems: 'flex-start', paddingLeft: 15 }]}>
            <Text style={styles.tutorialText}>
              {I18n.t('buttons.takeTutorial')}
            </Text>
            <SealIcon
              size={16}
              name={'forward'}
              color={colors.lightBlue}
              style={styles.fieldIcon}
            />
          </View>
        </TouchableWithoutFeedback>

        <View style={styles.genericBtn}>
          {
            loader
              ? <ActivityIndicator color={colors.lightBlue} size={'small'} />
              : <Text
                onPress={logout}
                style={styles.logoutText}
                >
                {I18n.t('auth.logout')}
              </Text>
          }
        </View>
        {
          !!error &&
          <Text style={styles.errorText}>{error}</Text>
        }
      </ScrollView>
    )
  }
}

const { width } = Dimensions.get('window')

let styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background
  },
  headerSectionContainer: {
    marginTop: 15,
    marginBottom: 5
  },
  headerSectionTitle: {
    color: colors.warmGrey,
    fontFamily: fonts.openSansRegular,
    fontSize: 14,
    alignSelf: 'center'
  },
  fieldWrapper: {
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderColor: colors.inputBorder,
    height: 42,
    justifyContent: 'center',
    paddingLeft: 15,
    paddingRight: 15
  },
  fieldText: {
    fontFamily: fonts.openSansRegular,
    fontSize: 16,
    color: colors.dark
  },
  fieldIcon: {
    position: 'absolute',
    right: 15,
    top: 42 / 2 - 15 / 2 // yeah, center it like a pro :)
  },
  genericBtn: {
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: colors.inputBorder,
    backgroundColor: colors.white,
    height: 42,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 30
  },
  logoutText: {
    color: colors.salmon,
    fontFamily: fonts.openSansRegular,
    fontSize: 16,
    flex: 1,
    textAlign: 'center',
    ...Platform.select({
      ios: {
        lineHeight: 37
      },
      android: {
        textAlignVertical: 'center'
      }
    }),
    width
  },
  tutorialText: {
    fontFamily: fonts.openSansRegular,
    fontSize: 16,
    color: colors.dark
  },
  payrollText: {
    fontFamily: fonts.openSansRegular,
    fontSize: 16
  },
  payrollStatusWrapper: {
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderColor: colors.inputBorder,
    height: 57,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  requestBtnWrapper: {
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderColor: colors.inputBorder,
    height: 42,
    justifyContent: 'center',
    alignItems: 'center'
  },
  disclaimerWrapper: {
    borderBottomWidth: 1,
    borderTopWidth: 1,
    borderColor: colors.inputBorder,
    backgroundColor: colors.washedLightBlue,
    padding: 15
  },
  requestBtn: {
    color: colors.placeholderGray
  },
  hint: {
    fontSize: 14,
    color: colors.lightBlue
  },
  errorText: {
    marginTop: 10,
    marginHorizontal: 40,
    color: colors.salmon,
    fontFamily: fonts.openSansRegular,
    textAlign: 'center'
  }
})

export default Account
