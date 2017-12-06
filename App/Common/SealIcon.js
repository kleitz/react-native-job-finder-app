import React from 'react'
import PropTypes from 'prop-types'
import { View, TouchableWithoutFeedback } from 'react-native'
import { createIconSetFromIcoMoon } from 'react-native-vector-icons'
import icoMoon from '../../Assets/icoMoon.json'

const Icon = createIconSetFromIcoMoon(icoMoon)

const SealIcon = ({name, color, size, onPress, style, transclude, containerStyle}) =>
  transclude
    ? <TouchableWithoutFeedback onPress={onPress}>
      <View style={containerStyle}>
        <Icon name={name}
          color={color}          
          size={size}
          style={style}
        />
      </View>
    </TouchableWithoutFeedback>
    : <Icon name={name}
      color={color}
      onPress={onPress}
      size={size}
      style={style}
    />

SealIcon.propTypes = {
  name: PropTypes.string.isRequired,
  color: PropTypes.string,
  size: PropTypes.number,
  onPress: PropTypes.func,
  style: PropTypes.any,
  transclude: PropTypes.bool,
  containerStyle: PropTypes.any
}

export default SealIcon
