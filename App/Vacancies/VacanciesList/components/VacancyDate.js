import React from 'react'
import PropTypes from 'prop-types'
import { View, Text, StyleSheet } from 'react-native'

import fonts from 'common/fonts'
import colors from 'common/colors'
import SealIcon from 'common/SealIcon'

const VacancyDate = ({ schedules, componentStyle, textStyle, iconStyle }) => {
  const { startDate, endDate, scheduleType } = schedules[0]
  const multipleDaysSchedule = scheduleType === 'multipleDays'
  let multipleDatesString = ''
  multipleDaysSchedule && schedules.map((s, i) => {
    const { startDate } = s
    const comma = i === schedules.length - 1 ? '' : ','
    multipleDatesString += `${startDate}${comma} `
  })
  const multipleDates = <Text style={[styles.dateText, textStyle]} >{multipleDatesString}</Text>
  return multipleDaysSchedule
    ? (
      <View style={[styles.dateRow, componentStyle]}>
        <SealIcon name={'calendar'} style={[styles.calendarIcon, iconStyle]} size={10} />
        <Text
          numberOfLines={1}
          ellipsizeMode={'tail'}
          style={[styles.dateText, textStyle, {flex: 1}]}>
          {multipleDates}
        </Text>
      </View>)
    : (
      <View style={[styles.dateRow, componentStyle]}>
        <SealIcon name={'calendar'} style={[styles.calendarIcon, iconStyle]} size={10} />
        <Text style={[styles.dateText, textStyle]}>{startDate}</Text>
        {endDate && <SealIcon name={"arrow"} size={8} style={[iconStyle, { marginRight: 5, marginLeft: 3 }]} />}
        {endDate && <Text style={[styles.dateText, textStyle]}>{endDate}</Text>}
      </View>
    )
}

VacancyDate.propTypes = {
  schedules: PropTypes.array,
  componentStyle: PropTypes.any,
  textStyle: PropTypes.any,
  iconStyle: PropTypes.any
}

const styles = StyleSheet.create({
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  dateText: {
    color: colors.dark,
    fontFamily: fonts.openSansLight,
    fontSize: 12
  },
  calendarIcon: {
    marginRight: 7,
    height: 11
  }
})

export default VacancyDate
