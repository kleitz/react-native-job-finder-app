import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { NetInfo, AppState } from 'react-native'

import SplashScreen from './Common/SplashScreen'
import { initBugsnag } from './Config/BugsnagConfig'
import NavigationRouter from './Navigation/NavigationRouter'
import { getRehydrateStatus, isAuthed } from './Session/session.selectors'
import { bindPusherHandlers, unbindPusherHandlers } from './Utility/pusher/pusher.actions'
import { hasInternetConnection, noInternetConnection } from './Utility/netInfo/netInfo.actions'
import { redirectOnForeground } from './Session/session.actions'
import { fetchNotifications } from './Utility/notifications/notifications.actions'
import { getRooms } from './Chat/chat.actions'
import { getReviewsRequest } from './Profile/reviews.actions'

class RootContainer extends Component {
  static propTypes = {
    isRehydrated: PropTypes.bool,
    noInternetConnection: PropTypes.func,
    hasInternetConnection: PropTypes.func
  }

  componentDidMount () {
    initBugsnag()
    const { redirectOnForeground } = this.props
    redirectOnForeground()
    AppState.addEventListener('change', this.handleAppStateChange)
    NetInfo.isConnected.addEventListener('connectionChange', this.handleNetStatusChange)
  }

  componentWillUnmount () {
    AppState.removeEventListener('change', this.handleAppStateChange)
    NetInfo.isConnected.removeEventListener('connectionChange', this.handleNetStatusChange)
  }

  handleAppStateChange = appState => {
    const {
      bindPusherHandlers, unbindPusherHandlers, fetchNotifications, getRooms, isAuthed, getReviewsRequest
    } = this.props
    if (isAuthed) {
      if (appState === 'active') {
        bindPusherHandlers()
        fetchNotifications()
        getRooms()
        getReviewsRequest()
      } else if (appState === 'background') {
        unbindPusherHandlers()
      }
    }
  }

  handleNetStatusChange = (isConnected) => {
    const { hasInternetConnection, noInternetConnection } = this.props
    if (isConnected) {
      hasInternetConnection()
    } else {
      noInternetConnection()
    }
  }

  render () {
    const { isRehydrated } = this.props
    return isRehydrated
      ? <NavigationRouter />
      : <SplashScreen />
  }
}

const mapStateToProps = state => ({
  isRehydrated: getRehydrateStatus(state),
  isAuthed: isAuthed(state)
})

const mapDispatchToProps = dispatch => bindActionCreators({
  hasInternetConnection,
  noInternetConnection,
  bindPusherHandlers,
  unbindPusherHandlers,
  fetchNotifications,
  getRooms,
  redirectOnForeground,
  getReviewsRequest
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(RootContainer)
