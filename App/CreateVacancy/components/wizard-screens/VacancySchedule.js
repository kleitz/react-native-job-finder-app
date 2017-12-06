import React, { Component } from 'react'
import I18n from 'react-native-i18n'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { partial, capitalize } from 'lodash'
import { Actions } from 'react-native-router-flux'
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Animated,
  TouchableWithoutFeedback,
  Platform,
  Alert
} from 'react-native'

import fonts from '../../../Common/fonts'
import colors from '../../../Common/colors'
import Button from '../../../Common/Button'
import SealIcon from '../../../Common/SealIcon'
import SealHeader from '../../../Common/SealHeader'
import DatePicker from '../../../Common/DatePicker'
import CustomPicker from '../../../Common/CustomPicker'
import selectors from '../../createVacancy.selectors'
import {
  changeScheduleType,
  addDayToSchedule,
  changeDate,
  changeTimes,
  toggleDay
} from '../../createVacancy.actions'
import ProgressBar from '../widgets/ProgressBar'

const i18n = what => I18n.t(`createVacancy.vacancySchedule.${what}`)
const TYPE_HEIGHT = 90
const ANIMATION_DURATION = 300

const INVALID_DATE_MSG = 'Please enter a valid date.'
const INVALID_TIME_MSG = 'Please enter a valid hour.'

const hoursOptions = [
  {label: '07:00', value: '07:00'},
  {label: '07:30', value: '07:30'},
  {label: '08:00', value: '08:00'},
  {label: '08:30', value: '08:30'},
  {label: '09:00', value: '09:00'},
  {label: '09:30', value: '09:30'},
  {label: '10:00', value: '10:00'},
  {label: '10:30', value: '10:30'},
  {label: '11:00', value: '11:00'},
  {label: '11:30', value: '11:30'},
  {label: '12:00', value: '12:00'},
  {label: '12:30', value: '12:30'},
  {label: '13:00', value: '13:00'},
  {label: '13:30', value: '13:30'},
  {label: '14:00', value: '14:00'},
  {label: '14:30', value: '14:30'},
  {label: '15:00', value: '15:00'},
  {label: '15:30', value: '15:30'},
  {label: '16:00', value: '16:00'},
  {label: '16:30', value: '16:30'},
  {label: '17:00', value: '17:00'},
  {label: '17:30', value: '17:30'},
  {label: '18:00', value: '18:00'},
  {label: '18:30', value: '18:30'},
  {label: '19:00', value: '19:00'},
  {label: '19:30', value: '19:30'},
  {label: '20:00', value: '20:00'},
  {label: '20:30', value: '20:30'},
  {label: '21:00', value: '21:00'},
  {label: '21:30', value: '21:30'},
  {label: '22:00', value: '22:00'},
  {label: '22:30', value: '22:30'},
  {label: '23:00', value: '23:00'},
  {label: '23:30', value: '23:30'}
]

const pauseOptions = [
  {label: '0 min', value: 0},
  {label: '15 min', value: 15},
  {label: '30 min', value: 30},
  {label: '45 min', value: 45},
  {label: '60 min', value: 60},
  {label: '75 min', value: 75},
  {label: '90 min', value: 90}
]

class VacancySchedule extends Component {
  state = {
    expanded: false,
    expandHeight: new Animated.Value(0),
    scheduleItemHeight: new Animated.Value(0)
  }

  goToMain = () => {
    Actions.pop()
    setTimeout(() => {
      Actions.createVacancy()
    })
  }

  nextStep = () => {
    Actions.pop()
    setTimeout(() => {
      Actions.nvPhoto()
    })
  }

  expandTypes = () => {
    this.setState({ expanded: true }, () => {
      Animated.parallel([
        Animated.timing(this.state.expandHeight, {
          toValue: TYPE_HEIGHT * 4,
          duration: ANIMATION_DURATION
        }),
        Animated.timing(this.state.scheduleItemHeight, {
          toValue: TYPE_HEIGHT,
          duration: ANIMATION_DURATION
        })
      ]).start()
    })
  }

  collapseTypes = () => {
    Animated.parallel([
      Animated.timing(this.state.expandHeight, {
        toValue: 0,
        duration: ANIMATION_DURATION
      }),
      Animated.timing(this.state.scheduleItemHeight, {
        toValue: 0,
        duration: ANIMATION_DURATION
      })
    ]).start(() => { this.setState({ expanded: false }) })
  }

  animateTypes = (expand) => () => {
    if (expand) {
      this.expandTypes()
    } else {
      this.collapseTypes()
    }
  }

  selectScheduleType = (scheduleType) => () => {
    this.props.changeScheduleType(scheduleType)
    this.collapseTypes()
  }

  toggleWeekDay = (day, selected) => () => {
    const {toggleDay, numberOfSelectedDays: n} = this.props
    if (n === 0) {
      toggleDay(day)
    } else {
      if ((n === 1 && !selected) || n > 1) {
        toggleDay(day)
      }
    }
  }

  openCalendar = (refToCalendar) => () =>
    Platform.OS === 'ios'
      ? this[refToCalendar].setModalVisibility(true)()
      : this[refToCalendar].openAndroidPicker()

  validateDate = (pickerType, index = 0) => date => {
    const {changeDate, days, changeTimes} = this.props
    let {startDate, endDate, startHour, endHour} = days[index]

    switch (pickerType) {
      case 'startDate':
        if ((endDate && new Date(date) < new Date(endDate)) || !endDate) {
          !!changeDate && changeDate(pickerType, index, date)
        } else {
          Alert.alert(INVALID_DATE_MSG)
        }
        break

      case 'endDate':
        if ((startDate && new Date(date) > new Date(startDate)) || !startDate) {
          !!changeDate && changeDate(pickerType, index, date)
        } else {
          Alert.alert(INVALID_DATE_MSG)
        }
        break

      case 'startHour':
        if ((endHour && date < endHour) || !endHour) {
          !!changeTimes && changeTimes(pickerType, index, date)
        } else {
          Alert.alert(INVALID_TIME_MSG)
        }
        break

      case 'endHour':
        if ((startHour && date > startHour) || !startHour) {
          !!changeTimes && changeTimes(pickerType, index, date)
        } else {
          Alert.alert(INVALID_TIME_MSG)
        }
        break

      default:
        break
    }
  }

  renderOneDaySchedule = (dayIndex = 0, title = 'oneDay') => {
    const { changeDate, changeTimes, days } = this.props
    const { startDate, startHour, endHour, breakInMinutes } = days[dayIndex]
    return (
      <View style={styles.scheduleContainer} key={dayIndex}>
        <View style={styles.calendarPickerRow}>
          <DatePicker
            selectedDate={startDate}
            title={i18n(title)}
            dateFormat={'YYYY-MM-DD'}
            placeholderText={i18n('pickDate')}
            ref={input => { this[`fromDatePicker${dayIndex}`] = input }}
            onChange={partial(changeDate, 'startDate', dayIndex)}
            />
          <SealIcon name={'calendar'} size={17} color={colors.white}
            transclude
            containerStyle={styles.calendarIconContainer}
            onPress={this.openCalendar(`fromDatePicker${dayIndex}`)} />
        </View>
        <View style={styles.timePickerRow}>
          <CustomPicker
            showIcon
            options={hoursOptions}
            selectedValue={startHour}
            title={i18n('startHour')}
            pickerTextStyle={styles.timePickerText}
            onChange={this.validateDate('startHour', dayIndex)}
            selectedTextContainerStyle={styles.borderRight}
            />
          <CustomPicker
            showIcon
            options={hoursOptions}
            selectedValue={endHour}
            title={i18n('endHour')}
            pickerTextStyle={styles.timePickerText}
            onChange={this.validateDate('endHour', dayIndex)}
            selectedTextContainerStyle={styles.borderRight}
            />
          <CustomPicker
            showIcon
            title={i18n('pause')}
            options={pauseOptions}
            selectedValue={breakInMinutes}
            pickerTextStyle={styles.timePickerText}
            onChange={partial(changeTimes, 'breakInMinutes', dayIndex)}
            />
        </View>
      </View>
    )
  }

  renderMultipleDays = () => {
    const {days, addDayToSchedule} = this.props
    const multipleDays = days.map((day, index) => this.renderOneDaySchedule(index, 'multipleDays'))
    return (
      <View>
        {multipleDays}
        <Button btnStyle={{marginVertical: 30, marginHorizontal: 20}} onPress={addDayToSchedule}>
          {i18n('addDay')}
        </Button>
      </View>
    )
  }

  renderPeriodSchedule = (hasToDate = true, title = 'fixedPeriod') => {
    const { changeTimes, weekDays, days } = this.props
    const { startDate, endDate, startHour, endHour, breakInMinutes } = days[0]
    return (
      <View style={[styles.scheduleContainer, {marginTop: 10}]}>
        <View style={{flexDirection: 'row', flex: 1}}>
          <View style={{flex: 1}}>
            <Text style={[styles.infoText, {alignSelf: 'flex-start', paddingBottom: 3}]}>
              {i18n('from')}
            </Text>
            <View style={styles.calendarPickerRow}>
              <DatePicker
                title={i18n(title)}
                dateFormat={'YYYY-MM-DD'}
                selectedDate={startDate}
                placeholderText={i18n('pickDate')}
                ref={input => { this.fromDatePicker = input }}
                onChange={this.validateDate('startDate')}
                />
              <SealIcon name={'calendar'} size={17} color={colors.white} transclude
                containerStyle={styles.calendarIconContainer}
                onPress={this.openCalendar('fromDatePicker')} />
            </View>
          </View>

          <View style={{flex: 1}}>
            <Text style={[styles.infoText, {alignSelf: 'flex-start', paddingBottom: 3}]}>
              {i18n('to')}
            </Text>
            {
              hasToDate
                ? <View style={styles.calendarPickerRow}>
                  <DatePicker
                    title={i18n('fixedPeriod')}
                    selectedDate={endDate}
                    dateFormat={'YYYY-MM-DD'}
                    placeholderText={i18n('pickDate')}
                    ref={input => { this.toDatePicker = input }}
                    onChange={this.validateDate('endDate')}
                    />
                  <SealIcon name={'calendar'} size={17} color={colors.white} transclude
                    containerStyle={styles.calendarIconContainer}
                    onPress={this.openCalendar('toDatePicker')} />
                </View>
                : <SealIcon transclude name={'infinite'} color={colors.greyish}
                  containerStyle={[{
                    flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.white
                  }, styles.borderTop]} />
            }
          </View>
        </View>

        <View style={styles.timePickerRow}>
          <CustomPicker
            showIcon
            options={hoursOptions}
            title={i18n('startHour')}
            selectedValue={startHour}
            pickerTextStyle={styles.timePickerText}
            selectedTextContainerStyle={styles.borderRight}
            onChange={this.validateDate('startHour')}
          />
          <CustomPicker
            showIcon
            title={i18n('endHour')}
            options={hoursOptions}
            selectedValue={endHour}
            pickerTextStyle={styles.timePickerText}
            selectedTextContainerStyle={styles.borderRight}
            onChange={this.validateDate('endHour')}
            />
          <CustomPicker
            showIcon
            title={i18n('pause')}
            options={pauseOptions}
            selectedValue={breakInMinutes}
            pickerTextStyle={styles.timePickerText}
            onChange={partial(changeTimes, 'breakInMinutes', 0)}
          />
        </View>

        <Text style={[styles.infoText, {marginTop: 20}]}>{i18n('daysInWeek')}</Text>

        <View style={[styles.weekRow, styles.borderBottom, styles.borderTop]}>
          {
            weekDays.map((day, index) => {
              return (
                <TouchableWithoutFeedback key={index} onPress={this.toggleWeekDay(day[0], day[1])}>
                  <View style={[styles.weekday, styles.borderRight, day[1] && styles.selectedWeekday]}>
                    <Text style={[styles.weekdayText, day[1] && styles.selectedWeekdayText]}>
                      { capitalize(I18n.t(`createVacancy.weekdays.${day[0]}`).slice(0, 2)) }
                    </Text>
                  </View>
                </TouchableWithoutFeedback>
              )
            })
          }
        </View>
      </View>
    )
  }

  renderIndefiniteSchedule = () => {
    return this.renderPeriodSchedule(false, 'indefiniteDuration')
  }

  renderSelectedSchedule = () => {
    const { scheduleType } = this.props
    switch (scheduleType) {
      case 'oneDay':
        return this.renderOneDaySchedule()
      case 'multipleDays':
        return this.renderMultipleDays()
      case 'fixedPeriod':
        return this.renderPeriodSchedule()
      case 'indefiniteDuration':
        return this.renderIndefiniteSchedule()
      default:
        return null
    }
  }

  render () {
    const { expanded, expandHeight, scheduleItemHeight } = this.state
    const { scheduleType, validation } = this.props
    return (
      <View style={{flex: 1, backgroundColor: colors.background}}>
        <SealHeader
          title={i18n('title')}
          leftIconSize={14}
          leftBtnFn={this.goToMain}
          leftBtnText={'icon-back'}
          />
        <ScrollView style={{flex: 1, backgroundColor: colors.background}}>
          <ProgressBar step={5} totalSteps={9} />
          <TouchableWithoutFeedback onPress={expanded ? this.animateTypes(false) : this.animateTypes(true)}>
            <View style={[styles.typeSelector, styles.borderBottom]}>
              <SealIcon name={'calendar'} color={colors.lightBlue} size={16}
                style={{marginLeft: 13, marginRight: 9}} />
              <Text style={[styles.inputText, !scheduleType && {color: colors.greyish}, {flex: 1, paddingLeft: 0}]}>
                {
                  scheduleType
                    ? i18n(scheduleType)
                    : i18n('type')
                }
              </Text>
              <SealIcon name={expanded ? 'up' : 'down'} color={colors.lightBlue} size={8}
                style={{marginLeft: 13, marginRight: 13}} />
            </View>
          </TouchableWithoutFeedback>
          {
            (!expanded && !scheduleType) &&
            <Text style={styles.infoText}>
              {i18n('typeDescription')}
            </Text>
          }
          {
            expanded &&
            <Animated.View style={[{height: expandHeight}]}>
              <TouchableWithoutFeedback onPress={this.selectScheduleType('oneDay')}>
                <Animated.View style={[styles.scheduleTypeItem, {height: scheduleItemHeight}]}>
                  <Text style={styles.scheduleTypeTitle}>
                    {i18n('oneDay')}
                  </Text>
                  <Text style={styles.scheduleTypeDescription}>
                    {i18n('oneDayDescription')}
                  </Text>
                </Animated.View>
              </TouchableWithoutFeedback>
              <TouchableWithoutFeedback onPress={this.selectScheduleType('multipleDays')}>
                <Animated.View style={[styles.scheduleTypeItem, {height: scheduleItemHeight}]}>
                  <Text style={styles.scheduleTypeTitle}>
                    {i18n('multipleDays')}
                  </Text>
                  <Text style={styles.scheduleTypeDescription}>
                    {i18n('multipleDaysDescription')}
                  </Text>
                </Animated.View>
              </TouchableWithoutFeedback>
              <TouchableWithoutFeedback onPress={this.selectScheduleType('fixedPeriod')}>
                <Animated.View style={[styles.scheduleTypeItem, {height: scheduleItemHeight}]}>
                  <Text style={styles.scheduleTypeTitle}>
                    {i18n('fixedPeriod')}
                  </Text>
                  <Text style={styles.scheduleTypeDescription}>
                    {i18n('fixedPeriodDescription')}
                  </Text>
                </Animated.View>
              </TouchableWithoutFeedback>
              <TouchableWithoutFeedback onPress={this.selectScheduleType('indefiniteDuration')}>
                <Animated.View style={[styles.scheduleTypeItem, {height: scheduleItemHeight}]}>
                  <Text style={styles.scheduleTypeTitle}>
                    {i18n('indefiniteDuration')}
                  </Text>
                  <Text style={styles.scheduleTypeDescription}>
                    {i18n('indefiniteDurationDescription')}
                  </Text>
                </Animated.View>
              </TouchableWithoutFeedback>
            </Animated.View>
          }
          {
            this.renderSelectedSchedule()
          }
          {
            !!scheduleType &&
            <Text style={[styles.infoText, {marginBottom: 20}]}>
              {i18n(`${scheduleType}Explanation`)}
            </Text>
          }
        </ScrollView>
        <Button
          opacity={1}
          onPress={this.nextStep}
          btnStyle={styles.nextBtn}
          disabled={!validation.schedule}
        >
          {I18n.t('buttons.next').toUpperCase()}
        </Button>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  selectedWeekdayText: {
    color: colors.white
  },
  weekdayText: {
    fontSize: 14,
    fontFamily: fonts.openSansRegular,
    color: colors.warmGrey,
    letterSpacing: -0.2
  },
  selectedWeekday: {
    backgroundColor: colors.lightBlue
  },
  weekday: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  weekRow: {
    marginTop: 6,
    flex: 1,
    flexDirection: 'row',
    height: 44,
    backgroundColor: colors.white
  },
  timePickerText: {
    paddingLeft: 13,
    fontSize: 14,
    fontFamily: fonts.openSansRegular,
    color: colors.placeholderGray,
    letterSpacing: -0.2
  },
  timePickerRow: {
    flexDirection: 'row'
  },
  calendarIconContainer: {
    width: 42,
    height: 42,
    backgroundColor: colors.lightBlue,
    justifyContent: 'center',
    alignItems: 'center'
  },
  calendarPickerRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.white,
    borderTopColor: colors.inputBorder,
    borderTopWidth: 1,
    height: 44
  },
  scheduleContainer: {
    marginTop: 30
  },
  scheduleTypeTitle: {
    fontFamily: fonts.openSansRegular,
    fontSize: 16,
    letterSpacing: -0.3,
    paddingLeft: 13,
    paddingTop: 13,
    color: colors.dark
  },
  scheduleTypeDescription: {
    fontFamily: fonts.openSansLight,
    paddingLeft: 13,
    paddingTop: 5,
    fontSize: 14,
    letterSpacing: -0.2,
    color: colors.warmGrey
  },
  scheduleTypeItem: {
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.inputBorder
  },
  typeSelector: {
    backgroundColor: colors.white,
    height: 50,
    flexDirection: 'row',
    alignItems: 'center'
  },
  borderBottom: {
    borderBottomWidth: 1,
    borderBottomColor: colors.inputBorder
  },
  borderTop: {
    borderTopWidth: 1,
    borderTopColor: colors.inputBorder
  },
  borderRight: {
    borderRightWidth: 1,
    borderRightColor: colors.inputBorder
  },
  inputText: {
    paddingLeft: 13,
    fontSize: 16,
    fontFamily: fonts.openSansRegular,
    color: colors.dark,
    letterSpacing: -0.3
  },
  infoText: {
    marginTop: 10,
    marginHorizontal: 13,
    fontSize: 14,
    fontFamily: fonts.openSansRegular,
    letterSpacing: -0.2,
    color: colors.warmGrey,
    textAlign: 'center'
  },
  button: {
    marginVertical: 6,
    marginHorizontal: 13
  },
  nextBtn: {
    borderRadius: 0,
    height: 50
  }
})

const mapStateToProps = state => ({
  scheduleType: selectors.schedule.getScheduleType(state),
  days: selectors.schedule.getDays(state),
  weekDays: selectors.schedule.getWeekDays(state),
  numberOfSelectedDays: selectors.schedule.getNumberOfSelectedDays(state),
  validation: selectors.getCompleteStatus(state)
})

const mapDispatchToProps = dispatch => bindActionCreators({
  changeScheduleType, addDayToSchedule, changeDate, changeTimes, toggleDay
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(VacancySchedule)
