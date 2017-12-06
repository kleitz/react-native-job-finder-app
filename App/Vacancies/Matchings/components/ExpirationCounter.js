import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { View, Text, StyleSheet } from 'react-native'

import utils from 'utils/utils'
import colors from 'common/colors'
import fonts from 'common/fonts'

const T = utils.translateHelper('manageApplicants')
const SEGMENT_DIGITS = 6
const EXPIRATION_HOURS = 48

const getRemainingSeconds = (expDate) => {
  const now = new Date()
  const expirationDate = new Date(expDate)
  const dif = expirationDate.getTime() - now.getTime()
  return expDate && dif > 0 ? Math.round(Math.abs(dif / 1000)) : 0
}

class ExpirationCounter extends Component {
  counter = null
  segmentLength = 0
  totalMinutes = EXPIRATION_HOURS * 60
  totalSeconds = EXPIRATION_HOURS * 60 * 60

  constructor(props) {
    super(props)

    this.state = {
      remainingTime: 0,
      counterStarted: false
    }
  }
  startCounting = () => {
    this.counter = setInterval(() => {
      const { remainingTime } = this.state
      const { expired } = this.props
      this.setState({
        remainingTime: (parseInt(remainingTime) - 1)
      })
    }, 1000)
  }
  componentDidMount () {
    const { counterStarted } = this.state
    const { expirationDate } = this.props
    const remainingTime = getRemainingSeconds(expirationDate)

    if (!counterStarted && parseInt(remainingTime) > 0) {
      this.segmentLength = Number(parseFloat(1 / this.totalMinutes).toFixed(SEGMENT_DIGITS))
      this.setState({ remainingTime, counterStarted: true }, () => this.startCounting())
    }
  }
  shouldComponentUpdate (nextProps, nextState) {
    const { remainingTime } = nextState
    const { expired } = this.props
    remainingTime === 0 && clearInterval(this.counter)
    return !expired && remainingTime >= 0
  }
  componentDidUpdate (prevProps, prevState) {
    const { remainingTime } = this.state
    const { expired } = this.props
    remainingTime === 0 && !expired && this.props.onCounterEnd()
  }
  componentWillUnmount () {
    this.counter && clearInterval(this.counter)
  }
  render() {
    const { remainingTime } = this.state
    const remainingH = !isNaN(remainingTime) ? parseInt(remainingTime / 3600) : 0
    const remainingM = !isNaN(remainingTime) ? parseInt((remainingTime % 3600) / 60) : 0
    const remainingS = !isNaN(remainingTime) ? (remainingTime - remainingH * 3600 - remainingM * 60) : 0
    const totalMinutesRemaining = remainingH * 60 + remainingM
    let expiredFlex = remainingTime > 0
      ? Number(parseFloat((this.totalMinutes - totalMinutesRemaining) * this.segmentLength).toFixed(SEGMENT_DIGITS))
      : 1

    if (remainingM === 0 && remainingS > 0) {
      expiredFlex = Number(parseFloat((this.totalMinutes - 1) * this.segmentLength).toFixed(6)) // last minute
    }

    const remainingFlex = Number(parseFloat(1 - expiredFlex).toFixed(SEGMENT_DIGITS))
    return (
      <View style={{ flex: 1, marginRight: 30 }}>
        {
          remainingTime > 0 ?
            (
              <View style={styles.progress}>
                <View style={styles.totalBar}>
                  <View style={[styles.expired, { flex: expiredFlex }]} />
                  <View style={[styles.remaining, { flex: remainingFlex }]} />
                </View>
                <Text style={styles.progressInfo}>{T('expiresInMsg')} {remainingH}:{remainingM}:{remainingS}</Text>
              </View>
            ) :
            <Text style={styles.expiredInfo}>{T('expiredMsg')}</Text>
        }
      </View>
    )
  }
}

ExpirationCounter.propTypes = {
  expirationDate: PropTypes.any,
  onCounterEnd: PropTypes.func,
  expired: PropTypes.bool
}

const styles = StyleSheet.create({
  progress: {
    flex: 1,
    flexDirection: 'column',
    paddingVertical: 2
  },
  totalBar: {
    flexDirection: 'row',
    height: 4,
    borderRadius: 4,
    backgroundColor: colors.inputBorder,
    overflow: 'hidden'
  },
  expired: {
    backgroundColor: colors.lightBlue,
    borderRadius: 6,
    overflow: 'hidden'
  },
  remaining: {
    backgroundColor: colors.inputBorder,
    borderTopRightRadius: 4,
    borderBottomRightRadius: 4
  },
  progressInfo: {
    color: colors.lightBlue,
    fontFamily: fonts.openSansLight,
    fontSize: 12
  },
  expiredInfo: {
    color: colors.salmon,
    fontSize: 12,
    fontFamily: fonts.openSansLight,
    paddingTop: 6
  }
})

export default ExpirationCounter
