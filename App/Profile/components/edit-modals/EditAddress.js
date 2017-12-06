import React, { Component } from 'react'
import PropTypes from 'prop-types'
import I18n from 'react-native-i18n'
import { View, TextInput } from 'react-native'
import { Actions } from 'react-native-router-flux'

import Styles from './Styles'
import colors from '../../../Common/colors'
import SealHeader from '../../../Common/SealHeader'

class EditAddress extends Component {
  constructor (props) {
    super(props)
    this.state = {
      companyStreet: this.props.companyStreet,
      companyStreetNumber: this.props.companyStreetNumber,
      companyZip: this.props.companyZip,
      companyCity: this.props.companyCity
    }
  }

  finish = () => {
    this.props.saveAddress({...this.state})
    Actions.pop()
  }

  textChange = type => text => {
    this.setState({ [type]: text })
  }

  render () {
    const { companyStreet, companyStreetNumber, companyCity, companyZip } = this.state
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
            value={companyStreet}
            style={Styles.input}
            autoCorrect={false}
            underlineColorAndroid={'transparent'}
            placeholderTextColor={colors.placeholderGray}
            onChangeText={this.textChange('companyStreet')}
            placeholder={I18n.t('profile.placeholders.companyStreet')}
          />
        </View>
        <View style={[Styles.inputWrapper, {marginTop: 0, borderTopWidth: 0}]}>
          <TextInput
            style={Styles.input}
            keyboardType={'numeric'}
            value={companyStreetNumber}
            underlineColorAndroid={'transparent'}
            placeholderTextColor={colors.placeholderGray}
            onChangeText={this.textChange('companyStreetNumber')}
            placeholder={I18n.t('profile.placeholders.companyStreetNumber')}
          />
        </View>
        <View style={[Styles.inputWrapper, {marginTop: 0, borderTopWidth: 0}]}>
          <TextInput
            value={companyCity}
            autoCorrect={false}
            style={Styles.input}
            underlineColorAndroid={'transparent'}
            placeholderTextColor={colors.placeholderGray}
            onChangeText={this.textChange('companyCity')}
            placeholder={I18n.t('profile.placeholders.companyCity')}
          />
        </View>
        <View style={[Styles.inputWrapper, {marginTop: 0, borderTopWidth: 0}]}>
          <TextInput
            value={companyZip}
            autoCorrect={false}
            style={Styles.input}
            keyboardType={'numeric'}
            underlineColorAndroid={'transparent'}
            onChangeText={this.textChange('companyZip')}
            placeholderTextColor={colors.placeholderGray}
            placeholder={I18n.t('profile.placeholders.companyZip')}
          />
        </View>
      </View>
    )
  }
}

EditAddress.propTypes = {
  companyStreet: PropTypes.string,
  companyStreetNumber: PropTypes.string,
  companyZip: PropTypes.string,
  companyCity: PropTypes.string,
  saveAddress: PropTypes.func
}

export default EditAddress
