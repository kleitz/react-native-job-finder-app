import React, { Component } from 'react'
import PropTypes from 'prop-types'
import I18n from 'react-native-i18n'
import { Actions } from 'react-native-router-flux'
import { View, TextInput, Keyboard } from 'react-native'

import Styles from './Styles'
import colors from '../../../Common/colors'
import SealIcon from '../../../Common/SealIcon'
import SealHeader from '../../../Common/SealHeader'
import utils from '../../../Utility/utils'

class EditMobile extends Component {
  constructor (props) {
    super(props)

    this.state = {
      mobile: this.props.mobile
    }
  }

  finish = () => {
    if (utils.isPhoneValid(this.state.mobile)) {
      Keyboard.dismiss()
      this.props.updateProfile({ mobile: this.state.mobile })
      Actions.pop()
    } else {
      alert(I18n.t('profile.alerts.invalidPhone'))
    }
  }

  render () {
    const { mobile } = this.state

    return (
      <View style={Styles.container}>
        <SealHeader
          title={I18n.t('title.editMobile')}
          leftBtnText={I18n.t('buttons.cancel')}
          leftBtnFn={Actions.pop}
          rightBtnText={I18n.t('buttons.save')}
          rightBtnFn={this.finish}
        />
        <View style={Styles.inputWrapper}>
          <TextInput
            value={mobile}
            style={Styles.input}
            keyboardType={'phone-pad'}
            underlineColorAndroid={'transparent'}
            placeholderTextColor={colors.placeholderGray}
            placeholder={I18n.t('profile.placeholders.mobile')}
            onChangeText={(text) => { this.setState({mobile: text}) }}
          />
          {
            utils.isPhoneValid(mobile) &&
            <SealIcon name={'checked'} color={colors.lightBlue} style={Styles.inputGroupIcon} />
          }
        </View>
      </View>
    )
  }
}

EditMobile.propTypes = {
  mobile: PropTypes.string,
  updateProfile: PropTypes.func
}

export default EditMobile
