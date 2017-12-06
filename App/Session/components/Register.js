import React, { Component } from 'react'
import { Actions, ActionConst } from 'react-native-router-flux'
import I18n from 'react-native-i18n'
import Hyperlink from 'react-native-hyperlink'
import {
  View, Text, TextInput, KeyboardAvoidingView, Linking, ActivityIndicator, Keyboard,
  Animated, ScrollView
} from 'react-native'

import fonts from '../../Common/fonts'
import colors from '../../Common/colors'
import Button from '../../Common/Button'
import SealIcon from '../../Common/SealIcon'

import Styles from './Styles'

const ICON_SIZE = 12
const REQUIRED_PASSWORD_LENGTH = 8
class Register extends Component {
  state = {
    details: {
      company: '',
      email: '',
      password: '',
      confirmPassword: ''
    },
    hasNoPasswordError: false,
    hasValidEmail: false,
    emailAvailable: true,
    hasValidPassword: false,
    hasValidConfirmPassword: false,
    hasEmailError: false,
    hasCompanyError: false,
    hasPasswordError: false,
    hasConfirmPasswordError: false
  }

  isDataValid = () => {
    const { hasValidEmail,
      hasValidPassword,
      hasValidConfirmPassword,
      details: { company }
    } = this.state
    return (
      !!company &&
      hasValidEmail &&
      hasValidPassword &&
      hasValidConfirmPassword
    )
  }

  hasValidPassword = (passwordType) => {
    const pw = this.state.details[passwordType]
    const { password } = this.state.details
    return passwordType === 'confirmPassword'
      ? pw.trim().length >= REQUIRED_PASSWORD_LENGTH && pw === password
      : pw.trim().length >= REQUIRED_PASSWORD_LENGTH
  }

  hasCompanyError = () => !this.state.details.company
  hasEmailError = () => !this.state.details.email.match(/[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{1,63}$/)

  hasPasswordError = () => {
    const { password } = this.state.details
    return password.length < REQUIRED_PASSWORD_LENGTH
  }

  hasConfirmPasswordError = () => {
    const { password, confirmPassword } = this.state.details
    return confirmPassword.length >= password.length && password !== confirmPassword
  }

  isCompanyValid = () => {
    const { hasEmailError, hasCompanyError } = this.state
    return !hasEmailError && !hasCompanyError && !this.hasPasswordError()
  }

  handleLink = (url) => {
    Linking.canOpenURL(url)
      .then(supported => {
        if (supported) {
          Linking.openURL(url)
        }
      })
  }

  linkifyText = (url) => {
    switch (url) {
      case `https://www.seal-jobs.com/terms_and_conditions`:
        return I18n.t('auth.terms')
      case `https://www.seal-jobs.com/privacy`:
        return I18n.t('auth.privacyPolicy')
      default:
        return url
    }
  }

  onChangeText = (field) => (text) => {
    const { setSessionError, errors } = this.props
    this.setState({
      details: {
        ...this.state.details,
        [field]: text
      }
    }, () => {
      this.setState({
        emailAvailable: true,
        hasValidEmail: !this.hasEmailError(),
        hasValidPassword: this.hasValidPassword('password'),
        hasValidConfirmPassword: this.hasValidPassword('confirmPassword'),
        hasEmailError: false,
        hasCompanyError: false,
        hasPasswordError: false,
        hasConfirmPasswordError: false,
        hasNoPasswordError: false
      })

      if (field === 'company' && errors.companyName) {
        setSessionError('companyName', false)
      }

      if (field === 'email' && errors.email) {
        setSessionError('email', false)
      }
    })
  }

  register = () => {
    Keyboard.dismiss()
    this.setState({
      hasEmailError: this.hasEmailError(),
      hasCompanyError: this.hasCompanyError(),
      hasPasswordError: this.hasPasswordError(),
      hasConfirmPasswordError: this.hasConfirmPasswordError()
    }, () => {
      if (this.isCompanyValid() && this.isDataValid()) {
        const { registerRequest, userRegistered } = this.props
        userRegistered(false)
        registerRequest(this.state.details)
      } else if (!this.state.details.password.length) {
        this.setState({ hasNoPasswordError: true })
      }
    })
  }

  render () {
    const { company, email, password, confirmPassword } = this.state.details
    const {
      hasCompanyError,
      hasEmailError,
      hasValidEmail,
      hasValidPassword,
      hasValidConfirmPassword,
      hasPasswordError,
      hasNoPasswordError,
      hasConfirmPasswordError
    } = this.state
    const { loader, error, errors } = this.props
    return (
      <ScrollView style={{flex: 1}} keyboardShouldPersistTaps='always'>
        <KeyboardAvoidingView style={Styles.authContainer}>
          <View style={[Styles.inputGroup, {marginTop: 20}]}>
            <TextInput
              value={company}
              style={[Styles.input, (hasCompanyError || errors.companyName) && Styles.inputErrorBorder]}
              keyboardType={'default'}
              underlineColorAndroid={'transparent'}
              onChangeText={this.onChangeText('company')}
              placeholderTextColor={colors.placeholderGray}
              placeholder={I18n.t('auth.companyPlaceholder')}
              onSubmitEditing={() => { this.refs.secondInput.focus() }}
              />
            {
              (hasCompanyError || errors.companyName) &&
              <SealIcon name={'skip'} color={'red'} size={ICON_SIZE} style={Styles.inputIcon} />
            }
            {
              hasCompanyError &&
              <Text style={Styles.inputErrorText}>{I18n.t('auth.errors.companyRequired')}</Text>
            }
            {
              errors.companyName &&
              <Text style={Styles.inputErrorText}>{I18n.t('auth.errors.nameAlreadyTaken')}</Text>
            }
          </View>
          <View style={Styles.inputGroup}>
            <TextInput
              value={email}
              ref='secondInput'
              style={[Styles.input, (hasEmailError || errors.email) && Styles.inputErrorBorder]}
              keyboardType={'email-address'}
              underlineColorAndroid={'transparent'}
              onChangeText={this.onChangeText('email')}
              placeholderTextColor={colors.placeholderGray}
              placeholder={I18n.t('auth.emailPlaceholder')}
              onSubmitEditing={() => { this.refs.thirdInput.focus() }}
              />
            {
              hasEmailError &&
              <SealIcon name={'skip'} color={'red'} size={ICON_SIZE} style={Styles.inputIcon} />
            }
            {
              hasEmailError &&
              <Text style={Styles.inputErrorText}>{I18n.t('auth.errors.emailRequired')}</Text>
            }
            {
              (!hasEmailError && !errors.email && hasValidEmail) &&
              <SealIcon name={'checked'} color={colors.lightBlue} size={ICON_SIZE} style={Styles.inputIcon} />
            }
            {
              errors.email &&
              <SealIcon name={'skip'} color={'red'} size={ICON_SIZE} style={Styles.inputIcon} />
            }
            {
              errors.email &&
              <Text style={Styles.inputErrorText}>{I18n.t('auth.errors.email')}</Text>
            }
          </View>
          <View style={Styles.inputGroup}>
            <TextInput
              ref='thirdInput'
              secureTextEntry
              value={password}
              style={[Styles.input, hasPasswordError && Styles.inputErrorBorder]}
              keyboardType={'default'}
              underlineColorAndroid={'transparent'}
              onChangeText={this.onChangeText('password')}
              placeholderTextColor={colors.placeholderGray}
              placeholder={I18n.t('auth.passwordPlaceholder')}
              onSubmitEditing={() => { this.refs.fourthInput.focus() }}
              />
            {
              (!hasPasswordError && hasValidPassword) &&
              <SealIcon name={'checked'} color={colors.lightBlue} size={ICON_SIZE} style={Styles.inputIcon} />
            }
            {
              hasPasswordError &&
              <Text style={Styles.inputErrorText}>{I18n.t('auth.errors.passwordTooShort')}</Text>
            }
            {
              hasPasswordError &&
              <SealIcon name={'skip'} color={'red'} size={ICON_SIZE} style={Styles.inputIcon} />
            }
          </View>
          {
            !hasPasswordError &&
            <View style={Styles.passwordHintContainer}>
              <Text style={Styles.passwordHintText}>
                {I18n.t('auth.passwordHint', { requiredLength: REQUIRED_PASSWORD_LENGTH })}
              </Text>
            </View>
          }
          <View style={[Styles.inputGroup, {marginTop: hasPasswordError ? 20 : 5}]}>
            <TextInput
              secureTextEntry
              ref='fourthInput'
              style={[Styles.input, hasConfirmPasswordError && Styles.inputErrorBorder]}
              returnKeyType={'done'}
              value={confirmPassword}
              keyboardType={'default'}
              onSubmitEditing={this.register}
              underlineColorAndroid={'transparent'}
              placeholderTextColor={colors.placeholderGray}
              onChangeText={this.onChangeText('confirmPassword')}
              placeholder={I18n.t('auth.confirmPasswordPlaceholder')}
              />
            {
              hasConfirmPasswordError &&
              <SealIcon name={'skip'} color={'red'} size={12} style={Styles.inputIcon} />
            }
            {
              hasConfirmPasswordError &&
              <Text style={Styles.inputErrorText}>{I18n.t('auth.errors.passwordsDontMatch')}</Text>
            }
            {
              (!hasConfirmPasswordError && hasValidConfirmPassword) &&
              <SealIcon name={'checked'} color={colors.lightBlue} size={ICON_SIZE} style={Styles.inputIcon} />
            }
          </View>
          {
            loader
              ? <ActivityIndicator
                size={'large'}
                color={colors.lightBlue}
                style={[Styles.loader, hasConfirmPasswordError && {marginTop: 22}]}
              />
              : <Button
                onPress={this.register}
                labelStyle={Styles.buttonLabel}
                btnStyle={[Styles.button, hasConfirmPasswordError && {marginTop: 22}]}
                >
                <Text>{I18n.t('auth.signUp')}</Text>
              </Button>
          }

          <View style={Styles.termsContainer}>
            <Text style={Styles.terms}>
              {I18n.t('auth.termsText')}
            </Text>
            <View style={{flexDirection: 'row'}}>
              <Hyperlink
                onPress={this.handleLink}
                linkText={I18n.t('auth.terms')}
                linkStyle={{color: colors.lightBlue, fontWeight: '600'}}
                >
                <Text style={Styles.terms}>
                  https://www.seal-jobs.com/terms_and_conditions
                </Text>
              </Hyperlink>
              <Text style={Styles.terms}>{` & `}</Text>
              <Hyperlink
                onPress={this.handleLink}
                linkText={I18n.t('auth.privacyPolicy')}
                linkStyle={{color: colors.lightBlue, fontWeight: '600'}}
                >
                <Text style={Styles.terms}>
                  https://www.seal-jobs.com/privacy
                </Text>
              </Hyperlink>
              <Text style={Styles.terms}>.</Text>
            </View>
          </View>
          {
            !!error &&
            <View style={Styles.errorContainer}>
              <Text style={Styles.errorText}>{error}</Text>
            </View>
          }
        </KeyboardAvoidingView>
      </ScrollView>
    )
  }
}

export default Register
