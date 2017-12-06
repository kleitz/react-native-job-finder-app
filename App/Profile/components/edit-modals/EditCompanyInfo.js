import React, { Component } from 'react'
import PropTypes from 'prop-types'
import I18n from 'react-native-i18n'
import { View, Text, TextInput, StyleSheet, Platform, TouchableWithoutFeedback } from 'react-native'
import { Actions } from 'react-native-router-flux'

import Styles from './Styles'
import fonts from '../../../Common/fonts'
import utils from '../../../Utility/utils'
import colors from '../../../Common/colors'
import SealIcon from '../../../Common/SealIcon'
import SealHeader from '../../../Common/SealHeader'

class EditCompanyInfo extends Component {
  constructor (props) {
    super(props)

    this.state = {
      ...this.props.companyInfo,
      phoneValid: true,
      phoneDirty: false
    }
  }

  finish = () => {
    if (!this.state.phoneValid) {
      alert('Make sure you enter a valid telephone number!')
      return
    }

    this.props.updateProfile({
      ...this.state
    })

    Actions.pop()
  }

  render () {
    const {
      companyName,
      description,
      companyWebsite,
      telephone,
      phoneDirty,
      phoneValid,
      address
    } = this.state

    return (
      <View style={Styles.container}>
        <SealHeader
          title={I18n.t('title.editCompanyInfo')}
          leftBtnText={I18n.t('buttons.cancel')}
          leftBtnFn={Actions.pop}
          rightBtnText={I18n.t('buttons.save')}
          rightBtnFn={this.finish}
        />
        <View style={[Styles.inputWrapper, styles.item, {marginTop: 30}]}>
          <TextInput
            style={Styles.input}
            autoCorrect={false}
            value={companyName}
            underlineColorAndroid={'transparent'}
            placeholderTextColor={colors.placeholderGray}
            placeholder={I18n.t('profile.placeholders.companyName')}
            onChangeText={(text) => { this.setState({companyName: text}) }}
          />
        </View>
        <View style={[Styles.inputWrapper, styles.item]}>
          <TextInput
            style={Styles.input}
            autoCorrect={false}
            value={description}
            underlineColorAndroid={'transparent'}
            placeholderTextColor={colors.placeholderGray}
            placeholder={I18n.t('profile.placeholders.companyDescription')}
            onChangeText={(text) => { this.setState({description: text}) }}
          />
        </View>
        <View style={[Styles.inputWrapper, styles.item]}>
          <TextInput
            autoCorrect={false}
            style={Styles.input}
            value={address}
            autoCapitalize={'none'}
            underlineColorAndroid={'transparent'}
            placeholderTextColor={colors.placeholderGray}
            placeholder={I18n.t('profile.placeholders.companyAddress')}
            onChangeText={(text) => { this.setState({address: text}) }}
          />
        </View>
        <View style={[Styles.inputWrapper, styles.item, {borderBottomWidth: 1}]}>
          <TextInput
            autoCorrect={false}
            style={Styles.input}
            value={companyWebsite}
            autoCapitalize={'none'}
            underlineColorAndroid={'transparent'}
            placeholderTextColor={colors.placeholderGray}
            placeholder={I18n.t('profile.placeholders.companyWebsite')}
            onChangeText={(text) => { this.setState({companyWebsite: text}) }}
          />
        </View>
        {
          /* <View style={[Styles.inputWrapper, styles.item, {borderBottomWidth: 1}]}>
          <TextInput
            value={telephone}
            autoCorrect={false}
            style={Styles.input}
            keyboardType={'phone-pad'}
            underlineColorAndroid={'transparent'}
            placeholderTextColor={colors.placeholderGray}
            placeholder={I18n.t('profile.placeholders.companyTelephone')}
            onChangeText={(text) => { this.setState({telephone: text, phoneDirty: true, phoneValid: utils.isPhoneValid(text)}) }}
          />
          {
            phoneDirty
              ? phoneValid
                ? <SealIcon name={'checked'} color={colors.lightBlue} style={Styles.inputGroupIcon} />
                : <SealIcon name={'skip'} color={colors.salmon} style={Styles.inputGroupIcon} />
              : null
          }
          </View>*/
        }
      </View>
    )
  }
}

let styles = StyleSheet.create({
  item: {
    marginTop: 0,
    borderBottomWidth: 0
  },
  hint: {
    fontFamily: fonts.openSansRegular,
    fontSize: 14,
    color: colors.warmGrey,
    paddingHorizontal: 50,
    textAlign: 'center',
    marginTop: 20
  },
  address: {
    fontSize: 16,
    color: colors.dark,
    fontFamily: fonts.openSansRegular,
    paddingRight: 20,
    ...Platform.select({
      ios: {
        lineHeight: 42
      },
      android: {
        textAlignVertical: 'center',
        paddingLeft: 4
      }
    })
  },
  fieldIcon: {
    position: 'absolute',
    right: 15,
    top: 42 / 2 - 15 / 2 // yeah, center it like a pro :)
  }
})

EditCompanyInfo.propTypes = {
  companyName: PropTypes.string,
  description: PropTypes.string,
  updateProfile: PropTypes.func
}

export default EditCompanyInfo
