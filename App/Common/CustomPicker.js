import React, { Component } from 'react'
import PropTypes from 'prop-types'
import I18n from 'react-native-i18n'
import {
  Text,
  Picker,
  StyleSheet,
  Platform,
  View,
  Modal,
  TouchableWithoutFeedback,
  Animated
} from 'react-native'

import fonts from './fonts'
import colors from './colors.js'
import SealIcon from './SealIcon'

const OPENED_HEIGHT = 200
class CustomPicker extends Component {
  state = {
    animatedHeight: new Animated.Value(0),
    selectedValue: this.props.selectedValue,
    modalVisible: false
  }

  pickerValueChange = (value, index) => {
    const { onChange } = this.props
    if (!!onChange && typeof onChange === 'function') {
      onChange(value)
    }
    this.setState({ selectedValue: value })
  }

  androidPickerValueChange = (value, index) => {
    if (index === 0) return
    const { onChange } = this.props
    if (!!onChange && typeof onChange === 'function') {
      onChange(value)
    }
    this.setState({ selectedValue: value })
  }

  setModalVisibility = visibility => () => {
    this.setState({ modalVisible: visibility })
  }

  renderIOS = () => {
    const { animatedHeight, modalVisible, selectedValue } = this.state
    const {
      title,
      options,
      showIcon,
      iconColor,
      iconStyle,
      selectedTextContainerStyle,
      pickerTextStyle
    } = this.props
    const selectedOption = options.find(o => o.value === selectedValue)
    return (
      <View style={{ flex: 1, justifyContent: 'space-between' }}>
        <TouchableWithoutFeedback onPress={this.setModalVisibility(true)}>
          <View style={[styles.selectedTextContainer, selectedTextContainerStyle]}>
            <Text
              style={[styles.pickerText, pickerTextStyle, selectedValue && { color: colors.dark }]}
            >
              {!!selectedOption ? selectedOption.label : title}
            </Text>
            {showIcon &&
              <SealIcon
                name={'down'}
                size={6}
                color={iconColor || colors.lightBlue}
                style={[styles.iconStyle, iconStyle]}
              />}
          </View>
        </TouchableWithoutFeedback>
        <Modal visible={modalVisible} animationType={'slide'} transparent>
          <View style={styles.iosContainer}>
            <View style={styles.pickerIOS}>
              <View style={styles.titleContainer}>
                <Text style={styles.titleText}>{title}</Text>
                <TouchableWithoutFeedback onPress={this.setModalVisibility(false)}>
                  <View style={styles.doneButton}>
                    <Text style={{ color: '#fff', fontSize: 12 }}>{I18n.t('buttons.done')}</Text>
                  </View>
                </TouchableWithoutFeedback>
              </View>
              <Picker
                selectedValue={selectedValue}
                style={styles.pickerContainer}
                onValueChange={this.pickerValueChange}
              >
                {options.map((o, index) =>
                  <Picker.Item key={index} label={o.label} value={o.value} />
                )}
              </Picker>
            </View>
          </View>
        </Modal>
      </View>
    )
  }

  renderAndroid = () => {
    const { selectedValue } = this.state
    const {
      title,
      options,
      showIcon,
      iconColor,
      iconStyle,
      selectedTextContainerStyle,
      pickerTextStyle
    } = this.props
    const selectedOption = options.find(o => o.value === selectedValue)
    const newOptions = [{ label: title, value: -1 }, ...options]
    return (
      <View style={[{ flex: 1 }]}>
        <View style={[styles.selectedTextContainer, selectedTextContainerStyle]}>
          <Text
            style={[styles.pickerText, pickerTextStyle, selectedValue && { color: colors.dark }]}
          >
            {!!selectedOption ? selectedOption.label : title}
          </Text>
          {showIcon &&
            <SealIcon
              name={'down'}
              size={6}
              color={iconColor || colors.lightBlue}
              style={[styles.iconStyle, iconStyle]}
            />}
        </View>
        <Picker
          style={styles.pickerAndroid}
          selectedValue={selectedValue}
          onValueChange={this.androidPickerValueChange}
        >
          {newOptions.map((o, index) =>
            <Picker.Item
              key={index}
              label={o.label}
              value={o.value}
              color={index === 0 ? 'gray' : colors.dark}
            />
          )}
        </Picker>
      </View>
    )
  }

  render() {
    return Platform.OS === 'ios' ? this.renderIOS() : this.renderAndroid()
  }
}

CustomPicker.propTypes = {
  selectedValue: PropTypes.oneOfType([PropTypes.string.number]),
  title: PropTypes.string,
  onChange: PropTypes.func,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string,
      value: PropTypes.any
    })
  ),
  selectedTextContainerStyle: PropTypes.any,
  pickerTextStyle: PropTypes.any,
  showIcon: PropTypes.bool,
  iconColor: PropTypes.string
}

export default CustomPicker

const styles = StyleSheet.create({
  doneButton: {
    position: 'absolute',
    right: 0,
    top: 0,
    paddingRight: 10,
    height: 30,
    width: 50,
    justifyContent: 'center',
    alignItems: 'flex-end'
  },
  iconStyle: {
    marginRight: 13
  },
  selectedTextContainer: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    height: 42,
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: colors.inputBorder,
    borderBottomWidth: 1,
    borderBottomColor: colors.inputBorder
  },
  iosContainer: {
    flex: 1,
    justifyContent: 'flex-end'
  },
  pickerIOS: {
    backgroundColor: colors.background,
    height: OPENED_HEIGHT
  },
  pickerText: {
    paddingLeft: 9,
    fontFamily: fonts.openSansRegular,
    fontSize: 16,
    color: colors.placeholderGray,
    letterSpacing: -0.3
  },
  pickerAndroid: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0
  },
  labelContainer: {},
  container: {
    zIndex: 1,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0
  },
  pickerContainer: {
    backgroundColor: colors.background
  },
  titleContainer: {
    height: 30,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.dark
  },
  titleText: {
    fontSize: 14,
    fontFamily: fonts.openSansRegular,
    color: colors.white
  },
  buttons: {
    justifyContent: 'center',
    paddingTop: 10,
    paddingHorizontal: 10,
    height: 30
  }
})
