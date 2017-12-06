import React from 'react'
import PropTypes from 'prop-types'
import { TouchableOpacity, Text, StyleSheet } from 'react-native'

import fonts from './fonts'
import colors from './colors'

const styles = StyleSheet.create({
  defaultBtnStyle: {
    backgroundColor: colors.lightBlue,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    height: 42
  },
  defaultLabelStyle: {
    fontFamily: fonts.openSansRegular,
    color: colors.white,
    fontSize: 16,
    textAlign: 'center',
    letterSpacing: -0.3
  },
  reverseBtnStyle: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.lightBlue
  },
  reverseButtonStyle: {
    color: colors.lightBlue
  },
  disabled: {
    backgroundColor: colors.placeholderGray
  }
})

const Button = ({onPress, labelStyle, btnStyle, opacity, children, reverse, disabled}) =>
  <TouchableOpacity onPress={disabled ? () => {} : onPress} style={[styles.defaultBtnStyle, reverse && styles.reverseBtnStyle, btnStyle, disabled && styles.disabled]} activeOpacity={opacity || 0.5}>
    <Text style={[styles.defaultLabelStyle, reverse && styles.reverseButtonStyle, labelStyle]}>
      {children}
    </Text>
  </TouchableOpacity>

Button.propTypes = {
  opacity: PropTypes.number,
  onPress: PropTypes.func,
  labelStyle: PropTypes.any,
  btnStyle: PropTypes.any,
  children: PropTypes.any
}

export default Button
