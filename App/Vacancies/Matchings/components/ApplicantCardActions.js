import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { View, TouchableWithoutFeedback, Text, StyleSheet, Linking, Alert } from 'react-native'

import utils from 'utils/utils'
import fonts from 'common/fonts'
import Button from 'common/Button'
import colors from 'common/colors'
import SealIcon from 'common/SealIcon'

const T = utils.translateHelper('manageApplicants')

const ApplicantCardActions = ({ type, phoneNumber, sealCandidate, goToChat }) => {
  const callPhoneNumber = () => {
    const url = `tel:${phoneNumber}`
    if (!phoneNumber) {
      Alert.alert(T('noPhoneNumber'))
    } else {
      Linking
        .canOpenURL(url)
        .then(supported => {
          if (supported) {
            Linking.openURL(url)
          } else {
            Alert.alert(T(`noCall`))
          }
        })
        .catch(err => console.log('error', err))
    }
  }
  return (
    <View style={styles.actions}>
      <TouchableWithoutFeedback onPress={goToChat}>
        <View style={[styles.actionsBtn, { borderRightWidth: 1, borderColor: colors.inputBorder }]}>
          <Text style={styles.btnText}>
            Chat
          </Text>
        </View>
      </TouchableWithoutFeedback>
      {
        type === 'matched' && (
          <TouchableWithoutFeedback onPress={sealCandidate}>
            <View style={styles.actionsBtn}>
              <Text style={styles.btnText}>
                Seal
              </Text>
            </View>
          </TouchableWithoutFeedback>
        )
      }
      {
        type === 'sealed' && (
          <TouchableWithoutFeedback onPress={callPhoneNumber}>
            <View style={styles.actionsBtn}>
              <SealIcon
                size={17}
                name={'phone-open'}
                color={!!phoneNumber ? colors.lightBlue : colors.warmGrey}
                />
            </View>
          </TouchableWithoutFeedback>
        )
      }
    </View>
  )
}

ApplicantCardActions.propTypes = {
  type: PropTypes.string,
  phoneNumber: PropTypes.string,
  onSealPress: PropTypes.func
}

const styles = StyleSheet.create({
  actions: {
    flex: 0.4,
    flexDirection: 'row',
    borderTopWidth: 1,
    borderColor: colors.inputBorder
  },
  actionsBtn: {
    flex: 0.5,
    justifyContent: 'center',
    alignItems: 'center'
  },
  btnText: {
    fontFamily: fonts.openSans,
    fontSize: 14,
    color: colors.lightBlue,
    textAlign: 'center'
  }
})

export default ApplicantCardActions
