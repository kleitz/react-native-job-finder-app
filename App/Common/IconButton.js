import React from 'react'
import PropTypes from 'prop-types'
import { TouchableOpacity, StyleSheet, Animated } from 'react-native'

import fonts from './fonts'
import colors from './colors'
import SealIcon from './SealIcon'

const styles = StyleSheet.create({
  defaultBtnStyle: {
    backgroundColor: colors.lightBlue,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    height: 42
  },
  defaultIconStyle: {
    alignSelf: 'center',
    color: colors.white,
    marginTop: 2,
    marginRight: 5
  },
  defaultLabelStyle: {
    fontFamily: fonts.openSansLight,
    color: colors.white,
    fontSize: 16,
    textAlign: 'center',
    letterSpacing: -0.3
  }
})

const IconButton = ({label, labelStyle, iconName, iconSize, iconStyle, iconColor, style, onPress, disabled, activeOpacity, animatedOpacity}) =>
  <TouchableOpacity
    onPress={onPress}
    disabled={disabled}
    activeOpacity={activeOpacity}
    style={[styles.defaultBtnStyle, style]}
    >
    <Animated.View style={{flexDirection: 'row', opacity: animatedOpacity}}>
      <SealIcon name={iconName} size={iconSize} style={[styles.defaultIconStyle, iconStyle]} color={iconColor || 'white'} />
      <Animated.Text style={[styles.defaultLabelStyle, labelStyle]}>
        {label}
      </Animated.Text>
    </Animated.View>
  </TouchableOpacity>

IconButton.propTypes = {
  label: PropTypes.string,
  labelStyle: PropTypes.any,
  iconName: PropTypes.string.isRequired,
  iconSize: PropTypes.number,
  iconStyle: PropTypes.any,
  iconColor: PropTypes.string,
  style: PropTypes.any,
  onPress: PropTypes.func,
  disabled: PropTypes.bool,
  animatedOpacity: PropTypes.any
}

export default IconButton
