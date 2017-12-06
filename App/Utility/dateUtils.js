import moment from 'moment'

const REFERENCE = moment()
const TODAY = REFERENCE.clone().startOf('day')
const YESTERDAY = REFERENCE.clone().subtract(1, 'days').startOf('day')

export const isToday = (dateString) => moment(dateString).isSame(TODAY, 'd')
export const isYesterday = (dateString) => moment(dateString).isSame(YESTERDAY, 'd')
export const format = (dateString, formatString) => moment(dateString).format(formatString)
export const valueOf = (dateString) => moment(dateString).valueOf()
