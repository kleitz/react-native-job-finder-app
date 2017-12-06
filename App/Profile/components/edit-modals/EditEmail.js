import React, { Component } from 'react'
import PropTypes from 'prop-types'
import I18n from 'react-native-i18n'
import { View, TextInput } from 'react-native'
import { Actions } from 'react-native-router-flux'

import Styles from './Styles'
import colors from '../../../Common/colors'
import SealIcon from '../../../Common/SealIcon'
import SealHeader from '../../../Common/SealHeader'

class EditEmail extends Component {
  constructor (props) {
    super(props)

    this.state = {
      email: this.props.email,
      dirty: false,
      emailError: false
    }
  }

  finish = () => {
    if (this.state.emailError) {
      alert(I18n.t('errors.invalidEmail'))
      return
    }
    this.props.updateProfile({ email: this.state.email })
    Actions.pop()
  }

  onInputChange = (email) => {
    const RegexEmail = /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{1,63}$/

    if (RegexEmail.test(email)) {
      this.setState({
        email,
        dirty: true,
        emailError: false
      })
    } else {
      this.setState({
        email,
        dirty: true,
        emailError: true
      })
    }
  }

  render () {
    const { email, dirty, emailError } = this.state

    return (
      <View style={Styles.container}>
        <SealHeader
          title={I18n.t('title.editEmail')}
          leftBtnText={I18n.t('buttons.cancel')}
          leftBtnFn={Actions.pop}
          rightBtnText={I18n.t('buttons.save')}
          rightBtnFn={this.finish}
        />
        <View style={Styles.inputWrapper}>
          <View style={Styles.inputGroupIcon}>
            {
              dirty && emailError &&
              <SealIcon name='skip' color={'red'} />
            }
            {
              dirty && !emailError &&
              <SealIcon name='apply' color={colors.lightBlue} />
            }
          </View>
          <TextInput
            value={email}
            style={Styles.input}
            keyboardType='email-address'
            onChangeText={this.onInputChange}
            underlineColorAndroid={'transparent'}
            placeholderTextColor={colors.placeholderGray}
            placeholder={I18n.t('profile.placeholders.email')}
          />
        </View>
      </View>
    )
  }
}

EditEmail.propTypes = {
  email: PropTypes.string,
  updateProfile: PropTypes.func
}

export default EditEmail
