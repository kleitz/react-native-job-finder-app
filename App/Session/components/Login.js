import React, { Component } from 'react'
import DeviceInfo from 'react-native-device-info'
import I18n from 'react-native-i18n'
import {
  View, Text, TextInput, TouchableOpacity, Linking,
  ActivityIndicator, Keyboard
} from 'react-native'

import colors from '../../Common/colors'
import Button from '../../Common/Button'
import SealIcon from '../../Common/SealIcon'

import Styles from './Styles'

const ICON_SIZE = 12
const resetUrl = `https://www.seal-jobs.com/recruiters/password/new?locale=${DeviceInfo.getDeviceLocale().split('-')[0]}`
class Login extends Component {
  state = {
    email: '',
    password: '',
    hasValidEmail: false,
    hasEmailError: false,
    hasPasswordError: false,
    hasLoginError: false,
    isRequestPending: false
  }

  hasEmailError = () => !this.state.email.match(/[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{1,63}$/)
  hasPasswordError = () => !this.state.password.length

  onChangeText = (field) => (text) => {
    const { setSessionError, error } = this.props
    this.setState({
      hasEmailError: false,
      hasPasswordError: false,
      hasLoginError: false,
      [field]: text
    }, () => {
      this.setState({ hasValidEmail: !this.hasEmailError() })
      error && setSessionError('login', false)
    })
  }

  resetPassword = () => {
    Linking.canOpenURL(resetUrl)
      .then(supported => {
        if (supported) {
          Linking.openURL(resetUrl)
        }
      })
  }

  login = () => {
    Keyboard.dismiss()
    const { state: { email, password }, props: { loginRequest, userRegistered } } = this
    this.setState({
      hasEmailError: this.hasEmailError(),
      hasPasswordError: this.hasPasswordError()
    }, () => {
      if (!this.state.hasEmailError && !this.state.hasPasswordError) {
        userRegistered(true)
        loginRequest({ email, password })
      }
    })
  }

  render () {
    const {
      state: { email, password, hasValidEmail, hasEmailError, hasPasswordError },
      props: { loader, error }
    } = this
    return (
      <View style={Styles.authContainer}>
        <View style={[Styles.inputGroup, {marginTop: 20}]}>
          <TextInput
            value={email}
            style={[Styles.input, error && Styles.inputErrorBorder]}
            returnKeyType={'next'}
            keyboardType={'email-address'}
            underlineColorAndroid={'transparent'}
            onChangeText={this.onChangeText('email')}
            placeholderTextColor={colors.placeholderGray}
            placeholder={I18n.t('auth.emailPlaceholder')}
            onSubmitEditing={() => { this.refs.secondInput.focus() }}
            />
          {
            (!error && !hasEmailError && hasValidEmail) &&
            <SealIcon name={'checked'} color={colors.lightBlue} size={ICON_SIZE} style={Styles.inputIcon} />
          }
          {
            (error || hasEmailError) &&
            <SealIcon name={'skip'} color={'red'} size={ICON_SIZE} style={Styles.inputIcon} />
          }
          {
            hasEmailError &&
            <Text style={Styles.inputErrorText}>{I18n.t('auth.errors.emailNotValid')}</Text>
          }
        </View>
        <View style={[Styles.inputGroup, hasEmailError && {marginTop: 22}]}>
          <TextInput
            ref='secondInput'
            secureTextEntry
            value={password}
            returnKeyType={'done'}
            style={[Styles.input, error && Styles.inputErrorBorder]}
            keyboardType={'default'}
            onSubmitEditing={this.login}
            underlineColorAndroid={'transparent'}
            onChangeText={this.onChangeText('password')}
            placeholderTextColor={colors.placeholderGray}
            placeholder={I18n.t('auth.passwordPlaceholder')}
            />
          {
            (hasPasswordError || error) &&
            <SealIcon name={'skip'} color={'red'} size={ICON_SIZE} style={Styles.inputIcon} />
          }
          {
            hasPasswordError &&
            <Text style={Styles.inputErrorText}>{I18n.t('auth.errors.passwordRequired')}</Text>
          }
        </View>
        {
          loader
            ? <ActivityIndicator
              size={'large'}
              color={colors.lightBlue}
              style={[Styles.loader, hasPasswordError && { marginTop: 22 }]}
            />
            : <Button
              onPress={this.login}
              labelStyle={Styles.buttonLabel}
              btnStyle={[Styles.button, hasPasswordError && { marginTop: 22 }]}
              >
              {I18n.t('auth.login')}
            </Button>
        }
        <TouchableOpacity style={Styles.forgotButton} onPress={this.resetPassword}>
          <Text style={Styles.forgotText}>{I18n.t('auth.forgotPassword')}</Text>
        </TouchableOpacity>
        {
          error &&
          <View style={Styles.errorContainer}>
            <Text style={Styles.errorText}>{I18n.t('auth.errors.login')}</Text>
          </View>
        }
      </View>
    )
  }
}

export default Login
