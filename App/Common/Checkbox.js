import React from 'react'
import PropTypes from 'prop-types'
import { View, StyleSheet, Text } from 'react-native'

import colors from './colors'
import SealIcon from './SealIcon'

const Checkbox = ({checked, checkboxStyle}) =>
  <View style={[styles.box, checkboxStyle, checked && styles.checked]}>
    {
      checked &&
      <SealIcon name={'apply'} size={10} color={colors.lightBlue} />
    }
  </View>

Checkbox.propTypes = {
  checked: PropTypes.bool,
  checkboxStyle: PropTypes.any
}

export default Checkbox

const styles = StyleSheet.create({
  box: {
    backgroundColor: colors.white,
    width: 20,
    height: 20,
    borderColor: colors.placeholderGray,
    borderWidth: 1,
    borderRadius: 2,
    justifyContent: 'center',
    alignItems: 'center'
  },
  checked: {
    borderColor: colors.lightBlue
  }
})
