import React from 'react'
import PropTypes from 'prop-types'
import I18n from 'react-native-i18n'
import {
  View, StyleSheet, TouchableWithoutFeedback, Text
} from 'react-native'

import fonts from '../../Common/fonts'
import colors from '../../Common/colors'

const ModalButtons = ({type, confirm, cancel, hasCancel}) => {
  return (
    <View style={styles.container}>
      {
        hasCancel &&
        <TouchableWithoutFeedback onPress={cancel}>
          <View style={[styles.button, styles.borderRight]}>
            <Text style={[styles.buttonText, styles.noButtonText]}>
              {I18n.t('buttons.cancel')}
            </Text>
          </View>
        </TouchableWithoutFeedback>
      }
      <TouchableWithoutFeedback onPress={confirm}>
        <View style={styles.button}>
          <Text style={[styles.buttonText, styles.yesButtonText]}>
            {I18n.t(`confirmationModals.${type}Confirm`)}
          </Text>
        </View>
      </TouchableWithoutFeedback>
    </View>
  )
}

ModalButtons.propTypes = {
  confirm: PropTypes.func.isRequired,
  cancel: PropTypes.func.isRequired,
  hasCancel: PropTypes.bool
}

const styles = StyleSheet.create({
  container: {
    borderTopWidth: 1,
    borderTopColor: 'rgb(238, 238, 238)',
    flexDirection: 'row',
    alignItems: 'center',
    width: 300,
    height: 45
  },
  borderRight: {
    borderRightWidth: 1,
    borderRightColor: 'rgb(238, 238, 238)'
  },
  button: {
    flex: 1,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center'
  },
  buttonText: {
    fontSize: 16,
    fontFamily: fonts.openSansRegular,
    textAlign: 'center'
  },
  noButtonText: {
    color: colors.warmGrey
  },
  yesButtonText: {
    color: colors.lightBlue
  }
})

export default ModalButtons
