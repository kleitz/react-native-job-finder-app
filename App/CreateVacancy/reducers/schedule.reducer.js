import { fromJS, Map } from 'immutable'
import {
  CHANGE_SCHEDULE_TYPE, ADD_DAY, CHANGE_DATE, CHANGE_TIMES, TOGGLE_DAY, CLEAR_VACANCY,
  FILL_EDIT_VACANCY
} from '../createVacancy.constants'
import { LOGOUT_SUCCESS } from '../../Session/session.constants'

const newDay = {
  id: null,
  startDate: null,
  endDate: null,
  startHour: null,
  endHour: null,
  breakInMinutes: null,
  weekDays: {
    monday: false,
    tuesday: false,
    wednesday: false,
    thursday: false,
    friday: false,
    saturday: false,
    sunday: false
  }
}

const initialState = fromJS({
  scheduleType: null,
  days: [
    newDay,
    newDay
  ]
})

const mapSchedules = (schedule) => {
  const {
    breakInMinutes, endDate, endHour, friday, id, monday, saturday, startDate, startHour,
    sunday, thursday, tuesday, wednesday
  } = schedule
  return {
    id,
    startDate,
    endDate,
    startHour: startHour.split('T')[1].slice(0, 5),
    endHour: endHour.split('T')[1].slice(0, 5),
    breakInMinutes,
    weekDays: {
      monday, tuesday, wednesday, thursday, friday, saturday, sunday
    }
  }
}

export default (state = initialState, action = {}) => {
  switch (action.type) {
    case CHANGE_SCHEDULE_TYPE:
      return initialState.merge({ scheduleType: action.payload.scheduleType })
    case ADD_DAY:
      return state.updateIn(['days'], null, v => v.push(fromJS(newDay)))
    case CHANGE_DATE:
      return state.setIn(
        ['days', action.payload.index, action.payload.dateType],
        action.payload.date
      )
    case CHANGE_TIMES:
      return state.setIn(
        ['days', action.payload.index, action.payload.timeType],
        action.payload.time
      )
    case TOGGLE_DAY:
      return state.updateIn(
        ['days', 0, 'weekDays', action.payload.day],
        v => !v
      )
    case FILL_EDIT_VACANCY:
      const { vacancy, isReusing } = action.payload
      const { schedules } = vacancy
      const mappedSchedules = schedules.map(mapSchedules)
      return isReusing ? state : state.withMutations(
        s => s
          .set('scheduleType', schedules[0].scheduleType)
          .set('days', fromJS(mappedSchedules))
      )
    case LOGOUT_SUCCESS:
    case CLEAR_VACANCY:
      return initialState
    default:
      return state
  }
}
