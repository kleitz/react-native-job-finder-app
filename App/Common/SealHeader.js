import React from 'react'
import PropTypes from 'prop-types'
import { View, Text, StyleSheet, Platform, TouchableWithoutFeedback } from 'react-native'

import fonts from './fonts'
import colors from './colors'
import Button from './Button'
import SealIcon from './SealIcon'

const parseButtonText = text => !!text ? text.split('-') : ''
const SealHeader = ({
  title,
  titleStyle,
  leftBtnText,
  leftBtnFn,
  leftBtnStyle,
  leftBtnTextStyle,
  leftIconSize,
  leftIconColor,
  rightBtnText,
  rightBtnFn,
  rightBtnStyle,
  rightBtnTextStyle,
  rightIconSize,
  rightIconColor,
  titleFn,
  titleIcon
}) => {
  const parsedLeftText = parseButtonText(leftBtnText)
  const parsedRightText = parseButtonText(rightBtnText)

  renderTitle = (titleFn) => {
    return titleFn ?
    <TouchableWithoutFeedback onPress={titleFn}>
      <View style={{flexDirection: 'row', alignItems: 'center', alignSelf: 'center'}}>
        <Text style={[styles.headerTitle, titleStyle]} numberOfLines={2} ellipsizeMode={'tail'}>
          {title}
        </Text>
        { titleIcon && <SealIcon name={titleIcon} size={10} color={colors.white} /> }
      </View>
    </TouchableWithoutFeedback>
    : <Text style={[styles.headerTitle, titleStyle, {flex: 1}]} numberOfLines={2} ellipsizeMode={'tail'}>
      {title}
    </Text>
  }

  return (
    <View style={styles.header}>
      <Button
        onPress={leftBtnFn}
        btnStyle={[styles.sideButtons, {paddingLeft: 5}, leftBtnStyle]}
        labelStyle={[styles.headerButtonText, leftBtnTextStyle]}
        >
        {
          parsedLeftText[0] === 'icon'
            ? <SealIcon name={parsedLeftText[1]} size={leftIconSize || 18} color={leftIconColor || colors.white} />
            : leftBtnText || ' '
        }
      </Button>
      { this.renderTitle(titleFn) }
      <Button
        onPress={rightBtnFn}
        btnStyle={[styles.sideButtons, rightBtnStyle]}
        labelStyle={[styles.headerButtonText, rightBtnTextStyle]}
        >
        {
          parsedRightText[0] === 'icon'
            ? <SealIcon name={parsedRightText[1]} size={rightIconSize || 18} color={rightIconColor || colors.white} />
            : rightBtnText || ' '
        }
      </Button>
    </View>
  )
}

const styles = StyleSheet.create({
  header: {
    height: 57,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    backgroundColor: colors.dark,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        paddingTop: 20,
        height: 67
      },
      android: {
        elevation: 1
      }
    })
  },
  headerButtonText: {
    color: colors.white,
    fontFamily: fonts.openSansLight
  },
  headerTitle: {
    color: 'white',
    fontSize: 16,
    padding: 8,
    textAlign: 'center',
    alignSelf: 'center',
    fontFamily: fonts.openSansRegular
  },
  sideButtons: {
    minWidth: 60,
    alignSelf: 'center',
    backgroundColor: colors.dark
  }
})

SealHeader.propTypes = {
  title: PropTypes.string,
  titleStyle: PropTypes.any,
  leftBtnText: PropTypes.string,
  leftBtnFn: PropTypes.func,
  leftBtnStyle: PropTypes.any,
  leftBtnTextStyle: PropTypes.any,
  leftIconSize: PropTypes.number,
  leftIconColor: PropTypes.string,
  rightBtnText: PropTypes.string,
  rightBtnFn: PropTypes.func,
  rightBtnStyle: PropTypes.any,
  rightBtnTextStyle: PropTypes.object,
  rightIconSize: PropTypes.number,
  rightIconColor: PropTypes.string
}

export default SealHeader
