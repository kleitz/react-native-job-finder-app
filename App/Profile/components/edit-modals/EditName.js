import React, { Component } from 'react'
import PropTypes from 'prop-types'
import I18n from 'react-native-i18n'
import { View, TextInput } from 'react-native'
import { Actions } from 'react-native-router-flux'

import Styles from './Styles'
import colors from '../../../Common/colors'
import SealHeader from '../../../Common/SealHeader'

class EditName extends Component {
  constructor (props) {
    super(props)
    this.state = {
      firstName: this.props.firstName,
      lastName: this.props.lastName
    }
  }

  finish = () => {
    const {
      state: { firstName, lastName },
      props: { updateProfile }
    } = this
    updateProfile({ firstName, lastName })
    Actions.pop()
  }

  textChange = type => text => {
    this.setState({ [type]: text })
  }

  render () {
    const { firstName, lastName } = this.state
    return (
      <View style={Styles.container}>
        <SealHeader
          title={I18n.t('title.editName')}
          leftBtnText={I18n.t('buttons.cancel')}
          leftBtnFn={Actions.pop}
          rightBtnText={I18n.t('buttons.save')}
          rightBtnFn={this.finish}
        />
        <View style={Styles.inputWrapper}>
          <TextInput
            value={firstName}
            style={Styles.input}
            underlineColorAndroid={'transparent'}
            onChangeText={this.textChange('firstName')}
            placeholderTextColor={colors.placeholderGray}
            placeholder={I18n.t('profile.placeholders.firstName')}
          />
        </View>
        <View style={[Styles.inputWrapper, {marginTop: 0, borderTopWidth: 0}]}>
          <TextInput
            value={lastName}
            style={Styles.input}
            underlineColorAndroid={'transparent'}
            onChangeText={this.textChange('lastName')}
            placeholderTextColor={colors.placeholderGray}
            placeholder={I18n.t('profile.placeholders.lastName')}
          />
        </View>
      </View>
    )
  }
}

EditName.propTypes = {
  firstName: PropTypes.string,
  lastName: PropTypes.string,
  updateProfile: PropTypes.func
}

export default EditName
