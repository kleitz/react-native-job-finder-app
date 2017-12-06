import moment from 'moment'
import { createSelector } from 'reselect'

const getSchedule = state => state.get('createVacancy').get('schedule')

const getScheduleType = createSelector(
  getSchedule,
  schedule => schedule.get('scheduleType')
)

const getDays = createSelector(
  getSchedule,
  schedule => schedule.get('days').toJS()
)

const getWeekDays = createSelector(
  getSchedule,
  schedule => Object.entries(schedule.getIn(['days', 0, 'weekDays']).toObject())
)

const getNumberOfSelectedDays = createSelector(
  getWeekDays,
  days => days.filter(day => day[1]).length
)

const getCommonCheckStatus = createSelector(
    getDays,
    days => days.filter(day => {
      const {startDate, startHour, endHour, breakInMinutes} = day
      return startDate && startHour && endHour
    }).length > 0
)

const getPeriodCheckStatus = createSelector(
    getDays,
    getCommonCheckStatus,
    getNumberOfSelectedDays,
    getScheduleType,
    (days, commonStatus, selectedDays, scheduleType) => {
      const periodStatus = scheduleType === 'fixedPeriod' ? !!days[0].endDate : true
      return (
        commonStatus &&
        selectedDays > 0 &&
        periodStatus
      )
    }
)

const getScheduleCheckStatus = createSelector(
    getScheduleType,
    getCommonCheckStatus,
    getPeriodCheckStatus,
    (scheduleType, commonStatus, periodStatus) => {
      return (
          scheduleType === 'oneDay' ||
          scheduleType === 'multipleDays'
              ? commonStatus
              : periodStatus
      )
    }
)

const convertTimeToDates = (value) => {
  if (!!value) {
    const [ hour, minute ] = value.split(':')
    return moment.utc(moment().hour(hour).minute(minute).toArray()).toISOString()
  }
  return null
}

const getFlattenDays = createSelector(
  getScheduleType,
  getSchedule,
  (scheduleType, schedule) => {
    if (scheduleType === 'multipleDays') {
      return schedule
        .get('days')
        .map(day => day.flatten())
        .map(day => day
          .set('startHour', convertTimeToDates(day.get('startHour')))
          .set('endHour', convertTimeToDates(day.get('endHour')))
      ).toJS()
    } else {
      const day = schedule.get('days').first().flatten()
      const mappedDay = day
        .set('startHour', convertTimeToDates(day.get('startHour')))
        .set('endHour', convertTimeToDates(day.get('endHour')))
        .toJS()
      return [mappedDay]
    }
  }
)

const scheduleRequest = createSelector(
  getScheduleType,
  getFlattenDays,
  (scheduleType, days) => days.reduce((acc, value, index) => ({
    ...acc,
    [index]: {
      ...value,
      scheduleType
    }}), {})
)

export default {
  scheduleRequest,
  getScheduleType,
  getDays,
  getWeekDays,
  getNumberOfSelectedDays,
  getScheduleCheckStatus
}
