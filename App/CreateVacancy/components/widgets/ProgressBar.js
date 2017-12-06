import React from 'react'
import PropTypes from 'prop-types'
import { View, StyleSheet, Dimensions } from 'react-native'

import colors from '../../../Common/colors'

const { width } = Dimensions.get('window')
const ProgressBar = ({step, totalSteps}) => {
  const stepSize = width / (totalSteps || 6)

  return (
    <View style={[styles.container, {width: step * stepSize}]} />
  )
}

ProgressBar.propTypes = {
  step: PropTypes.number.isRequired
}

export default ProgressBar

const styles = StyleSheet.create({
  container: {
    height: 7,
    backgroundColor: colors.lightBlue
  }
})
