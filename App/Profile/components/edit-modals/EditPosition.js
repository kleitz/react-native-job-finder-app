import React, { Component } from 'react'
import PropTypes from 'prop-types'
import I18n from 'react-native-i18n'
import { View, TextInput } from 'react-native'
import { Actions } from 'react-native-router-flux'

import Styles from './Styles'
import colors from '../../../Common/colors'
import SealHeader from '../../../Common/SealHeader'

class EditPosition extends Component {
  constructor (props) {
    super(props)
    this.state = {
      position: this.props.position
    }
  }

  finish = () => {
    this.props.updateProfile({ position: this.state.position })
    Actions.pop()
  }

  render () {
    const { position } = this.state
    return (
      <View style={Styles.container}>
        <SealHeader
          title={I18n.t('title.editPosition')}
          leftBtnText={I18n.t('buttons.cancel')}
          leftBtnFn={Actions.pop}
          rightBtnText={I18n.t('buttons.save')}
          rightBtnFn={this.finish}
        />
        <View style={Styles.inputWrapper}>
          <TextInput
            value={position}
            style={Styles.input}
            underlineColorAndroid={'transparent'}
            placeholderTextColor={colors.placeholderGray}
            placeholder={I18n.t('profile.placeholders.position')}
            onChangeText={(text) => { this.setState({position: text}) }}
          />
        </View>
      </View>
    )
  }
}

EditPosition.propTypes = {
  position: PropTypes.string,
  updateProfile: PropTypes.func
}

export default EditPosition
