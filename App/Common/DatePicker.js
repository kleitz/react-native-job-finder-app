import React, { Component } from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import {
  View, Text, StyleSheet, Platform, DatePickerAndroid, DatePickerIOS, Modal, TouchableWithoutFeedback
} from 'react-native'

import fonts from './fonts'
import colors from './colors.js'
import SealIcon from './SealIcon'

const OPENED_HEIGHT = 250
class DatePicker extends Component {
  state = {
    modalVisibile: false
  }

  onDateChange = (date) => {
    const { onChange, dateFormat } = this.props
    if (!!onChange && typeof onChange === 'function') {
      onChange(moment(date).format(dateFormat))
    }
  }

  setModalVisibility = visibility => () => {
    this.setState({ modalVisibile: visibility })
  }

  openAndroidPicker = () => {
    DatePickerAndroid
      .open({
        minDate: new Date()
      })
      .then(dateResponse => {
        const { onChange, dateFormat} = this.props
        const { action, year, month, day } = dateResponse
        if (action === 'dateSetAction') {
          const date = moment().set({'year': year, 'month': month, 'date': day})
          if (date > new Date() && !!onChange && typeof onChange === 'function') {
            onChange(moment(date).format(dateFormat))
          }
        }
      })
  }

  renderIOS = () => {
    const { modalVisibile } = this.state
    const {
      title, dateFormat, placeholderText,
      textContainerStyle, textStyle, selectedDate
    } = this.props
    const displayedDate = selectedDate ? new Date(selectedDate) : new Date()
    return (
      <View style={{flex: 1}}>
        <TouchableWithoutFeedback onPress={this.setModalVisibility(true)}>
          <View style={[styles.textContainer, textContainerStyle ]}>
            <Text style={[styles.text, !selectedDate && {color: colors.placeholderGray}, {height: 42}, textStyle]}>
              {
                !!selectedDate
                  ? moment(selectedDate).format(dateFormat)
                  : placeholderText
              }
            </Text>
          </View>
        </TouchableWithoutFeedback>
        <Modal visible={modalVisibile} animationType={'slide'} transparent>
          <TouchableWithoutFeedback onPress={this.setModalVisibility(false)}>
            <View style={styles.iosContainer}>
              <View style={styles.pickerIOS}>
                <View style={styles.titleContainer}>
                  <Text style={styles.titleText}>{title}</Text>
                </View>
                <DatePickerIOS
                  mode={'date'}
                  date={displayedDate}
                  minimumDate={new Date()}
                  onDateChange={this.onDateChange}
                  />
              </View>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      </View>
    )
  }

  renderAndroid = () => {
    const {
      dateFormat, placeholderText,
      textContainerStyle, textStyle, selectedDate
    } = this.props

    return (
      <TouchableWithoutFeedback onPress={this.openAndroidPicker}>
        <View style={[styles.textContainer, textContainerStyle]}>
          <Text style={[styles.text, !selectedDate && {color: colors.placeholderGray}, textStyle]}>
            {
              !!selectedDate
                ? moment(selectedDate).format(dateFormat)
                : placeholderText
            }
          </Text>
        </View>
      </TouchableWithoutFeedback>
    )
  }

  render () {
    return (
      Platform.OS === 'ios'
        ? this.renderIOS()
        : this.renderAndroid()
    )
  }
}

DatePicker.propTypes = {
  selectedDate: PropTypes.string,
  placeholderText: PropTypes.string,
  dateFormat: PropTypes.string,
  title: PropTypes.string,
  onChange: PropTypes.func,
  textContainerStyle: PropTypes.any,
  textStyle: PropTypes.any
}

const styles = StyleSheet.create({
  pickerIOS: {
    backgroundColor: colors.background,
    height: OPENED_HEIGHT
  },
  text: {
    padding: 13,
    fontSize: 14,
    fontFamily: fonts.openSansRegular,
    color: colors.dark,
    letterSpacing: -0.2
  },
  textContainer: {
    backgroundColor: colors.white,
    justifyContent: 'center',
    flex: 1,
    height: 42
  },
  iosContainer: {
    flex: 1,
    justifyContent: 'flex-end'
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
  }
})

export default DatePicker
