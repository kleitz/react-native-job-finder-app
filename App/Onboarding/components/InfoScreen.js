import React, { Component } from 'react'
import I18n from 'react-native-i18n'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Actions, ActionConst } from 'react-native-router-flux'
import { View, Text, TextInput, StyleSheet, Keyboard } from 'react-native'

import fonts from '../../Common/fonts'
import colors from '../../Common/colors'
import SealIcon from '../../Common/SealIcon'
import SealHeader from '../../Common/SealHeader'
import { getRegistrationStatus } from '../../Session/session.selectors'
import { changeFields, changeFieldsRequest } from '../../Profile/profile.actions'
import { getOnboardingInfo, getValidPhone } from '../../Profile/profile.selectors'

class InfoScreen extends Component {
  finish = () => {
    const { changeFieldsRequest, phoneValid, registrationDone } = this.props
    if (phoneValid) {
      Keyboard.dismiss()
      changeFieldsRequest(this.props.onboardingData)
      if (registrationDone) {
        Actions.tabs({ type: ActionConst.RESET })
      } else {
        Actions.tutorial()
      }
    } else {
      alert('Contact telephone is required!')
    }
  }

  fieldChange = (field) => (text) => {
    this.props.changeFields({
      [field]: text
    })
  }

  render () {
    const {
      phoneValid,
      onboardingData: { telephone, companyWebsite, address }
    } = this.props
    return (
      <View style={styles.container}>
        <SealHeader
          title={I18n.t('title.info')}
          leftBtnFn={Actions.logoScreen}
          leftBtnText={I18n.t('buttons.back')}
          rightBtnText={I18n.t('buttons.finish')}
          rightBtnFn={this.finish}
        />
        <View style={styles.content}>
          <Text style={styles.sectionHeaderTitle}>{I18n.t('info.companyInfo')}</Text>
          <View style={styles.inputWrapper}>
            <TextInput
              value={telephone}
              style={styles.input}
              keyboardType='phone-pad'
              underlineColorAndroid='transparent'
              placeholder={I18n.t('info.contactTel')}
              onChangeText={this.fieldChange('telephone')}
            />
            {
              phoneValid &&
              <SealIcon name={'checked'} color={colors.lightBlue} style={styles.validIcon} />
            }
          </View>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              value={companyWebsite}
              underlineColorAndroid='transparent'
              placeholder={I18n.t('info.companyWeb')}
              onChangeText={this.fieldChange('companyWebsite')}
            />
          </View>
          <View style={[styles.inputWrapper, {borderBottomWidth: 1}]}>
            <TextInput
              value={address}
              style={styles.input}
              underlineColorAndroid='transparent'
              onChangeText={this.fieldChange('address')}
              placeholder={I18n.t('info.companyAddress')}
            />
          </View>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  content: {
    backgroundColor: colors.background,
    flex: 1
  },
  sectionHeaderTitle: {
    fontFamily: fonts.openSansRegular,
    fontSize: 14,
    color: colors.warmGrey,
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 3
  },
  inputWrapper: {
    borderTopWidth: 1,
    borderColor: colors.inputBorder,
    backgroundColor: colors.white,
    paddingLeft: 15,
    paddingRight: 15
  },
  input: {
    height: 42,
    fontFamily: fonts.openSansRegular,
    fontSize: 16
  },
  validIcon: {
    position: 'absolute',
    right: 10,
    top: 15
  }
})

const mapStateToProps = state => ({
  phoneValid: getValidPhone(state),
  onboardingData: getOnboardingInfo(state),
  registrationDone: getRegistrationStatus(state)
})

const mapDispatchToProps = (dispatch) => bindActionCreators({
  changeFields, changeFieldsRequest
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(InfoScreen)
